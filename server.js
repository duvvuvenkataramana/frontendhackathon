const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const svgCaptcha = require('svg-captcha');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow frontend origin
  credentials: true // Allow cookies for session
}));
app.use(express.json());
app.use(session({
  secret: 'your-secret-key', // In production, use a secure env variable
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Captcha Route
app.get('/api/captcha', (req, res) => {
  const captcha = svgCaptcha.createMathExpr({
    size: 6,
    noise: 2,
    color: true,
    background: '#f0f0f0',
    mathMin: 1,
    mathMax: 9,
    mathOperator: '+'
  });
  req.session.captcha = captcha.text;
  res.type('svg');
  res.status(200).send(captcha.data);
});

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/extracurricular-portal')
  .then(async () => {
    console.log('MongoDB connected');
    // We will create default users via signup or manual script if needed
  })
  .catch(err => console.log(err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Backend server is running' });
});

// Event Schema
const eventSchema = new mongoose.Schema({
  name: String,
  date: String,
  time: String,
  participants: Number,
  status: String,
});

const Event = mongoose.model('Event', eventSchema);

// Event routes
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/events', async (req, res) => {
  const event = new Event(req.body);
  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/events/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin Schema
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);

// Student Schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'student' },
  rollNumber: String,
  department: String,
  year: String,
  createdAt: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', studentSchema);

// Registration Schema
const registrationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  timestamp: { type: Date, default: Date.now }
});

// Prevent duplicate registrations
registrationSchema.index({ studentId: 1, eventId: 1 }, { unique: true });

const Registration = mongoose.model('Registration', registrationSchema);

// Routes

// Signup Route
app.post('/api/users/signup', async (req, res) => {
  const { name, email, password, role, rollNumber, department, year } = req.body;

  try {
    if (role === 'admin') {
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) return res.status(400).json({ message: 'Admin already exists' });

      const newAdmin = new Admin({ name, email, password, role: 'admin' });
      await newAdmin.save();
      res.status(201).json({ message: 'Admin created successfully', user: newAdmin });
    } else {
      const existingStudent = await Student.findOne({ email });
      if (existingStudent) return res.status(400).json({ message: 'Student already exists' });

      const newStudent = new Student({ name, email, password, role: 'student', rollNumber, department, year });
      await newStudent.save();
      res.status(201).json({ message: 'Student created successfully', user: newStudent });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login Route
app.post('/api/users/login', async (req, res) => {
  const { email, password, captcha, role } = req.body;

  // Verify Captcha
  if (!req.session.captcha || req.session.captcha !== captcha) {
    return res.status(400).json({ message: 'Invalid Captcha' });
  }

  try {
    let user;
    if (role === 'admin') {
      user = await Admin.findOne({ email, password });
    } else {
      user = await Student.findOne({ email, password });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Registration Routes

// Register for an event
app.post('/api/registrations', async (req, res) => {
  const { studentId, eventId } = req.body;
  try {
    // Check if already registered
    const existing = await Registration.findOne({ studentId, eventId });
    if (existing) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    const registration = new Registration({ studentId, eventId });
    await registration.save();

    // Optional: Increment participant count in Event
    await Event.findByIdAndUpdate(eventId, { $inc: { participants: 1 } });

    res.status(201).json({ message: 'Registration successful', registration });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get registrations for a student
app.get('/api/registrations/student/:studentId', async (req, res) => {
  try {
    const registrations = await Registration.find({ studentId: req.params.studentId })
      .populate('eventId'); // Populate event details
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get registrations for an event (Admin)
app.get('/api/registrations/event/:eventId', async (req, res) => {
  try {
    const registrations = await Registration.find({ eventId: req.params.eventId })
      .populate('studentId', 'name email rollNumber department year'); // Populate student details
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all students (for admin view if needed)
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
