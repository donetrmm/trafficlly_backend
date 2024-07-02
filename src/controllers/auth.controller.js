import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET;

const login = async (req, res) => {
    try {
        const { correo, password } = req.body;

        const usuarioEncontrado = await prisma.usuarios.findUnique({
            where: {
                correo: correo
            }
        });

        if (!usuarioEncontrado) {
            return res.status(400).json({
                message: "Credenciales incorrectas!"
            });
        }

        const passwordCorrecto = bcrypt.compareSync(password, usuarioEncontrado.password);
        if (!passwordCorrecto) {
            return res.status(400).json({
                message: "Credenciales incorrectas!"
            });
        }

        const payload = {
            usuario: {
                correo: usuarioEncontrado.correo,
                nombre: usuarioEncontrado.nombre,
                telefono: usuarioEncontrado.telefono
            }
        };

        const token = jwt.sign(payload, jwtSecret, { expiresIn: '8h' });

        return res.status(200).json({
            message: "Acceso correcto",
            token: token
        });
    } catch (error) {
        return res.status(500).json({
            message: "Ocurrió un error al validar credenciales.",
            error: error.message
        });
    }
};

export default login;

