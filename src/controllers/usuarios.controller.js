import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const createUser = async (req, res) => {
  const { telefono, nombres, apellidos, correo, password, domicilio } = req.body;
  try {
    const existingUser = await prisma.usuarios.findUnique({ where: { correo } });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALTOS_BCRYPT));
    const usuario = await prisma.usuarios.create({
      data: { telefono, nombres, apellidos, correo, password: hashedPassword, domicilio },
    });
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { correo } = req.params;
  const { password } = req.body;
  try {
    const existingUser = await prisma.usuarios.findUnique({ where: { correo } });
    if (!existingUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (!password) {
      return res.status(400).json({ error: 'La contraseña es obligatoria' });
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    const usuario = await prisma.usuarios.update({
      where: { correo },
      data: { password: hashedPassword },
    });
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const deleteUser = async (req, res) => {
  const { correo } = req.params;
  try {
    const existingUser = await prisma.usuarios.findUnique({ where: { correo } });
    if (!existingUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await prisma.usuarios.delete({ where: { correo } });
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getIDCorreo = async (req, res) => {
  const telefono = req.usuario.telefono;
  try {
    const existingUser = await prisma.usuarios.findUnique({ where: { telefono } });
    if (!existingUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ 
      message: 'Usuario encontrado.',
      correo: existingUser.correo,
      telefono: existingUser.telefono
     });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default {
  createUser,
  updateUser,
  deleteUser,
  getIDCorreo
};
