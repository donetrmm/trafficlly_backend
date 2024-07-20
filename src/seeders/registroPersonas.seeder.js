import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const seedData = async () => {
  const startDate = new Date('2024-07-07'); // Fecha de inicio del rango
  const endDate = new Date('2024-07-17');   // Fecha de fin del rango
  const locations = ['adentro', 'afuera'];

  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const date = currentDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    for (let hour = 0; hour < 24; hour++) {
      const hourString = hour.toString().padStart(2, '0') + ':00';
      
      for (const location of locations) {
        const numPersons = generateRandomNumber(1, 10); 
        const kitId = 12345;

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

    currentDate.setDate(currentDate.getDate() + 1); // Avanzar al siguiente día
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
