import express from "express";
import multipart from 'connect-multiparty';

const router = express.Router();
const multipartMiddleware = multipart();
import {
  obtenerProyectos,
  obtenerProyecto,
  nuevoProyecto,
  editarProyecto,
  eliminarProyecto,
} from "../controllers/proyectoController.js";
import checkAuth from "../middleware/checkAuth.js";

router
  .route("/")
  .get(checkAuth, obtenerProyectos)
  .post( multipartMiddleware,checkAuth, nuevoProyecto);
router
  .route("/:id")
  .get(checkAuth, obtenerProyecto)
  .put(multipartMiddleware,checkAuth, editarProyecto)
  .delete(checkAuth, eliminarProyecto);

export default router;
