const User = require('../model/User');
const Course = require('../model/Course');
const Skill = require('../model/Skill');

const getUserWithCoursesAndSkills = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findByPk(userId, {
            include: [
                {
                    model: Course,
                    through: { attributes: [] }, 
                    include: [
                        {
                            model: Skill,
                            through: { attributes: [] }, 
                            attributes: ['skill_id', 'skill_name'],
                        },
                    ],
                },
            ],
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user with courses and skills:', error);
        res.status(500).json({ error: 'Failed to fetch user with courses and skills' });
    }
};

module.exports = {
    getUserWithCoursesAndSkills,
};
