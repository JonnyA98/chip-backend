require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_API_KEY);

const createPaymentIntent = async (req, res) => {
  const { amount } = req.body;

  const calculateOrderAmount = (amount) => {
    return amount;
  };
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(amount),
    currency: "gbp",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};

module.exports = {
  createPaymentIntent,
};
