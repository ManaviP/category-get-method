const express = require('express');
const sequelize = require('./config/config');

require('./model/Course');
require('./model/Skill');
require('./model/CourseSkill');

const categoryController = require('./controller/categoryController');
const courseController = require('./controller/courseController');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/categories', categoryController.getParentCategories);
app.get('/categories/:id/subcategories', categoryController.getSubCategories);
app.get('/categories/:id/courses', categoryController.getCoursesBySubCategory);

app.get('/api/search', courseController.searchCoursesOrSkills);

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
