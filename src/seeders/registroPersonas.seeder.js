import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const seedData = async () => {
  const date = '2024-06-27';
  const locations = ['adentro', 'afuera'];

  for (let hour = 0; hour < 24; hour++) {
    const hourString = hour.toString().padStart(2, '0') + ':00';
    
    for (const location of locations) {
      const numPersons = generateRandomNumber(1, 10); 
      const kitId = 987;

      await prisma.registro_personas.create({
        data: {
          fecha: date,
          hora: hourString,
          numero_personas: numPersons,
          lugar: location,
          idKit: kitId,
        },
      });
    }
  }
};

seedData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
