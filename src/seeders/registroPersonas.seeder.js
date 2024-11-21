import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const seedData = async () => {
  const startDate = new Date('2024-10-03'); // Fecha de inicio del rango
  const endDate = new Date('2024-11-17');   // Fecha de fin del rango
  const locations = ['adentro', 'afuera'];
  const startHour = 9; // Hora de inicio (por ejemplo, 8 AM)
  const endHour = 19;  // Hora de fin (por ejemplo, 6 PM)

  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const date = currentDate.toISOString().split('T')[0];

    for (let hour = startHour; hour <= endHour; hour++) {
      const hourString = hour.toString().padStart(2, '0') + ':00';
      
        const numPersons = generateRandomNumber(1, 10); 
        const kitId = 12345;

        await prisma.registro_personas.create({
          data: {
            fecha: date,
            hora: hourString,
            numero_personas: numPersons,
            lugar: "adentro",
            idKit: kitId,
          },
        });
      
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
