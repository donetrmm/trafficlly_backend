import { PrismaClient } from '@prisma/client';
import { sendEmail } from '../middlewares/sendEmail.middelware.js';
import axios from 'axios';

const prisma = new PrismaClient();

const getWeeklyData = async (kitId) => {
  const today = new Date();
  const lastSunday = new Date(today.setDate(today.getDate() - today.getDay()));
  const twoWeeksAgo = new Date(lastSunday.setDate(lastSunday.getDate() - 14));
  const oneWeekAgo = new Date(twoWeeksAgo.setDate(twoWeeksAgo.getDate() + 7));

  const registrosWeek1 = await prisma.registro_personas.findMany({
    where: {
      idKit: kitId,
      fecha: {
        gte: twoWeeksAgo,
        lt: oneWeekAgo
      }
    }
  });

  const registrosWeek2 = await prisma.registro_personas.findMany({
    where: {
      idKit: kitId,
      fecha: {
        gte: oneWeekAgo,
        lt: lastSunday
      }
    }
  });

  const processWeekData = (registros) => {
    const weekData = new Array(7).fill(0);
    registros.forEach((registro) => {
      const dayOfWeek = new Date(registro.fecha).getDay() - 1;
      weekData[dayOfWeek] += registro.numero_personas;
    });
    return weekData;
  };

  return {
    week1: processWeekData(registrosWeek1),
    week2: processWeekData(registrosWeek2)
  };
};

const sendWeeklyReport = async (req, res) => {
  try {
    const kits = await prisma.kit_traffic.findMany();
    const apiEndpoint = 'http://other-api-endpoint.com/predict-traffic';
    const usuario = await prisma.usuarios.findUnique({
        where: { id: parseInt(kits.idPropietario) }
      });
    for (const kit of kits) {
      const weeklyData = await getWeeklyData(kit.id);

      const response = await axios.post(apiEndpoint, {
        week1: weeklyData.week1,
        week2: weeklyData.week2
      });

      const emailContent = `
        <h1>Reporte Semanal</h1>
        <p>${response.data.message}</p>
      `;

      await sendEmail({
        from: process.env.GMAIL_USER,
        to: usuario.correo,
        subject: 'Reporte Semanal de Tráfico',
        html: emailContent
      });
    }

    res.status(200).json({ message: 'Correos enviados exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar el reporte semanal' });
  }
};

export { sendWeeklyReport };
