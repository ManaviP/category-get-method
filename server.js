const express = require('express');
const sequelize = require('./config/config');
const categoryController = require('./controller/categoryController');

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json()); 

app.get('/categories', categoryController.getParentCategories); 
app.get('/categories/:id/subcategories', categoryController.getSubCategories); 
app.get('/categories/:id/courses', categoryController.getCoursesBySubCategory); 


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
