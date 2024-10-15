const { Op } = require('sequelize');
const Course = require('../model/Course');
const Skill = require('../model/Skill');
const User = require('../model/User');

const searchCoursesOrSkills = async (req, res) => {
    const query = req.query.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required.' });
    }

    try {
        const coursesByName = await Course.findAll({
            where: {
                course_name: {
                    [Op.like]: `%${query}%`,
                },
            },
            include: [
                {
                    model: Skill,
                    through: { attributes: [] },
                    attributes: ['skill_id', 'skill_name'],
                },
                {
                    model: User, 
                    through: { attributes: [] },
                    attributes: ['user_id', 'name'],
                  },
            ],
        });

        const skills = await Skill.findAll({
            where: {
                skill_name: {
                    [Op.like]: `%${query}%`,
                },
            },
            include: [
                {
                    model: Course,
                    through: { attributes: [] },
                    attributes: ['course_id', 'course_name', 'course_description', 'course_price','course_mrp', 'course_level','review','duration'],
                    include: [
                        {
                            model: Skill,
                            through: { attributes: [] },
                            attributes: ['skill_id', 'skill_name'],
                        },
                        {
                            model: User, 
                            through: { attributes: [] },
                            attributes: ['user_id', 'name'],
                          },
                    ],
                },
            ],
        });

        const coursesBySkill = skills.flatMap(skill => skill.Courses);
        const allCourses = [...new Set([...coursesByName, ...coursesBySkill])];
        const searchCount = allCourses.length;

        if (searchCount === 0) {
            return res.status(200).json({ message: 'No courses found' });
        }

        return res.status(200).json({ searchCount, courses: allCourses });
    } catch (error) {
        console.error('Error searching courses or skills:', error);
        return res.status(500).json({ error: 'Failed to search for courses or skills' });
    }
};

module.exports = {
    searchCoursesOrSkills,
};
