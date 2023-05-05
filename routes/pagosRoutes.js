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





;
/*
  // Confirmación del pago del usuario y cambio de estado
router.post('/stripe-webhook', express.raw({type: 'application/json'}), async (req, res) => {
  let event;
  try {
    event = JSON.parse(req.body);
  } catch (err) {
    console.log(`Error parsing webhook JSON: ${err}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
  
    // Actualizar el estado del usuario en la base de datos
    await Usuario.findOneAndUpdate(
      { _id: userId },
      { $set: { premium: true } }
  
    );
    await Usuario.save
  
    console.log(`Pago completado para el usuario con ID ${userId}`);
  }
  res.sendStatus(200).json('<h1>Pago exitoso, ya estás suscripto a la versión premium de ProyectosApp</h1>');
});
*/
  export default router;

