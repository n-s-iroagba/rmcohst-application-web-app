// seed.ts

import sequelize from '../config/database'
import { Department, Program, ProgramSSCRequirement } from '../models'
import Faculty from '../models/Faculty'
import { Grade, QualificationType, } from '../models/ProgramSSCRequirement'
import Subject from '../models/Subject'

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
    ])

    // Create Faculties
    const faculties = await Faculty.bulkCreate([
      {
        name: 'Faculty of Science',
        code: 'FOS',
        description: 'Science and Technology Faculty',
        nameOfDean: 'Dr. Jane Smith',
      },
      {
        name: 'Faculty of Engineering',
        code: 'FOE',
        description: 'Engineering and Technology Faculty',
        nameOfDean: 'Prof. John Doe',
      },
      {
        name: 'Faculty of Arts',
        code: 'FOA',
        description: 'Arts and Humanities Faculty',
        isActive: false,
      },
    ])

    // Create Departments
    const departments = await Department.bulkCreate([
      { facultyId: faculties[0].id, name: 'Computer Science', code: 'CSC' },
      { facultyId: faculties[0].id, name: 'Mathematics', code: 'MTH' },
      { facultyId: faculties[1].id, name: 'Electrical Engineering', code: 'EEE' },
      { facultyId: faculties[1].id, name: 'Mechanical Engineering', code: 'MEE' },
      { facultyId: faculties[2].id, name: 'English Literature', code: 'ENG', isActive: false },
    ])

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
        acceptanceFeeInNaira: 50000,
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
        description: 'Focus on software development practices',
      },
      {
        departmentId: departments[2].id,
        name: 'Power Systems Engineering',
        code: 'PSE301',
        level: 'HND',
        durationType: 'YEAR',
        duration: 2,
        applicationFeeInNaira: 12000,
        acceptanceFeeInNaira: 55000,
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
        isActive: false,
      },
    ])

    // Create SSC Requirements - using flattened fields instead of JSON array
    await ProgramSSCRequirement.bulkCreate([
      {
        tag: 'Core Requirements',
        maximumNumberOfSittings: '2',
        programId: programs[0].id,
        qualificationTypes: [QualificationType.WAEC, QualificationType.NECO],

        firstSubject: subjects[0].name, // Mathematics
        firstSubjectGrade: Grade.C5,

        secondSubject: subjects[1].name, // English
        secondSubjectGrade: Grade.B3,

        thirdSubject: subjects[2].name, // Physics
        alternateThirdSubject: '', // no alternate
        thirdSubjectGrade: Grade.C4,

        fourthSubject: subjects[3].name, // Chemistry
        alternateFourthSubject: '', // no alternate
        fourthSubjectGrade: Grade.C6,

        fifthSubject: subjects[5].name, // Further Math
        alternateFifthSubject: subjects[4].name, // or Biology
        fifthSubjectGrade: Grade.C6,
      },
      {
        tag: 'Science Track',
        maximumNumberOfSittings: '1',
        programId: programs[1].id,
        qualificationTypes: [QualificationType.WAEC],

        firstSubject: subjects[0].name, // Mathematics
        firstSubjectGrade: Grade.B2,

        secondSubject: subjects[1].name, // English
        secondSubjectGrade: Grade.B3,

        thirdSubject: subjects[2].name, // Physics
        alternateThirdSubject: '',
        thirdSubjectGrade: Grade.C4,

        fourthSubject: subjects[3].name, // Chemistry
        alternateFourthSubject: '',
        fourthSubjectGrade: Grade.C5,

        fifthSubject: subjects[4].name, // Biology
        alternateFifthSubject: '',
        fifthSubjectGrade: Grade.C6,
      },
      {
        tag: 'Engineering Basics',
        maximumNumberOfSittings: '2',
        programId: programs[2].id,
        qualificationTypes: [QualificationType.WAEC, QualificationType.GCE],

        firstSubject: subjects[0].name, // Mathematics
        firstSubjectGrade: Grade.C6,

        secondSubject: subjects[1].name, // English
        secondSubjectGrade: Grade.C5,

        thirdSubject: subjects[2].name, // Physics
        alternateThirdSubject: '',
        thirdSubjectGrade: Grade.B3,

        fourthSubject: subjects[13].name, // Technical Drawing
        alternateFourthSubject: '',
        fourthSubjectGrade: Grade.C4,

        fifthSubject: subjects[3].name, // Chemistry
        alternateFifthSubject: '',
        fifthSubjectGrade: Grade.C5,
      },
    ])


    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await sequelize.close()
  }
}

seedDatabase()
