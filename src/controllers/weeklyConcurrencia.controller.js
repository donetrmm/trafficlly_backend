// controllers/registroPersonasController.js

import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const getPreviousWeekData = async (kitId) => {
  const today = new Date();
  const todayDayOfWeek = today.getDay(); // 0: domingo, 1: lunes, ..., 6: sábado
  const lastSunday = new Date(today.setDate(today.getDate() - todayDayOfWeek));
  const previousMonday = new Date(lastSunday.setDate(lastSunday.getDate() - 6));

  // Si hoy es lunes y queremos la semana pasada, restamos 7 días adicionales
  if (todayDayOfWeek === 1) {
    previousMonday.setDate(previousMonday.getDate() - 7);
  }

  const weekData = {
    lunes: [],
    martes: [],
    miércoles: [],
    jueves: [],
    viernes: [],
    sábado: [],
    domingo: []
  };

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(previousMonday);
    currentDay.setDate(previousMonday.getDate() + i);
    const formattedDate = currentDay.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    const registros = await prisma.registro_personas.findMany({
      where: {
        idKit: kitId,
        fecha: formattedDate
      }
    });

    const dayOfWeek = currentDay.toLocaleDateString('es-ES', { weekday: 'long' });

    registros.forEach((registro) => {
      weekData[dayOfWeek].push([registro.hora, registro.numero_personas]);
    });
  }

  return weekData;
};

const sendDataAndSaveResponse = async (req, res) => {
  try {
    const kits = await prisma.kit_traffic.findMany();
    const apiEndpoint = 'http://localhost:9500/trafico'; // Endpoint de la API Flask

    for (const kit of kits) {
      const weeklyData = await getPreviousWeekData(kit.id);

      // Enviar datos a la API Flask
      const response = await axios.post(apiEndpoint, weeklyData);

      // Manejar la respuesta de la API Flask
      const { data } = response;
      console.log(data); // Verificar la respuesta en la consola

      // Ejemplo de cómo podrías manejar la respuesta en Express
      // Guardar la respuesta en la tabla Concurrencia u otro procesamiento necesario
      await prisma.concurrencia.create({
        data: {
           fecha: new Date().toISOString().split('T')[0],
           hora: data.hora_max_tráfico,
           dia: data.día_max_tráfico,
           numero_personas: data.max_tráfico,
           lugar: 'ambos',
           idKit: kit.id
         }
       });

      // Ejemplo de respuesta si todo fue exitoso
      res.status(200).json({ message: 'Datos procesados y guardados exitosamente' });
    }
  } catch (error) {
    console.error('Error al procesar los datos:', error);
    res.status(500).json({ error: 'Error al procesar los datos' });
  }
};

export { sendDataAndSaveResponse };
