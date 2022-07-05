const mongoose = require("mongoose");
require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../model/model.user')
const { hashPassword, comparePassword } = require('../libs/bcrypt')

const addUser = async (req, res) => {
    try {
        const { username, name, password, gender, role } = req.body
        const newPassword = hashPassword(password)
        const userExist = await User.findOne({ username })
        if (userExist) throw { status: 400, message: `User with username ${username} already exist` }
        const user = new User({ _id: new mongoose.Types.ObjectId(), username, password: newPassword, name, gender, role })
        const result = await user.save()
        if (!result) throw { status: 400, message: 'Failed to insert user' }
        res.status(200).send({ status: 200, message: 'User created' })
    } catch (err) {
        res.status(err.status || 504).send({ status: err.status || 504, message: err.message })
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })
        if (!user) throw { status: 400, message: `User with username ${username} not found` }
        const check = comparePassword(password, user.password)
        if (!check) throw { status: 400, message: 'Wrong password' }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.TOKEN_KEY, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ status: 200, message: 'Login success', token })
    } catch (err) {
        console.log(err.message);
        res.status(err.status || 504).send({ status: err.status || 504, message: err.message })
    }
}

const deleteUser = async (req, res) => {
    try {
        const { username } = req.params
        await Promise.all([
            User.deleteOne({ username })
        ])
        res.status(200).send({ status: 200, message: 'User deleted' })
    } catch (err) {
        res.status(err.status || 504).send({ status: err.status || 504, message: err.message })
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        let { username, name, gender, role } = req.body
        if (!(username || name || gender || role)) throw { status: 400, message: 'Please check your request body' }
        const { modifiedCount } = await User.updateOne({ _id: id }, req.body)
        if (!modifiedCount) throw { status: 400, message: `User with id ${id} not found` }
        res.status(200).send({ status: 200, message: 'Update user success' })
    } catch (err) {
        res.status(err.status || 504).send({ status: err.status || 504, message: err.message })
    }
}

const getUserDetail = async (req, res) => {
    try {
        const { id } = req.user
        const user = await User.findOne({ _id: id })
        if (!user) throw { status: 200, message: 'User not found' }
        user.password =
            res.status(200).send({ status: 200, data: user })
    } catch (err) {
        res.status(err.status || 504).send({ status: err.status || 504, message: err.message })
    }
}

const getUserDetailById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findOne({ _id: id })
        if (!user) throw { status: 200, message: 'User not found' }
        res.status(200).send({ status: 200, data: user })
    } catch (err) {
        res.status(err.status || 504).send({ status: err.status || 504, message: err.message })
    }
}

const getUsers = async (req, res) => {
    try {
        let { page, limit, search } = req.query
        page = page || 1
        limit = limit || 10
        search = search || ''
        const users = await User.find({
            $or: [
                { username: { $regex: '.*' + search + '.*' } },
                { name: { $regex: '.*' + search + '.*' } }
            ]
        }).limit(limit).skip((page - 1) * limit).exec()
        const count = await User.countDocuments({
            $or: [
                { username: { $regex: '.*' + search + '.*' } },
                { name: { $regex: '.*' + search + '.*' } }
            ]
        });
        res.status(200).send({
            status: 200,
            data: users,
            pagination: {
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                totalData: count
            }
        });
    } catch (err) {
        res.status(err.status || 504).send({ status: err.status || 504, message: err.message })
    }
}

module.exports = {
    addUser, getUserDetail, getUserDetailById, deleteUser, updateUser, login, getUsers
}