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
        idKit
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

export {
  createRegistro,
  deleteRegistro,
  getRegistrosByDateAndPlace,
  getSumOfPeopleByDateAndPlace
};
