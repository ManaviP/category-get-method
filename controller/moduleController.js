const { Op, Sequelize } = require('sequelize');
const Module = require('../model/Module');
const Lecture = require('../model/Lecture');
const ModuleLecture = require('../model/ModuleLecture');

const getModuleById = async (req, res) => {
    const courseId = req.params.courseId;
    const moduleId = req.params.id;

    try {
        const module = await Module.findOne({
            where: { module_id: moduleId, course_id: courseId },
            include: [
                {
                    model: Lecture,
                    through: {
                        model: ModuleLecture,
                        attributes: [],
                    },
                    attributes: ['lecture_id', 'title', 'video_url', 'is_preview'],
                    order: [['order', 'ASC']],
                },
            ],
        });

        if (!module) {
            return res.status(400).json({ error: 'Module not found' });
        }

        res.json(module);
    } catch (err) {
        console.error('Error fetching module details:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const updateModuleName = async (req, res) => {
    const courseId = req.params.courseId;
    const moduleId = req.params.id;
    const { name, order } = req.body;

    if (!name && order === undefined) {
        return res.status(400).json({ error: 'New name or order is required' });
    }

    try {
        if (order !== undefined) {
            await Module.update(
                { order: Sequelize.literal('order + 1') },
                {
                    where: {
                        order: { [Op.gte]: order },
                        module_id: { [Op.ne]: moduleId }
                    }
                }
            );
        }

        const [updated] = await Module.update({ module_name: name, order }, {
            where: { module_id: moduleId },
        });

        if (!updated) {
            return res.status(404).json({ error: 'Module not found or no changes made' });
        }

        res.status(200).json({ message: 'Module name updated successfully' });
    } catch (err) {
        console.error('Error updating module name:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const updateLecture = async (req, res) => {
    const lectureId = req.params.id;
    const { title, video_url, is_preview, order } = req.body;

    if (!title && !video_url && is_preview === undefined && order === undefined) {
        return res.status(400).json({ error: 'At least one field is required to update' });
    }

    try {
        if (order !== undefined) {
            await Lecture.update(
                { order: Sequelize.literal('order + 1') },
                { where: { module_id: req.params.moduleId, order: { [Op.gte]: order } } }
            );
        }

        const [updated] = await Lecture.update({ title, video_url, is_preview, order }, {
            where: { lecture_id: lectureId },
        });

        if (!updated) {
            return res.status(404).json({ error: 'Lecture not found or no changes made' });
        }

        res.status(200).json({ message: 'Lecture updated successfully' });
    } catch (err) {
        console.error('Error updating lecture:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const createLecture = async (req, res) => {
    const { title, video_url, is_preview, order } = req.body;

    if (!title || !video_url) {
        return res.status(400).json({ error: 'Title and video URL are required' });
    }

    try {
        if (order !== undefined) {
            await Lecture.update(
                { order: Sequelize.literal('order + 1') },
                { where: { module_id: req.params.moduleId, order: { [Op.gte]: order } } }
            );
        }

        const newLecture = await Lecture.create({ title, video_url, is_preview, order, module_id: req.params.moduleId });
        res.status(201).json({ message: 'Lecture created successfully', lecture: newLecture });
    } catch (err) {
        console.error('Error creating lecture:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const deleteLecture = async (req, res) => {
    const lectureId = req.params.id;

    try {
        const lecture = await Lecture.findOne({ where: { lecture_id: lectureId } });

        if (!lecture) {
            return res.status(404).json({ error: 'Lecture not found' });
        }

        const relatedModuleLectures = await ModuleLecture.findAll({ where: { lecture_id: lectureId } });

        if (relatedModuleLectures.length > 0) {
            await ModuleLecture.destroy({ where: { lecture_id: lectureId } });
        }

        await Lecture.destroy({ where: { lecture_id: lectureId } });

        await Lecture.update(
            { order: Sequelize.literal('order - 1') },
            { where: { order: { [Op.gt]: lecture.order } } }
        );

        res.status(200).json({ message: 'Lecture deleted successfully' });
    } catch (err) {
        console.error('Error deleting lecture:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports = {
    getModuleById,
    updateModuleName,
    updateLecture,
    createLecture,
    deleteLecture,
};
