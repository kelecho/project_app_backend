import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js";
import { borrarImagen, subirAvatar } from "../helpers/imagenes.js";

const registrar = async (req, res) => {
  //Evitar registros duplicados
  const { email } = req.body;
  const existeUsuario = await Usuario.findOne({ email });
  if (existeUsuario) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({ msg: error.message });
  }
  try {
    const usuario = new Usuario(req.body);
    usuario.token = generarId();
    await usuario.save();
    //Enviar el email de confirmacion
    emailRegistro({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token,
    });
    res.json({ msg: "Usuario creado satisfactoriamente! Verifique su correo para la confirmacion" });
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;
  //Comprobar su el usuario existe
  const usuario = await Usuario.findOne({ email });
  try {
  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }
  //Comprobar si el usuario esta confirmado
  if (!usuario.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }
  //Comprobar el password
  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id),
    });
  } else {
    const error = new Error("El password o el email son incorrecto");
    return res.status(403).json({ msg: error.message });
  }
} catch (error) {
    console.log(error)
}
};

const confirmar = async (req, res) => {
  const { token } = req.params;
  const usuarioAConfirmar = await Usuario.findOne({ token });
  if (!usuarioAConfirmar) {
    const error = new Error("Token no vàlido");
    return res.status(403).json({ msg: error.message });
  }
  try {
    usuarioAConfirmar.confirmado = true;
    usuarioAConfirmar.token = "";
    await usuarioAConfirmar.save();
    res.json({ msg: "Usuario confirmado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  try {
    usuario.token = generarId();
    await usuario.save();
    //Enviar correo
    emailOlvidePassword({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token,
    });
    res.json({
      msg: "Hemos enviado un correo con las instrucciones de restablecer contraseña",
    });
  } catch (error) {
    console.log(error.message);
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const tokenValido = await Usuario.findOne({ token });

  if (tokenValido) {
    res.json({ msg: "Token valido y el Usuario existe" });
  } else {
    const error = new Error("Token no valido");
    return res.status(404).json({ msg: error.message });
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({ token });

  if (usuario) {
    usuario.password = password;
    usuario.token = "";
    try {
      await usuario.save();
      res.json({ msg: "Password modificado correctamente" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("Token no valido");
    return res.status(404).json({ msg: error.message });
  }
};

const perfil = async (req, res) => {
  const { usuario } = req;
  res.json(usuario);
};

const actualizarPerfil = async(req,res)=>{
  const {nombre} = req.body;
  const {avatar} = req.files;
  const {id} = req.params;
  try {
    const usuario = await Usuario.findById(id);
    if(nombre){
      const usuarioActualizado = await Usuario.findOneAndUpdate({_id: id},{$set:{nombre}});
      await usuarioActualizado.save();
    }
    if(usuario.avatar && avatar){
      await borrarImagen(usuario.avatar);
    }
    if(avatar){
      const url = await subirAvatar(avatar.path);
      if(url){
      const usuarioActualizado = await Usuario.findOneAndUpdate({_id: id},{$set:{avatar:url}});
      await usuarioActualizado.save();
      }else{
        throw new Error('No se pudo subir la imagen')
      }
    }
    res.json({msg: 'Actualizado'})
  } catch (error) {
    res.json({msg: error.message})
  }
}

export {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
  actualizarPerfil
};
