const { Op } = require('sequelize');
const Category = require('../model/category');
const Course = require('../model/Course');
const Skill = require('../model/Skill');
const User = require('../model/User');
const Module = require('../model/Module');
const Lecture = require('../model/Lecture');
const CourseSkill = require('../model/CourseSkill');
const CourseUser = require('../model/CourseUser');
const CourseModule = require('../model/CourseModule');
const ModuleLecture = require('../model/ModuleLecture');
const { WhatYouLearn, WhatReq, WhoCanJoin, WhatYouLearnCourse, WhatReqCourse, WhoCanJoinCourse } = require('../model/Learn');

const searchCoursesOrSkills = async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required.' });
    }
    try {
        const coursesByName = await Course.findAll({
            where: { course_name: { [Op.like]: `%${query}%` } },
            include: [
                { model: Skill, through: { attributes: [] }, attributes: ['skill_id', 'skill_name'] },
                { model: User, through: { attributes: [] }, attributes: ['user_id', 'name'] },
                { model: WhatReq, through: { attributes: [] }, attributes: ['content', 'WhatReq_id'] },
                { model: WhatYouLearn, through: { attributes: [] }, attributes: ['content', 'WhatYouLearn_id'] },
                { model: WhoCanJoin, through: { attributes: [] }, attributes: ['content', 'WhoCanJoin_id'] },
            ],
        });
        const skills = await Skill.findAll({
            where: { skill_name: { [Op.like]: `%${query}%` } },
            include: [
                {
                    model: Course,
                    through: { attributes: [] },
                    attributes: [
                        'course_id', 'course_name', 'course_description', 'course_price', 
                        'course_mrp', 'course_level', 'review', 'duration', 'course_longdes', 
                        'course_img', 'course_promotion'
                    ],
                    include: [
                        { model: Skill, through: { attributes: [] }, attributes: ['skill_id', 'skill_name'] },
                        { model: User, through: { attributes: [] }, attributes: ['user_id', 'name'] },
                        { model: WhatReq, through: { attributes: [] }, attributes: ['content', 'WhatReq_id'] },
                        { model: WhatYouLearn, through: { attributes: [] }, attributes: ['content', 'WhatYouLearn_id'] },
                        { model: WhoCanJoin, through: { attributes: [] }, attributes: ['content', 'WhoCanJoin_id'] },
                    ],
                },
            ],
        });
        const coursesBySkill = skills.flatMap(skill => skill.Courses);
        const allCourses = [...new Set([...coursesByName, ...coursesBySkill])];
        const searchCount = allCourses.length;
        if (searchCount === 0) {
            return res.status(200).json({ message: 'No courses found', searchCount: 0 });
        }
        return res.status(200).json({ searchCount, courses: allCourses });
    } catch (error) {
        console.error('Error searching courses or skills:', error);
        return res.status(500).json({ error: 'Failed to search for courses or skills' });
    }
};

const updateCourse = async (req, res) => {
    const courseId = req.params.id;
    const { course_name, course_description, course_mrp, course_price, course_level, duration, skills, whatYouLearn, whoCanJoin, whatReq, modules, course_img, course_promotion, course_longdes } = req.body;
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
        course.course_img = course_img || course.course_img;
        course.course_promotion = course_promotion || course.course_promotion;
        course.course_longdes = course_longdes || course.course_longdes;
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
        if (whatYouLearn && whatYouLearn.length > 0) {
            await WhatYouLearnCourse.destroy({ where: { course_id: courseId } });
            const whatYouLearnRecords = whatYouLearn.map(item => ({ content: item.content, course_id: courseId }));
            await WhatYouLearn.bulkCreate(whatYouLearnRecords);
        }
        if (whoCanJoin && whoCanJoin.length > 0) {
            await WhoCanJoinCourse.destroy({ where: { course_id: courseId } });
            const whoCanJoinRecords = whoCanJoin.map(item => ({ content: item.content, course_id: courseId }));
            await WhoCanJoin.bulkCreate(whoCanJoinRecords);
        }
        if (whatReq && whatReq.length > 0) {
            await WhatReqCourse.destroy({ where: { course_id: courseId } });
            const whatReqRecords = whatReq.map(item => ({ content: item.content, course_id: courseId }));
            await WhatReq.bulkCreate(whatReqRecords);
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
        await WhoCanJoinCourse.destroy({ where: { course_id: courseId } });
        await WhatReqCourse.destroy({ where: { course_id: courseId } });
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
                { model: Category, as: 'Category', attributes: ['category_id', 'category_name'] },
                { model: Skill, through: { attributes: [] }, attributes: ['skill_id', 'skill_name'] },
                { model: User, through: { attributes: [] }, attributes: ['user_id', 'name'] },
                { model: Module, attributes: ['module_id', 'module_name'], include: [{ model: Lecture, attributes: ['lecture_id', 'title', 'video_url', 'is_preview'] }] },
                { model: WhatReq, through: { attributes: [] }, attributes: ['content', 'WhatReq_id'] },
                { model: WhatYouLearn, through: { attributes: [] }, attributes: ['content', 'WhatYouLearn_id'] },
                { model: WhoCanJoin, through: { attributes: [] }, attributes: ['content', 'WhoCanJoin_id'] },
            ],
            attributes: [
                'course_id', 'course_name', 'course_description', 'course_price', 'course_mrp', 
                'course_level', 'review', 'duration', 'course_img', 'course_promotion', 'course_longdes'
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
    const { course_name, course_description, course_mrp, course_price, course_level, duration, review, category_id, skills, learn, user_id, modules, course_img, course_promotion, course_longdes, whatYouLearn, whoCanJoin, whatReq } = req.body;
    try {
        const newCourse = await Course.create({ 
            course_name, 
            course_description, 
            course_mrp, 
            course_price, 
            course_level, 
            duration, 
            review, 
            category_id, 
            course_img, 
            course_promotion, 
            course_longdes 
        });
        if (skills && skills.length > 0) {
            const skillRecords = skills.map(skill_id => ({ course_id: newCourse.course_id, skill_id }));
            await CourseSkill.bulkCreate(skillRecords);
        } else {
            await CourseSkill.create({ course_id: newCourse.course_id, skill_id: null });
        }
        if (user_id ) {
            await CourseUser.create({ course_id: newCourse.course_id, user_id });
        } else {
            await CourseUser.create({ course_id: newCourse.course_id, user_id: null });
        }
        if (modules && modules.length > 0) {
            const moduleRecords = modules.map(module => ({ course_id: newCourse.course_id, module_name: module.module_name }));
            await CourseModule.bulkCreate(moduleRecords);
        } else {
            await CourseModule.create({ course_id: newCourse.course_id, module_name: null });
        }
        if (whatYouLearn && whatYouLearn.length > 0) {
            const whatYouLearnRecords = whatYouLearn.map(item => ({ content: item.content, course_id: newCourse.course_id }));
            await WhatYouLearn.bulkCreate(whatYouLearnRecords);
        } else {
            await WhatYouLearn.create({ course_id: newCourse.course_id, content: null });
        }
        if (whoCanJoin && whoCanJoin.length > 0) {
            const whoCanJoinRecords = whoCanJoin.map(item => ({ content: item.content, course_id: newCourse.course_id }));
            await WhoCanJoin.bulkCreate(whoCanJoinRecords);
        } else {
            await WhoCanJoin.create({ course_id: newCourse.course_id, content: null });
        }
        if (whatReq && whatReq.length > 0) {
            const whatReqRecords = whatReq.map(item => ({ content: item.content, course_id: newCourse.course_id }));
            await WhatReq.bulkCreate(whatReqRecords);
        } else {
            await WhatReq.create({ course_id: newCourse.course_id, content: null });
        }
        res.json(newCourse);
    } catch (err) {
        console.error('Error creating course:', err);
        res.status(500).json({ error: 'Failed to create course' });
    }
};


const publishCourse = async (req, res) => {
    const courseId = req.params.id; 
    const { publish } = req.body; 

    try {
        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        if (publish !== undefined) {
            course.publish = publish; 
        }

        await course.save();

        const message = course.publish 
            ? 'Course published successfully' 
            : 'Course is set to unpublished';

        res.status(200).json({ message, course });
    } catch (error) {
        console.error('Error publishing course:', error);
        res.status(500).json({ error: 'Failed to publish course' });
    }
}; 

const evaluateCourseData = async (req, res) => {
    const courseId = req.params.id; 

    try {
        const course = await Course.findOne({
            where: { course_id: courseId },
            include: [
                { model: Category, as: 'Category', attributes: ['category_id', 'category_name'] },
                { model: Skill, through: { attributes: [] }, attributes: ['skill_id', 'skill_name'] },
                { model: User, through: { attributes: [] }, attributes: ['user_id', 'name'] },
                { model: Module, attributes: ['module_id', 'module_name'], include: [{ model: Lecture, attributes: ['lecture_id', 'title', 'video_url', 'is_preview'] }] },
                { model: WhatReq, through: { attributes: [] }, attributes: ['content', 'WhatReq_id'] },
                { model: WhatYouLearn, through: { attributes: [] }, attributes: ['content', 'WhatYouLearn_id'] },
                { model: WhoCanJoin, through: { attributes: [] }, attributes: ['content', 'WhoCanJoin_id'] },
            ],
            attributes: [
                'course_id', 'course_name', 'course_description', 'course_price', 'course_mrp', 
                'course_level', 'review', 'duration', 'course_img', 'course_promotion', 'course_longdes'
            ],
        });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        console.log(JSON.stringify(course, null, 2)); 

        const isAllDataPresent = [
            course.CourseSkills && course.CourseSkills.length > 0,
            course.CourseModules && course.CourseModules.length > 0,
            course.WhoCanJoins && course.WhoCanJoins.length > 0,
            course.WhatYouLearns && course.WhatYouLearns.length > 0,
            course.WhatReqs && course.WhatReqs.length > 0,
        ].every(Boolean);

        course.publish = isAllDataPresent;
        await course.save();

        const message = isAllDataPresent 
            ? 'All data values are entered. Course can be published.' 
            : 'Unpublished data is not entered. Please complete all sections.';

        res.status(200).json({ message, publishStatus: course.publish });
    } catch (error) {
        console.error('Error evaluating course data:', error);
        res.status(500).json({ error: 'Failed to evaluate course data' });
    }
};

module.exports = {
    searchCoursesOrSkills,
    updateCourse,
    deleteCourse,
    getCourseById,
    createCourse,
    publishCourse,
    evaluateCourseData,
};
