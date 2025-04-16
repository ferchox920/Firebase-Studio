import { transporter } from '../config/mailer.config';

export const sendVerificationEmail = async (to: string, otp: string) => {
  await transporter.sendMail({
    from: '"Tu App" <no-reply@tuapp.com>',
    to,
    subject: 'Verificación de correo electrónico',
    html: `
      <div style="font-family: sans-serif;">
        <h2>Hola 👋</h2>
        <p>Tu código de verificación es:</p>
        <h3 style="background:#eee; padding:10px; width:max-content;">${otp}</h3>
        <p>Gracias por registrarte. ✨</p>
      </div>
    `,
  });
};
