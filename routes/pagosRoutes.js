import express from "express";
const router = express.Router();
import Stripe from 'stripe';
import dotenv from "dotenv";

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
  const {line_items} = req.body;
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

});




export default router;

