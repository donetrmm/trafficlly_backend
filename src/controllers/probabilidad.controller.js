import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createProbabilidad = async (req, res) => {
  const { fecha, dia, idKit } = req.body;
  try {
    const newProbabilidad = await prisma.probabilidad.create({
      data: {
        fecha,
        dia,
        kit: { connect: { id: parseInt(idKit) } }
      }
    });
    res.status(201).json(newProbabilidad);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el registro de probabilidad' });
  }
};

const deleteProbabilidad = async (req, res) => {
  const { fecha } = req.params;
  try {
    await prisma.probabilidad.delete({
      where: { fecha: fecha }
    });
    res.json({ message: 'Registro de probabilidad eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el registro de probabilidad' });
  }
};

const getProbabilidadByDate = async (req, res) => {
  const { fecha } = req.query;
  try {
    const probabilidades = await prisma.probabilidad.findMany({
      where: { fecha: fecha }
    });
    res.json(probabilidades);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los registros de probabilidad' });
  }
};

export {
  createProbabilidad,
  deleteProbabilidad,
  getProbabilidadByDate
};
