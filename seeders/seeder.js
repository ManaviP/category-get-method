const sequelize = require('../config/config');
const Category = require('../model/category');
const Course = require('../model/Course');
const Skill = require('../model/Skill');
const CourseSkill = require('../model/CourseSkill');
const User = require('../model/User');
const CourseUser = require('../model/CourseUser');
async function seeder() {
  try {
    await sequelize.sync({ force: true });

    const computerScience = await Category.create({
      category_name: 'Computer Science',
      is_main_category: true,
    });

    const webDevelopment = await Category.create({
      category_name: 'Web Development',
      parent_category_id: computerScience.category_id,
      is_main_category: false,
    });

    const mobileDevelopment = await Category.create({
      category_name: 'Mobile Development',
      parent_category_id: computerScience.category_id,
      is_main_category: false,
    });

    const fullstackCourse = await Course.create({
      course_name: 'Full-Stack Web Development',
      course_description: 'Learn how to build web applications from scratch',
      course_price: 15000, course_mrp:20000, course_level: 'begineer',review:4,duration: 100,
      category_id: webDevelopment.category_id,
    });

    const frontendCourse = await Course.create({
      course_name: 'Frontend Development',
      course_description: 'Learn how to build user interfaces using modern technologies',
      course_price: 15000, course_mrp:20000, course_level: 'begineer',review:4,duration: 100,
      category_id: webDevelopment.category_id,
    });

    const mobileFullstackCourse = await Course.create({
      course_name: 'Mobile Full-Stack Development',
      course_description: 'Build mobile applications using full-stack technologies',
      course_price: 15000, course_mrp:20000, course_level: 'begineer',review:4,duration: 100,
      category_id: mobileDevelopment.category_id,
    });

    const mobileFrontendCourse = await Course.create({
      course_name: 'Mobile Frontend Development',
      course_description: 'Develop engaging mobile interfaces',
      course_price: 15000, course_mrp:20000, course_level: 'begineer',review:4,duration: 100,
      category_id: mobileDevelopment.category_id,
    });

    const skillHTML = await Skill.create({
      skill_name: 'HTML',
      skill_value: 5,
    });

    const skillCSS = await Skill.create({
      skill_name: 'CSS',
      skill_value: 4,
    });

    const skillReact = await Skill.create({
      skill_name: 'React',
      skill_value: 5,
    });

    const skillNode = await Skill.create({
      skill_name: 'Node.js',
      skill_value: 5,
    });

    const skillAndroidStudio = await Skill.create({
      skill_name: 'Android Studio',
      skill_value: 4,
    });

    const user1 = await User.create({
      name: 'Arav',
      email: 'a@gmail.com',
      password: '123456',
      role: 'instructor',
    });
    const user2 = await User.create({
      name: 'Arathi',
      email: 'b@gmail.com',
      password: '12345',
      role: 'instructor',
    });

    await CourseSkill.create({ course_id: fullstackCourse.course_id, skill_id: skillHTML.skill_id });
    await CourseSkill.create({ course_id: fullstackCourse.course_id, skill_id: skillCSS.skill_id });
    await CourseSkill.create({ course_id: fullstackCourse.course_id, skill_id: skillReact.skill_id });
    await CourseSkill.create({ course_id: fullstackCourse.course_id, skill_id: skillNode.skill_id });
    await CourseUser.create({ course_id: fullstackCourse.course_id, user_id: user1.user_id });

    await CourseSkill.create({ course_id: frontendCourse.course_id, skill_id: skillHTML.skill_id });
    await CourseSkill.create({ course_id: frontendCourse.course_id, skill_id: skillCSS.skill_id });
    await CourseSkill.create({ course_id: frontendCourse.course_id, skill_id: skillReact.skill_id });
    await CourseUser.create({ course_id: frontendCourse.course_id, user_id: user1.user_id });

    await CourseSkill.create({ course_id: mobileFullstackCourse.course_id, skill_id: skillNode.skill_id });
    await CourseSkill.create({ course_id: mobileFullstackCourse.course_id, skill_id: skillAndroidStudio.skill_id });
    await CourseUser.create({ course_id: mobileFullstackCourse.course_id, user_id: user2.user_id });

    await CourseSkill.create({ course_id: mobileFrontendCourse.course_id, skill_id: skillReact.skill_id });
    await CourseSkill.create({ course_id: mobileFrontendCourse.course_id, skill_id: skillAndroidStudio.skill_id });
    await CourseUser.create({ course_id: mobileFrontendCourse.course_id, user_id: user2.user_id });
    console.log('Data successfully seeded!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
}

seeder();