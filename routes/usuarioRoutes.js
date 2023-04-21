import express from "express";
import multipart from 'connect-multiparty';
const router = express.Router();
const multipartMiddleware = multipart();
import {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
  actualizarPerfil
} from "../controllers/usuarioController.js";
import checkAuth from "../middleware/checkAuth.js";

//Autenticacion, registro y confirmacion de usuarios
router.post("/", registrar);
router.post("/login", autenticar);
router.get("/confirmar/:token", confirmar);
router.post("/olvide-password", olvidePassword);
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);
router.put("/:id" , multipartMiddleware , checkAuth , actualizarPerfil)
router.get("/perfil", checkAuth, perfil);

export default router;
