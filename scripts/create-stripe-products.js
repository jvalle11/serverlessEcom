const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createProducts() {
  // Example product creation
  const product = await stripe.products.create({
    name: 'My Product',
    description: 'Product description',
    images: ['https://example.com/image.jpg'],
    metadata: {
      handle: 'my-product' // If you want to maintain handles
    }
  });

  // Create price for the product
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: 2000, // $20.00
    currency: 'usd',
  });
} 