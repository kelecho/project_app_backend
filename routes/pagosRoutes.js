import express from "express";
const router = express.Router();
import Stripe from 'stripe';
import dotenv from "dotenv";
import { cambiarPremium } from "../controllers/pagosControllers.js";
import checkAuth from "../middleware/checkAuth.js";

router
  .route("/pagosuccess")
  .post(checkAuth, cambiarPremium)

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Moquear producto, solo necesitamos 1 producto
async function mockProducts() {
  const product = await stripe.products.create({
    name: 'Servicio Premium',
    default_price_data: {
      unit_amount: 1000,
      currency: 'usd',
      recurring: { interval: 'month' },
    },
  });
  return product,
    console.log(product);
}

// Post para crear producto/ no se necesita en backend
router.post('/create', async (req, res) => {
  const price = await mockProducts();
  return price,
    res.status(200).json();
});


// Creación del checkout a la página de pago: en price pegar el default_price que sale en la consola.

router.post('/checkout', async (req, res) => {
  // paymentService.createPaymentIntent(req.body)
  try {
    const { line_items } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      success_url: 'http://localhost:5173/proyectos/pago-exitoso',
      cancel_url: 'http://localhost:5173/proyectos/pago-fallido',
      line_items: [
        { price: 'price_1MuLNbAYYDxpAS8qvPpiozwF', quantity: 1 },
      ],
      mode: 'subscription',
      payment_method_types: ['card'],
    });
    console.log(session);
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error en el servidor');
  }
});


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

