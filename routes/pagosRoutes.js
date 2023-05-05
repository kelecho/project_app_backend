import express from "express";
const router = express.Router();
import { checkout, create, verificarPremium, webhook } from "../controllers/pagosControllers.js";
import checkAuth from "../middleware/checkAuth.js";

router
.route("/pagosuccess")
.post(checkAuth, verificarPremium)

// Creación del checkout a la página de pago: en price pegar el default_price que sale en la consola.
router
  .route("/checkout")
  .post(checkAuth, checkout)
router
  .route("/webhook")
  .post(webhook)
router
  .route("/create")
  .post(checkAuth, create)

export default router;