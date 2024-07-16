import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createRegistro = async (req, res) => {
  const { fecha, hora, numero_personas, lugar, idKit } = req.body;
  try {
    const newRegistro = await prisma.registro_personas.create({
      data: {
        fecha,
        hora,
        numero_personas,
        lugar,
        idKit: parseInt(idKit)
      }
    });
    res.status(201).json(newRegistro);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error al crear el registro de personas' });
  }
};

const deleteRegistro = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.registro_personas.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Registro de personas eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el registro de personas' });
  }
};

const getRegistrosByDateAndPlace = async (req, res) => {
  const { fecha, lugar, idKit } = req.query;
  const id = parseInt(idKit)
  try {
    const registros = await prisma.registro_personas.findMany({
      where: {
        fecha,
        lugar,
        idKit: id
      }
    });
    res.json(registros);
  } catch (error) {
    console.log(error)

    res.status(500).json({ error: 'Error al obtener los registros de personas' });
  }
};

const getSumOfPeopleByDateAndPlace = async (req, res) => {
  const { fecha, lugar, idKit } = req.query;
  try {
    const result = await prisma.registro_personas.aggregate({
      _sum: { numero_personas: true },
      where: {
        fecha,
        lugar,
        idKit: parseInt(idKit)
      }
    });
    res.json({ idKit: idKit, personas: result._sum.numero_personas, fecha: fecha, lugar: lugar});
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la suma de personas' });
  }
};

const getSumOfPeopleByLastWeek = async (req, res) => {
  const { lugar, idKit } = req.query;
  const kitId = parseInt(idKit);

  try {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)

    // Ajustar las fechas para obtener el lunes y el domingo de la semana pasada
    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - dayOfWeek - 6); // Set to the last Monday
    lastMonday.setHours(0, 0, 0, 0); // Set to start of the day

    const lastSunday = new Date(lastMonday);
    lastSunday.setDate(lastMonday.getDate() + 6); // Set to the last Sunday
    lastSunday.setHours(23, 59, 59, 999); // Set to end of the day

    // Formatear las fechas en AAAA-MM-DD
    const formatDateString = (date) => date.toISOString().split('T')[0];

    const formattedLastMonday = formatDateString(lastMonday);
    const formattedLastSunday = formatDateString(lastSunday);

    // Buscar registros dentro del rango de la semana pasada
    const registros = await prisma.registro_personas.findMany({
      where: {
        fecha: {
          gte: formattedLastMonday,
          lte: formattedLastSunday
        },
        lugar,
        idKit: kitId
      },
      select: {
        fecha: true,
        numero_personas: true
      }
    });

    const weekData = new Array(7).fill(0);

    registros.forEach((registro) => {
      const day = new Date(registro.fecha).getDay(); // 0 (Sunday) to 6 (Saturday)
      const dayIndex = (day === 0 ? 6 : day - 1); // Ajustar para que el domingo sea el último día de la semana
      weekData[dayIndex] += registro.numero_personas;
    });

    res.json({
      idKit: kitId,
      lugar,
      weekData: {
        lunes: weekData[0],
        martes: weekData[1],
        miércoles: weekData[2],
        jueves: weekData[3],
        viernes: weekData[4],
        sábado: weekData[5],
        domingo: weekData[6]
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la suma de personas' });
  }
};



export {
  createRegistro,
  deleteRegistro,
  getRegistrosByDateAndPlace,
  getSumOfPeopleByDateAndPlace,
  getSumOfPeopleByLastWeek
};
