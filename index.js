import express from 'express';
const app = express();

import authRouter from './src/routes/auth.routes.js';
import usuariosRouter from './src/routes/usuarios.routes.js';
import kitsRouter from './src/routes/kits.routes.js'

app.use(express.json());
app.use('/auth', authRouter);
app.use('/usuarios', usuariosRouter);
app.use('/kits', kitsRouter)


const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log("API escuchando en el puerto " + PORT);
});
