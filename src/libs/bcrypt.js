const bcrypt = require('bcrypt');
const saltRound = 10
const hashPassword = (plainPassword) => {
    return bcrypt.hashSync(plainPassword, saltRound)
}

const comparePassword = (plainTextPassword, hashPassword) => {
    const result = bcrypt.compareSync(plainTextPassword, hashPassword)
    return result
}
module.exports = {
    hashPassword,
    comparePassword
}