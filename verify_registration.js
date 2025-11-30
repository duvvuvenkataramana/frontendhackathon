const mongoose = require('mongoose');

async function verify() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/extracurricular-portal');
        console.log('Connected to DB');

        // 1. Get a Student
        const User = mongoose.model('User', new mongoose.Schema({ name: String, role: String, email: String }));
        let student = await User.findOne({ role: 'student' });
        if (!student) {
            console.log('No student found, creating one...');
            student = await new User({ name: 'Test Student', email: 'test@student.com', role: 'student' }).save();
        }
        console.log('Student ID:', student._id);

        // 2. Get an Event
        const Event = mongoose.model('Event', new mongoose.Schema({ name: String, participants: Number }));
        let event = await Event.findOne();
        if (!event) {
            console.log('No event found, creating one...');
            event = await new Event({ name: 'Test Event', participants: 0 }).save();
        }
        console.log('Event ID:', event._id);

        // 3. Register via API
        console.log('Attempting registration via API...');
        const response = await fetch('http://localhost:5000/api/registrations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId: student._id, eventId: event._id })
        });

        const data = await response.json();
        console.log('API Response:', data);

        if (response.ok) {
            console.log('Registration SUCCESS!');
        } else if (data.message === 'Already registered for this event') {
            console.log('Registration verified (already registered).');
        } else {
            console.error('Registration FAILED.');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

verify();
