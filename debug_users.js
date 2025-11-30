const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/extracurricular-portal')
    .then(async () => {
        console.log('Connected to DB');

        const userSchema = new mongoose.Schema({
            name: String,
            email: String,
            password: String,
            role: String
        });

        const User = mongoose.model('User', userSchema);

        const users = await User.find({});
        console.log('Users found:', users);

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
