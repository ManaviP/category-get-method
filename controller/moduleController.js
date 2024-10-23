const { Op } = require('sequelize');
const Module = require('../model/Module');
const Lecture = require('../model/Lecture');

const getModuleById = async (req, res) => {
    const moduleId = req.params.id;

    try {
        const module = await Module.findOne({
            where: { module_id: moduleId },
            include: [
                {
                    model: Lecture,
                    through: { attributes: [] }, 
                    attributes: ['lecture_id', 'title', 'video_url', 'is_preview'],
                },
            ],
        });

        if (!module) {
            return res.status(404).json({ error: 'Module not found' });
        }

        res.json(module);
    } catch (err) {
        console.error('Error fetching module details:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports = {
    getModuleById
};
