import nodemailer from "nodemailer";

export const emailRegistro = async ({ email, nombre, token }) => {
  // TODO: Mover hacia variables de entorno
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Informacion del email
  const info = await transport.sendMail({
    from: '"ProyectosApp - Administrador de Proyectos" <cuentas@uptask.com>',
    to: email,
    subject: "ProyectosApp - Confirma tu Cuenta",
    text: "Comprueba tu cuenta en ProyectosApp",
    html: `
          <p>Hola: ${nombre} comprueba tu cienta en ProyectosApp</p>
          <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:</p>

          <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
          <p>Si tu no create esta cuenta, puedes ignorar el mensaje</p>
    `,
  });
};

export const emailOlvidePassword = async ({ email, nombre, token }) => {
  // TODO: Mover hacia variables de entorno
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Informacion del email
  const info = await transport.sendMail({
    from: '"ProyectosApp - Administrador de Proyectos" <cuentas@proyectosapp.com>',
    to: email,
    subject: "ProyectosApp - Restablece tu Cuenta",
    text: "Restablece tu Password",
    html: `
          <p>Hola: ${nombre} has solicitado restablecer tu password</p>
          <p>sigue el siguiente enlace para generar un nuevo password:</p>

          <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer Password</a>
          <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>
    `,
  });
};
