const mongoose = require('mongoose');

async function inspectDB() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/extracurricular-portal');
        console.log('Connected to DB');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const Student = mongoose.model('Student', new mongoose.Schema({}, { strict: false }));

        const users = await User.find({});
        console.log('\n--- Users Collection ---');
        console.log(JSON.stringify(users, null, 2));

        const students = await Student.find({});
        console.log('\n--- Students Collection ---');
        console.log(JSON.stringify(students, null, 2));

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

inspectDB();
