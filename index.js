import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();


import authRouter from './src/routes/auth.routes.js';
import usuariosRouter from './src/routes/usuarios.routes.js';
import kitsRouter from './src/routes/kits.routes.js'
import registroRouter from './src/routes/registroPersonas.routes.js';
import probabilidadRouter from './src/routes/probabilidad.routes.js';
import concurrenciaRouter from './src/routes/concurrencia.routes.js';
import sendEmailRouter from './src/routes/sendEmail.routes.js';

app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use('/auth', authRouter);
app.use('/usuarios', usuariosRouter);
app.use('/kits', kitsRouter);
app.use('/registro', registroRouter);
app.use('/probabilidades', probabilidadRouter);
app.use('/concurrencias', concurrenciaRouter);
app.use('/alert', sendEmailRouter);


const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log("API escuchando en el puerto " + PORT);
});
