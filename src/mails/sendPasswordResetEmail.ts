import { transporter } from '../config/mailer.config';

export const sendPasswordResetEmail = async (to: string, otp: string): Promise<void> => {
  const mailOptions = {
    from: `"Soporte" <${process.env.MAIL_USER}>`,
    to,
    subject: 'Recuperación de contraseña',
    html: `
      <h3>Solicitud de restablecimiento de contraseña</h3>
      <p>Recibimos una solicitud para restablecer tu contraseña. Usa el siguiente código para continuar:</p>
      <h2 style="color: #007BFF;">${otp}</h2>
      <p>Este código expirará en 15 minutos.</p>
      <br />
      <small>Si no hiciste esta solicitud, puedes ignorar este correo.</small>
    `,
  };

  await transporter.sendMail(mailOptions);
};
