const { Op } = require('sequelize');
const Category = require('../model/category');
const Course = require('../model/Course');
const Skill = require('../model/Skill');
const User = require('../model/User');
const Module = require('../model/Module');
const CourseSkill = require('../model/CourseSkill');
const CourseUser = require('../model/CourseUser');
const CourseModule = require('../model/CourseModule');

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
                    attributes: ['course_id', 'course_name', 'course_description', 'course_price', 'course_mrp', 'course_level', 'review', 'duration'],
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
            return res.status(200).json({
                message: 'No courses found',
                searchCount: 0,
            });
        }

        return res.status(200).json({ searchCount, courses: allCourses });
    } catch (error) {
        console.error('Error searching courses or skills:', error);
        return res.status(500).json({ error: 'Failed to search for courses or skills' });
    }
};

const updateCourse = async (req, res) => {
    const courseId = req.params.id;
    const { course_name, course_description, course_mrp, course_price, course_level, duration, skills, modules } = req.body;

    try {
        const course = await Course.findByPk(courseId);

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        course.course_name = course_name || course.course_name;
        course.course_description = course_description || course.course_description;
        course.course_mrp = course_mrp || course.course_mrp;
        course.course_price = course_price || course.course_price;
        course.course_level = course_level || course.course_level;
        course.duration = duration || course.duration;

        await course.save();

        if (skills && skills.length > 0) {
            await CourseSkill.destroy({ where: { course_id: courseId } });
            const skillRecords = skills.map(skill_id => ({ course_id: courseId, skill_id }));
            await CourseSkill.bulkCreate(skillRecords);
        }

        if (modules && modules.length > 0) {
            await CourseModule.destroy({ where: { course_id: courseId } }); 
            const moduleRecords = modules.map(module => ({ module_name: module.name, course_id: courseId }));
            await CourseModule.bulkCreate(moduleRecords); 
        }

        res.json(course);
    } catch (err) {
        console.error('Error updating course:', err);
        res.status(500).json({ error: 'Failed to update course', details: err.message });
    }
};

const deleteCourse = async (req, res) => {
    const courseId = req.params.id;

    try {
        const course = await Course.findByPk(courseId);

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        await CourseSkill.destroy({ where: { course_id: courseId } });
        await CourseModule.destroy({ where: { course_id: courseId } }); 
        await course.destroy();

        res.json({ message: 'Course deleted successfully' });
    } catch (err) {
        console.error('Error deleting course:', err);
        res.status(500).json({ error: 'Failed to delete course' });
    }
};

const getCourseById = async (req, res) => {
    const courseId = req.params.id;

    try {
        const course = await Course.findOne({
            where: { course_id: courseId },
            include: [
                {
                    model: Category,
                    as: 'Category',
                    attributes: ['category_name'],
                    include: [
                        {
                            model: Category,
                            as: 'parentCategory',
                            attributes: ['category_name'],
                        },
                    ],
                },
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
                {
                    model: Module, 
                    through: { attributes: [] },
                    attributes: ['module_id', 'module_name'],
                }
            ],
            attributes: [
                'course_id',
                'course_name',
                'course_description',
                'course_price',
                'course_mrp',
                'course_level',
                'review',
                'duration',
            ],
        });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json(course);
    } catch (err) {
        console.error('Error fetching course details:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const createCourse = async (req, res) => {
    const {
        course_name,
        course_description,
        course_mrp,
        course_price,
        course_level,
        duration,
        review,
        category_id,
        skills,
        user_id,
        modules 
    } = req.body;

    try {
        const newCourse = await Course.create({
            course_name,
            course_description,
            course_mrp,
            course_price,
            course_level,
            duration,
            review,
            category_id
        });

        if (skills && skills.length > 0) {
            const skillRecords = skills.map(skill_id => ({
                course_id: newCourse.course_id,
                skill_id,
            }));
            await CourseSkill.bulkCreate(skillRecords);
        }

        if (user_id) {
            await CourseUser.create({
                course_id: newCourse.course_id,
                user_id,
            });
        }

        if (modules && modules.length > 0) {
            const moduleRecords = modules.map(module => ({
                module_name: module.name,
                course_id: newCourse.course_id
            }));
            await CourseModule.bulkCreate(moduleRecords); 
        }

        res.status(201).json(newCourse);
    } catch (err) {
        console.error('Error creating course:', err);
        res.status(500).json({ error: 'Failed to create course', details: err.message });
    }
};

module.exports = {
    searchCoursesOrSkills,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
};
