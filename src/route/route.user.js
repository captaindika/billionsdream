const express = require('express');
const router = express.Router();
const { updateUser, deleteUser, login, addUser, getUsers, getUserDetailById, getUserDetail } = require('../controller/controller.user')
const { verifyToken, isAdmin } = require('../libs/libs.jwt')

router.post('/login', login)

router.post('', verifyToken, isAdmin, addUser);
router.delete('/:id', verifyToken, isAdmin, deleteUser)
router.put('/:id', verifyToken, isAdmin, updateUser)
router.get('', verifyToken, isAdmin, getUsers)

router.get('/detail', verifyToken, getUserDetail)
router.get('/:id', verifyToken, isAdmin, getUserDetailById)



module.exports = router;