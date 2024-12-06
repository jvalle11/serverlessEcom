const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Use environment variable for security

exports.handler = async () => {
  try {
    // Fetch products from Stripe
    const stripeProducts = await stripe.products.list({
      limit: 100, // Adjust as needed
    });

    // Fetch prices for each product
    const productDetails = await Promise.all(
      stripeProducts.data.map(async (product) => {
        const prices = await stripe.prices.list({ product: product.id });
        const defaultPrice = prices.data[0]; // Assuming a default price for now

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          image: product.images[0],
          price: defaultPrice.unit_amount / 100, // Convert to dollars
          currency: defaultPrice.currency,
        };
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(productDetails),
    };
  } catch (error) {
    console.error("Error fetching products from Stripe:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch products" }),
    };
  }
};
