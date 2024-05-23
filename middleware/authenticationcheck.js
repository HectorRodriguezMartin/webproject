const jwebtoken = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwebtoken.verify(token, process.env.JWEBTOKEN_KEY, null);
        req.userData = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ msg: 'Authentication failed'});
    } 
}

