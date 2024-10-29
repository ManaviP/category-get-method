const { WhatYouLearn, WhatReq, WhoCanJoin, WhatYouLearnCourse, WhatReqCourse, WhoCanJoinCourse } = require('../model/Learn');
const Course = require('../model/Course');

const createCourseInfo = async (req, res) => {
  const { courseId, whatYouLearn, whatReq, whoCanJoin } = req.body;

  try {
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (!whatYouLearn || !Array.isArray(whatYouLearn) || whatYouLearn.length < 4 || whatYouLearn.length > 10) {
      return res.status(400).json({ error: 'whatYouLearn must have between 4 and 10 entries.' });
    }

    if (!whatReq || !Array.isArray(whatReq) || whatReq.length < 1 || whatReq.length > 3) {
      return res.status(400).json({ error: 'whatReq must have between 1 and 3 entries.' });
    }

    if (!whoCanJoin || !Array.isArray(whoCanJoin) || whoCanJoin.length < 1 || whoCanJoin.length > 3) {
      return res.status(400).json({ error: 'whoCanJoin must have between 1 and 3 entries.' });
    }

    const createdWhatYouLearn = await Promise.all(
      whatYouLearn.map(async (content) => {
        const record = await WhatYouLearn.create({ content });
        await WhatYouLearnCourse.create({ course_id: courseId, WhatYouLearn_id: record.WhatYouLearn_id });
        return record;
      })
    );

    const createdWhatReq = await Promise.all(
      whatReq.map(async (content) => {
        const record = await WhatReq.create({ content });
        await WhatReqCourse.create({ course_id: courseId, WhatReq_id: record.WhatReq_id });
        return record;
      })
    );

    const createdWhoCanJoin = await Promise.all(
      whoCanJoin.map(async (content) => {
        const record = await WhoCanJoin.create({ content });
        await WhoCanJoinCourse.create({ course_id: courseId, WhoCanJoin_id: record.WhoCanJoin_id });
        return record;
      })
    );

    res.status(201).json({ message: 'Course information created successfully' });
  } catch (error) {
    console.error('Error creating course info:', error);
    res.status(500).json({ error: 'Failed to create course info' });
  }
};

const getCourseInfo = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findByPk(courseId, {
      include: [WhatYouLearn, WhatReq, WhoCanJoin]
    });
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json({ whatYouLearn: course.WhatYouLearns, whatReq: course.WhatReqs, whoCanJoin: course.WhoCanJoins });
  } catch (error) {
    console.error('Error fetching course info:', error);
    res.status(500).json({ error: 'Failed to fetch course info' });
  }
};

const updateCourseInfo = async (req, res) => {
  const { courseId, whatYouLearn, whatReq, whoCanJoin } = req.body;

  try {
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (whatYouLearn && Array.isArray(whatYouLearn)) {
      await WhatYouLearnCourse.destroy({ where: { course_id: courseId } });
      await Promise.all(
        whatYouLearn.map(async (content) => {
          const record = await WhatYouLearn.create({ content });
          await WhatYouLearnCourse.create({ course_id: courseId, WhatYouLearn_id: record.WhatYouLearn_id });
        })
      );
    }

    if (whatReq && Array.isArray(whatReq)) {
      await WhatReqCourse.destroy({ where: { course_id: courseId } });
      await Promise.all(
        whatReq.map(async (content) => {
          const record = await WhatReq.create({ content });
          await WhatReqCourse.create({ course_id: courseId, WhatReq_id: record.WhatReq_id });
        })
      );
    }

    if (whoCanJoin && Array.isArray(whoCanJoin)) {
      await WhoCanJoinCourse.destroy({ where: { course_id: courseId } });
      await Promise.all(
        whoCanJoin.map(async (content) => {
          const record = await WhoCanJoin.create({ content });
          await WhoCanJoinCourse.create({ course_id: courseId, WhoCanJoin_id: record.WhoCanJoin_id });
        })
      );
    }

    res.status(200).json({ message: 'Course information updated successfully' });
  } catch (error) {
    console.error('Error updating course info:', error);
    res.status(500).json({ error: 'Failed to update course info' });
  }
};

const deleteCourseInfo = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await WhatYouLearnCourse.destroy({ where: { course_id: courseId } });
    await WhatReqCourse.destroy({ where: { course_id: courseId } });
    await WhoCanJoinCourse.destroy({ where: { course_id: courseId } });

    res.status(200).json({ message: 'Course information deleted successfully' });
  } catch (error) {
    console.error('Error deleting course info:', error);
    res.status(500).json({ error: 'Failed to delete course info' });
  }
};

module.exports = { createCourseInfo, getCourseInfo, updateCourseInfo, deleteCourseInfo };
