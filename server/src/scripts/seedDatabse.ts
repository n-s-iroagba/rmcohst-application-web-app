import sequelize from '../config/database';
import Faculty from '../models/Faculty';
import Department from '../models/Department';
import Program from '../models/Program';
import ProgramSSCQualification from '../models/ProgramSSCQualification';
import ProgramSSCSubject from '../models/ProgramSSCSubject';
import SSCSubject from '../models/SSCSubject';
import ProgramSpecificQualification from '../models/ProgramSpecificQualification';

async function seedDatabase() {
  try {
    await sequelize.sync({ force: true }); // ⚠️ Clears all tables!

    // 1. Create Faculty
    const healthFaculty = await Faculty.create({ name: 'Faculty of Health Science and Technology' });

    // 2. Create Departments
    const nursingDept = await Department.create({ name: 'Nursing Science', facultyId: healthFaculty.id });
    const medLabDept = await Department.create({ name: 'Medical Laboratory Science', facultyId: healthFaculty.id });

    // 3. Create Programs
    const nursingProgram = await Program.create({
      department: nursingDept.name,
      certificationType: 'BNSc',
      durationType: 'YEAR',
      duration: 5,
      applicationFeeInNaira: 5000,
      acceptanceFeeInNaira: 20000,
    });

    const medLabProgram = await Program.create({
      department: medLabDept.name,
      certificationType: 'BMLS',
      durationType: 'YEAR',
      duration: 5,
      applicationFeeInNaira: 5000,
      acceptanceFeeInNaira: 20000,
    });

    // 4. Create Program SSC Qualifications
    const nursingSSCQualification = await ProgramSSCQualification.create({
      programId: nursingProgram.id,
      acceptedCertificateTypes: ['WAEC', 'NECO'],
      maximumNumberOfSittings: 2,
    });

    const medLabSSCQualification = await ProgramSSCQualification.create({
      programId: medLabProgram.id,
      acceptedCertificateTypes: ['WAEC', 'NECO'],
      maximumNumberOfSittings: 2,
    });

    // 5. Create SSC Subjects
    const math = await SSCSubject.create({ name: 'Mathematics' });
    const eng = await SSCSubject.create({ name: 'English' });
    const bio = await SSCSubject.create({ name: 'Biology' });
    const chem = await SSCSubject.create({ name: 'Chemistry' });
    const phy = await SSCSubject.create({ name: 'Physics' });

    // 6. Create Program SSC Subjects
    await ProgramSSCSubject.bulkCreate([
      // For Nursing
      {
        programSSCQualificationId: nursingSSCQualification.id,
        sscSubjectId: eng.id,
        minimumGrade: 'C6',
      },
      {
        programSSCQualificationId: nursingSSCQualification.id,
        sscSubjectId: math.id,
        minimumGrade: 'C6',
      },
      {
        programSSCQualificationId: nursingSSCQualification.id,
        sscSubjectId: bio.id,
        minimumGrade: 'C6',
      },
      {
        programSSCQualificationId: nursingSSCQualification.id,
        sscSubjectId: chem.id,
        minimumGrade: 'C6',
      },
      // For Med Lab
      {
        programSSCQualificationId: medLabSSCQualification.id,
        sscSubjectId: eng.id,
        minimumGrade: 'C6',
      },
      {
        programSSCQualificationId: medLabSSCQualification.id,
        sscSubjectId: math.id,
        minimumGrade: 'C6',
      },
      {
        programSSCQualificationId: medLabSSCQualification.id,
        sscSubjectId: bio.id,
        minimumGrade: 'C6',
      },
      {
        programSSCQualificationId: medLabSSCQualification.id,
        sscSubjectId: phy.id,
        minimumGrade: 'C6',
      },
    ]);

    // 7. Add Specific Qualifications
    await ProgramSpecificQualification.bulkCreate([
      {
        programId: nursingProgram.id,
        qualificationType: 'Registered Nurse (RN)',
        minimumGrade: 'Credit',
      },
      {
        programId: medLabProgram.id,
        qualificationType: 'Diploma in Medical Laboratory Technology',
        minimumGrade: 'Upper Credit',
      },
    ]);

    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
}

seedDatabase();
