
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateJwtToken = async (payLoad) => {
    const token = jwt.sign(payLoad, process.env.JWT_SECRET, { expiresIn: '1d' });
    return token;
};
module.exports = generateJwtToken;
