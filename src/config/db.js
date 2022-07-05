const mongoose = require("mongoose");
const User = require('../model/model.user')
const { hashPassword } = require('../libs/bcrypt')
require('dotenv').config()
const dbConnect = async () => {
    mongoose
        .connect(
            process.env.MONGOURI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                autoIndex: true,
            }
        )
        .then(async () => {
            console.log("Successfully connected to MongoDB!");
            const admin = await User.findOne({ username: 'admin' })
            if (!admin) await User.create({ _id: new mongoose.Types.ObjectId(), username: 'admin', password: hashPassword(process.env.ADMIN_PASS), name: 'super admin', gender: 'male', role: 'admin' })
        })
        .catch((error) => {
            console.log("Unable to connect to MongoDB!");
            console.error(error);
        });
}

module.exports = dbConnect;