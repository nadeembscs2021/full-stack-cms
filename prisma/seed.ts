// Using require for more reliable imports in ts-node context
const { PrismaClient } = require('@prisma/client')

// Define enums locally to avoid import issues
const UserSex = {
  MALE: 'MALE',
  FEMALE: 'FEMALE'
}

const Day = {
  MONDAY: 'MONDAY',
  TUESDAY: 'TUESDAY',
  WEDNESDAY: 'WEDNESDAY',
  THURSDAY: 'THURSDAY',
  FRIDAY: 'FRIDAY'
}

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Starting database seeding...')

    // Create Admins
    console.log('Creating admins...')
    const admins = [
      {
        id: "admin1",
        username: "admin1",
      },
      {
        id: "admin2",
        username: "admin2",
      },
    ];

    for (const admin of admins) {
      try {
        await prisma.admin.create({
          data: admin,
        });
        console.log(`Created admin: ${admin.username}`)
      } catch (error) {
        console.error(`Error creating admin ${admin.username}:`, error)
      }
    }

    // Create Grades
    console.log('Creating grades...')
    const grades = Array.from({ length: 6 }, (_, i) => ({
      level: i + 1,
    }));

    for (const grade of grades) {
      try {
        await prisma.grade.create({
          data: grade,
        });
        console.log(`Created grade: ${grade.level}`)
      } catch (error) {
        console.error(`Error creating grade ${grade.level}:`, error)
      }
    }

    // Create Classes
    console.log('Creating classes...')
    const classes = Array.from({ length: 6 }, (_, i) => ({
      name: `${i + 1}A`,
      gradeId: i + 1,
      capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
    }));

    for (const classData of classes) {
      try {
        await prisma.class.create({
          data: classData,
        });
        console.log(`Created class: ${classData.name}`)
      } catch (error) {
        console.error(`Error creating class ${classData.name}:`, error)
      }
    }

    // Create Subjects
    console.log('Creating subjects...')
    const subjects = [
      { name: "Mathematics" },
      { name: "Science" },
      { name: "English" },
      { name: "History" },
      { name: "Geography" },
      { name: "Physics" },
      { name: "Chemistry" },
      { name: "Biology" },
      { name: "Computer Science" },
      { name: "Art" },
    ];

    for (const subject of subjects) {
      try {
        await prisma.subject.create({
          data: subject,
        });
        console.log(`Created subject: ${subject.name}`)
      } catch (error) {
        console.error(`Error creating subject ${subject.name}:`, error)
      }
    }

    // Create Teachers
    console.log('Creating teachers...')
    const teachers = Array.from({ length: 15 }, (_, i) => {
      const teacherId = i + 1;
      const subjectId = (teacherId % 10) + 1;
      const classId = (teacherId % 6) + 1;
      
      return {
        id: `teacher${teacherId}`,
        username: `teacher${teacherId}`,
        name: `TName${teacherId}`,
        surname: `TSurname${teacherId}`,
        email: `teacher${teacherId}@example.com`,
        phone: `123-456-789${teacherId}`,
        address: `Address${teacherId}`,
        bloodType: "A+",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
        subjectId,
        classId,
      };
    });

    for (const teacher of teachers) {
      try {
        await prisma.teacher.create({
          data: {
            id: teacher.id,
            username: teacher.username,
            name: teacher.name,
            surname: teacher.surname,
            email: teacher.email,
            phone: teacher.phone,
            address: teacher.address,
            bloodType: teacher.bloodType,
            sex: teacher.sex,
            birthday: teacher.birthday,
            subjects: {
              connect: [{ id: teacher.subjectId }],
            },
            classes: {
              connect: [{ id: teacher.classId }],
            },
          },
        });
        console.log(`Created teacher: ${teacher.username}`)
      } catch (error) {
        console.error(`Error creating teacher ${teacher.username}:`, error)
      }
    }

    // Create Parents
    console.log('Creating parents...')
    const parents = Array.from({ length: 25 }, (_, i) => ({
      id: `parentId${i + 1}`,
      username: `parentId${i + 1}`,
      name: `PName ${i + 1}`,
      surname: `PSurname ${i + 1}`,
      email: `parent${i + 1}@example.com`,
      phone: `123-456-789${i + 1}`,
      address: `Address${i + 1}`,
    }));

    for (const parent of parents) {
      try {
        await prisma.parent.create({
          data: parent,
        });
        console.log(`Created parent: ${parent.username}`)
      } catch (error) {
        console.error(`Error creating parent ${parent.username}:`, error)
      }
    }

    // Create Students
    console.log('Creating students...')
    const students = Array.from({ length: 50 }, (_, i) => {
      const studentId = i + 1;
      const parentId = `parentId${Math.ceil(studentId / 2) % 25 || 25}`;
      const gradeId = (studentId % 6) + 1;
      const classId = (studentId % 6) + 1;
      
      return {
        id: `student${studentId}`,
        username: `student${studentId}`,
        name: `SName${studentId}`,
        surname: `SSurname ${studentId}`,
        email: `student${studentId}@example.com`,
        phone: `987-654-321${studentId}`,
        address: `Address${studentId}`,
        bloodType: "O-",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        parentId,
        gradeId,
        classId,
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
      };
    });

    for (const student of students) {
      try {
        await prisma.student.create({
          data: student,
        });
        console.log(`Created student: ${student.username}`)
      } catch (error) {
        console.error(`Error creating student ${student.username}:`, error)
      }
    }

    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
