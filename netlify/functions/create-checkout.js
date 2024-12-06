const { stripeClient } = require("./utils/stripeClient");

exports.handler = async (event) => {
  const { priceId, quantity } = JSON.parse(event.body);

  try {
    const session = await stripeClient.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price: priceId,
        quantity: quantity
      }],
      success_url: `${process.env.DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN}/canceled`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id, url: session.url })
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
}; 