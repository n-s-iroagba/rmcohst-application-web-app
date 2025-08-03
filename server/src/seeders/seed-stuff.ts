// seed.ts

import sequelize from "../config/database";
import { Department, Program, ProgramSSCRequirement } from "../models";
import Faculty from "../models/Faculty";
import { QualificationType, Grade } from "../models/ProgramSSCRequirement";
import Subject from "../models/Subject";


async function seedDatabase() {
  try {
    // await Subject.drop()
    // await Subject.sync()

    // Create Subjects (common subjects for SSC requirements)
    const subjects = await Subject.bulkCreate([
      { name: 'Mathematics', code: 'MATH' },
      { name: 'English Language', code: 'ENG' },
      { name: 'Physics', code: 'PHY' },
      { name: 'Chemistry', code: 'CHEM' },
      { name: 'Biology', code: 'BIO' },
      { name: 'Further Mathematics', code: 'FUR_MATH' },
      { name: 'Agricultural Science', code: 'AGRIC' },
      { name: 'Economics', code: 'ECONS' },
      { name: 'Geography', code: 'GEOG' },
      { name: 'Government', code: 'GOVT' },
      { name: 'Literature in English', code: 'LIT_ENG' },
      { name: 'Commerce', code: 'COMM' },
      { name: 'Accounting', code: 'ACCT' },
      { name: 'Technical Drawing', code: 'TECH_DRAW' },
    ]);

    // Create Faculties
    const faculties = await Faculty.bulkCreate([
      {
        name: 'Faculty of Science',
        code: 'FOS',
        description: 'Science and Technology Faculty',
        nameOfDean: 'Dr. Jane Smith'
      },
      {
        name: 'Faculty of Engineering',
        code: 'FOE',
        description: 'Engineering and Technology Faculty',
        nameOfDean: 'Prof. John Doe'
      },
      {
        name: 'Faculty of Arts',
        code: 'FOA',
        description: 'Arts and Humanities Faculty',
        isActive: false
      }
    ]);

    // Create Departments
    const departments = await Department.bulkCreate([
      { facultyId: faculties[0].id, name: 'Computer Science', code: 'CSC' },
      { facultyId: faculties[0].id, name: 'Mathematics', code: 'MTH' },
      { facultyId: faculties[1].id, name: 'Electrical Engineering', code: 'EEE' },
      { facultyId: faculties[1].id, name: 'Mechanical Engineering', code: 'MEE' },
      { facultyId: faculties[2].id, name: 'English Literature', code: 'ENG', isActive: false }
    ]);

    // Create Programs
    const programs = await Program.bulkCreate([
      {
        departmentId: departments[0].id,
        name: 'Computer Science',
        code: 'CS101',
        level: 'HND',
        durationType: 'YEAR',
        duration: 2,
        applicationFeeInNaira: 10000,
        acceptanceFeeInNaira: 50000
      },
      {
        departmentId: departments[0].id,
        name: 'Software Engineering',
        code: 'SE201',
        level: 'OND',
        durationType: 'YEAR',
        duration: 2,
        applicationFeeInNaira: 8000,
        acceptanceFeeInNaira: 45000,
        description: 'Focus on software development practices'
      },
      {
        departmentId: departments[2].id,
        name: 'Power Systems Engineering',
        code: 'PSE301',
        level: 'HND',
        durationType: 'YEAR',
        duration: 2,
        applicationFeeInNaira: 12000,
        acceptanceFeeInNaira: 55000
      },
      {
        departmentId: departments[3].id,
        name: 'Automotive Engineering',
        code: 'AUT401',
        level: 'Certificate',
        durationType: 'MONTH',
        duration: 18,
        applicationFeeInNaira: 7000,
        acceptanceFeeInNaira: 35000,
        isActive: false
      }
    ]);

    // Create SSC Requirements - now using actual subject IDs
    await ProgramSSCRequirement.bulkCreate([
      {
        programId: programs[0].id,
        tag: 'Core Requirements',
        maximumSittings: 2,
        qualificationTypes: [QualificationType.WAEC, QualificationType.NECO],
        subjects: [
          { subjectId: subjects[0].id, grade: Grade.C5 }, // Mathematics
          { subjectId: subjects[1].id, grade: Grade.B3 }, // English
          { subjectId: subjects[2].id, grade: Grade.C4 }, // Physics
          { subjectId: subjects[3].id, grade: Grade.C6 }, // Chemistry
          { subjectId: subjects[5].id, grade: Grade.C6, alternateSubjectId: subjects[4].id } // Further Math or Biology
        ]
      },
      {
        programId: programs[0].id,
        tag: 'Science Track',
        maximumSittings: 1,
        qualificationTypes: [QualificationType.WAEC],
        subjects: [
          { subjectId: subjects[0].id, grade: Grade.B2 }, // Mathematics
          { subjectId: subjects[1].id, grade: Grade.B3 }, // English
          { subjectId: subjects[2].id, grade: Grade.C4 }, // Physics
          { subjectId: subjects[3].id, grade: Grade.C5 }, // Chemistry
          { subjectId: subjects[4].id, grade: Grade.C6 }  // Biology
        ]
      },
      {
        programId: programs[2].id,
        tag: 'Engineering Basics',
        maximumSittings: 2,
        qualificationTypes: [QualificationType.WAEC, QualificationType.GCE],
        subjects: [
          { subjectId: subjects[0].id, grade: Grade.C6 }, // Mathematics
          { subjectId: subjects[1].id, grade: Grade.C5 }, // English
          { subjectId: subjects[2].id, grade: Grade.B3 }, // Physics
          { subjectId: subjects[13].id, grade: Grade.C4 }, // Technical Drawing
          { subjectId: subjects[3].id, grade: Grade.C5 }  // Chemistry
        ]
      }
    ]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
}

seedDatabase();