const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dbConnect = require('./Config/database.js')
const authRoutes = require('./Routers/AuthRoutes.js');
const usersRoutes = require('./Routers/AllUsersRoutes.js');
const passwordResetRoutes = require('./Routers/PasswordResetRoutes.js');
const app = express();
const dotEnv = require('dotenv');
dotEnv.config();
const PORT = process.env.PORT || 8000;


// Middleware
app.use(bodyParser.json());
app.use(cors());


// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', usersRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    dbConnect();
});