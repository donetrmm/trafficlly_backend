import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getKitById = async (req, res) => {
  const { id } = req.params;
  try {
    const kit = await prisma.kit_traffic.findUnique({
      where: { id: parseInt(id) }
    });
    if (!kit) {
      return res.status(404).json({ error: 'Kit no encontrado' });
    }
    res.json(kit);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el kit' });
  }
};

const getKitsByUser = async (req, res) => {
  const idPropietario = req.usuario.telefono;
  try {
    const kits = await prisma.kit_traffic.findMany({
      where: { idPropietario }
    });
    res.json(kits);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error al obtener los kits del usuario' });
  }
};

const createKit = async (req, res) => {
  const { id, nombre } = req.body;
  const idPropietario = req.usuario.telefono;
  try {
    const newKit = await prisma.kit_traffic.create({
      data: {
        id: parseInt(id),
        nombre,
        idPropietario
      }
    });
    res.status(201).json(newKit);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el kit' });
  }
};

const updateKit = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  try {
    const updatedKit = await prisma.kit_traffic.update({
      where: { id: parseInt(id) },
      data: { nombre }
    });
    res.json(updatedKit);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el kit' });
  }
};

const deleteKit = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.kit_traffic.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Kit eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el kit' });
  }
};

export {
  getKitById,
  getKitsByUser,
  createKit,
  updateKit,
  deleteKit
};
