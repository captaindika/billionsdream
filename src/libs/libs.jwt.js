const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        // check header or url parameters or post parameters for token
        if (!req.headers['authorization']) throw {
            status: 401, message: 'Access token is missing or invalid'
        }

        const token = req.headers['authorization'].split(' ')[1];
        if (!token) throw { status: 401, message: 'Access token is missing or invalid' }

        // verifies secret and checks exp
        jwt.verify(token, process.env.ACCESS_TOKEN_KEY, function (err, decoded) {
            if (err) throw { status: 401, message: 'Failed to authenticate token' }
            // if everything is good, save to request for use in other routes
            req.user = { id: decoded.id, role: decoded.role };
            next();
        });
    } catch (err) {
        res.status(err.status || 500).json({ status_code: err.status || 500, message: err.message })
    }

}

const isAdmin = (req, res, next) => {
    try {
        if (req.user.role != 'admin') throw { status: 401, message: `Unauthorized` }
        next()
    } catch (err) {
        res.status(err.status || 500).json({ status_code: err.status || 500, message: err.message })
    }
}

module.exports = {
    verifyToken,
    isAdmin
}