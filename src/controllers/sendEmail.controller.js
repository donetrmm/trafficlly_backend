import { sendEmail } from '../middlewares/sendEmail.middelware.js';

const sendMail = async (req, res) => {
  const { to, subject, text, html } = req.body;
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    text,
    html
  };

  try {
    await sendEmail(mailOptions);
    res.status(200).json({ message: 'Correo enviado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar el correo' });
  }
};

export { sendMail };
