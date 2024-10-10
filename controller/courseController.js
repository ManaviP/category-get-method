const { Op } = require('sequelize');
const Course = require('../model/Course');
const Skill = require('../model/Skill');

const searchCoursesOrSkills = async (req, res) => {
    const query = req.query.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required.' });
    }

    try {
        const courses = await Course.findAll({
            where: {
                course_name: {
                    [Op.like]: `%${query}%`,
                },
            },
        });

        const skills = await Skill.findAll({
            where: {
                skill_name: {
                    [Op.like]: `%${query}%`,
                },
            },
        });

        if (courses.length === 0 && skills.length === 0) {
            return res.status(200).json({ message: 'No courses or skills found' });
        }

        return res.status(200).json({ courses, skills });
    } catch (error) {
        console.error('Error searching courses or skills:', error);
        return res.status(500).json({ error: 'Failed to search for courses or skills' });
    }
};

module.exports = {
    searchCoursesOrSkills,
};
