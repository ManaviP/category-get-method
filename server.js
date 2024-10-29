const express = require('express');
const sequelize = require('./config/config');
require('./model/User');
require('./model/Course');
require('./model/CourseUser');
require('./model/Skill');
require('./model/CourseSkill');
require('./model/Module');
require('./model/CourseModule');
require('./model/Lecture');
require('./model/ModuleLecture');
require('./model/Learn');
const apiRoutes = require('./routes');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/api', apiRoutes); 

const startServer = async () => {
    try {
        await sequelize.sync({ logging: console.log });
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
    }
};

startServer();
