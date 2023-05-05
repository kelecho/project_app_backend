import { borrarImagen, subirIconoProyecto } from "../helpers/imagenes.js";
import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js"
import Usuario from "../models/Usuario.js";

const obtenerProyectos = async (req, res) => {
  const proyectos = await Proyecto.find()
    .where("creador")
    .equals(req.usuario)
    .select("-tareas");
  res.json(proyectos);
};

const nuevoProyecto = async (req, res) => {
  const userId = req.usuario._id;
  const usuario = await Usuario.findById({_id:userId})
  const proyectos = await Proyecto.find({creador: userId})
  if(usuario.premium === false && proyectos.length === 5){
    return res.json({msg: "No puedes crear mas de 5 proyectos"});
  }

  const {nombre,descripcion,fechaEntrega,cliente} = req.body;
  const {icono} = req.files;

  const proyecto = await new Proyecto({nombre , descripcion , fechaEntrega , cliente});
  proyecto.creador = req.usuario._id;
  if(proyecto && icono){
    const url = await subirIconoProyecto(icono.path);
    proyecto.icono = await url;
  }
  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const obtenerProyecto = async (req, res) => {
  const { id } = req.params;
  const proyecto = await Proyecto.findById(id).populate("tareas");

  if (!proyecto) {
    const error = new Error("Proyecto no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Accion no valida");
    return res.status(404).json({ msg: error.message });
  }
  return res.json(proyecto);
};

const editarProyecto = async (req, res) => {
  const { id } = req.params;
  const {icono} = req.files;

  const proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    const error = new Error("No Encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción No Válida");
    return res.status(401).json({ msg: error.message });
  }

  if(proyecto.icono && icono){
    await borrarImagen(proyecto.icono)
  }
  if(icono){
    const url = await subirIconoProyecto(icono.path)
    proyecto.icono = url || proyecto.icono;
  }
  proyecto.nombre = req.body.nombre || proyecto.nombre;
  proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
  proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
  proyecto.cliente = req.body.cliente || proyecto.cliente;

  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const eliminarProyecto = async (req, res) => {
  const { id } = req.params;

  const proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    const error = new Error("No Encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción No Válida");
    return res.status(401).json({ msg: error.message });
  }

  try {
    await Tarea.deleteMany({proyecto: proyecto._id});
    await proyecto.deleteOne();
    await borrarImagen(proyecto.icono)
    res.json({ msg: "Proyecto Eliminado" });
  } catch (error) {
    console.log(error);
  }
};

export {
  obtenerProyectos,
  obtenerProyecto,
  nuevoProyecto,
  editarProyecto,
  eliminarProyecto,
};
