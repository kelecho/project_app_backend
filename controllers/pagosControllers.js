import Stripe from 'stripe';
import dotenv from "dotenv";
import Usuario from "../models/Usuario.js";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const verificarPremium = async (req, res) => {
  const userId = req.usuario._id;
  const usuario = await Usuario.findById({ _id: userId });
  if(usuario.premium === false){
     return res.json({ msg: "Usuario no actualizado a premium" });
  }
    res.json({ msg: "Usuario actualizado a premium" });
};

const checkout = async (req, res) => {
    const userId = req.usuario._id
    const usuario = await Usuario.findById({ _id: userId });
    if(usuario.premium === true){
        return res.json({ msg: "Este usuario ya es premium" });
    }
  try {
    const session = await stripe.checkout.sessions.create({
      success_url: "http://localhost:5173/proyectos/pago-exitoso",
      cancel_url: "http://localhost:5173/proyectos/pago-fallido",
      line_items: [{ price: "price_1N4SmbI3JMaqaSPWLSod3myk", quantity: 1 }],
      mode: "subscription",
      payment_method_types: ["card"],
      client_reference_id:userId
    });
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.log(error)
    res.status(500).send("Error en el servidor");
  }
};

const webhook = async(req, res) => {
    const event = req.body;
  
    // Handle the event
    try{
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      // ... handle other event types
      case 'checkout.session.completed':
        const session = event.data.object;
        if(session.payment_status === 'paid'){
            const usuario = await Usuario.findOneAndUpdate(
                { email: session.customer_details.email },
                { $set: { premium: true } },
                { new: true } // para devolver la instancia actualizada
              );
              console.log(session)
              await usuario.save();
        }
        break;
      default:
        console.log("Unhandled events :", event.type)
        break;
    }
  
    // Return a response to acknowledge receipt of the event
    res.json({received: true});
    }catch(err){
        console.log(err)
        res.json({received: false});
    }   
  };

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
  const create = async (req, res) => {
    const price = await mockProducts();
    return price,
      res.status(200).json();
  };



export { verificarPremium, checkout, create, webhook };
