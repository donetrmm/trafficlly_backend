import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createConcurrencia = async (req, res) => {
  const { fecha, hora, dia, numero_personas, lugar, idKit } = req.body;
  try {
    const newConcurrencia = await prisma.concurrencia.create({
      data: {
        fecha,
        hora,
        dia,
        numero_personas,
        lugar,
        kit: { connect: { id: parseInt(idKit) } }
      }
    });
    res.status(201).json(newConcurrencia);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el registro de concurrencia' });
  }
};

const deleteConcurrencia = async (req, res) => {
  const {fecha } = req.params;
  try {
    await prisma.concurrencia.delete({
      where: { fecha }
    });
    res.json({ message: 'Registro de concurrencia eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el registro de concurrencia' });
  }
};

const getConcurrenciaByDate = async (req, res) => {
  const { fecha, lugar } = req.query;
  try {
    const concurrencias = await prisma.concurrencia.findMany({
      where: { fecha, lugar }
    });
    res.json(concurrencias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los registros de concurrencia' });
  }
};

export {
  createConcurrencia,
  deleteConcurrencia,
  getConcurrenciaByDate
};
