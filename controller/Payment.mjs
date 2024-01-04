import Stripe from "stripe";
import "../config/index.mjs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

const checkOut = async (req, res) => {
    try {
      const { items } = req.body;
  
      const lineItems = items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      }));
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: lineItems,
        success_url: "https://fence-web-project.vercel.app/success",
        cancel_url: "https://fence-web-project.vercel.app/cancel",
      });
  
      res.json({ url: session.url });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
  

export { checkOut };