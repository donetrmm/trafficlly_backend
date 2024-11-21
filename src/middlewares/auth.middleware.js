import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

const verificarJWT = (req, res, next) => {
    const token = req.get('Authorization');

    if (!token) {
        return res.status(401).send({
            message: "Token no proporcionado."
        });
    }

    jwt.verify(token, jwtSecret, (err, decode) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).send({
                    message: "Token expirado."
                });
            } else {
                return res.status(401).send({
                    message: "Error al validar token.",
                    error: err.message
                });
            }
        }

        req.usuario = decode.usuario;
        next();
    });
};

export default verificarJWT;