import { PrismaClient } from '@prisma/client';
import { sendEmail } from '../middlewares/sendEmail.middelware.js';
import axios from 'axios';
import { response } from 'express';

const prisma = new PrismaClient();

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getWeeklyData = async (kitId) => {
  const today = new Date();
  const lastSunday = new Date(today.setDate(today.getDate() - today.getDay()));
  const twoWeeksAgo = new Date(lastSunday);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const oneWeekAgo = new Date(twoWeeksAgo);
  oneWeekAgo.setDate(oneWeekAgo.getDate() + 7);

  const registrosWeek1 = await prisma.registro_personas.findMany({
    where: {
      idKit: kitId,
      fecha: {
        gte: formatDate(twoWeeksAgo),
        lt: formatDate(oneWeekAgo)
      }
    }
  });

  const registrosWeek2 = await prisma.registro_personas.findMany({
    where: {
      idKit: kitId,
      fecha: {
        gte: formatDate(oneWeekAgo),
        lt: formatDate(lastSunday)
      }
    }
  });

  const processWeekData = (registros) => {
    const weekData = new Array(7).fill(0);
    registros.forEach((registro) => {
      const dayOfWeek = new Date(registro.fecha).getDay();
      weekData[dayOfWeek === 0 ? 6 : dayOfWeek - 1] += registro.numero_personas;
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

    for (const kit of kits) {
      const usuario = await prisma.usuarios.findUnique({
        where: { telefono: kit.idPropietario }
      });

      if (!usuario) {
        console.log(`Usuario con id ${kit.idPropietario} no encontrado.`);
        continue;
      }

      const weeklyData = await getWeeklyData(kit.id);
      const apiEndpoint = 'http://0.0.0.0:8000/max_traffic_day/';

      const response = await axios.post(apiEndpoint, {
        week1: weeklyData.week1,
        week2: weeklyData.week2
      });
      const dia = response.data.day;
      const fechaActual = new Date().toISOString().split('T')[0];
      const newProbabilidad = await prisma.probabilidad.create({
        data: {
          fecha: fechaActual,
          dia: dia,
          kit: { connect: { id: parseInt(kit.id) } }
        }
      });
      

      const emailContent = `
        <h1>Día de mayor probabilidad:</h1>
        <p>${response.data.day}</p>
      `;

      await sendEmail({
        from: process.env.GMAIL_USER,
        to: usuario.correo,
        subject: 'Probabilidad del día con mayor trafico peatonal',
        html: emailContent
      });
    }

    res.status(200).json({ message: 'Correos enviados exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar el reporte semanal' });
  }
};

export { sendWeeklyReport };
