const validateUser = (req, res, next) => {
    const { telefono, nombres, apellidos, correo, password, domicilio } = req.body;
    if (!telefono || !nombres || !apellidos || !correo || !password || !domicilio) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    next();
  };
  
  export default validateUser;  