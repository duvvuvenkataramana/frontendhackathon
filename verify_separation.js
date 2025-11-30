const mongoose = require('mongoose');

async function verifySeparation() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/extracurricular-portal');
        console.log('Connected to DB');

        const Admin = mongoose.model('Admin', new mongoose.Schema({ email: String }, { strict: false }));
        const Student = mongoose.model('Student', new mongoose.Schema({ email: String }, { strict: false }));

        // Check Admins
        const admins = await Admin.find({});
        console.log('Admins:', admins.length);
        if (admins.length > 0) console.log('Admin Sample:', admins[0].email);

        // Check Students
        const students = await Student.find({});
        console.log('Students:', students.length);
        if (students.length > 0) console.log('Student Sample:', students[0].email);

        // Create Test Users if empty
        if (admins.length === 0) {
            console.log('Creating test admin...');
            // Note: We can't easily use the API here without running the server, 
            // but we can check if the server created defaults or if we need to signup.
            // Since we removed the auto-create logic in server.js (oops, I might have removed it),
            // we should rely on the signup API.
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

verifySeparation();
