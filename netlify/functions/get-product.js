/**
 * Get Product API Endpoint
 *
 * * Purpose: Retrieve data on a specific product
 * @param {string} itemId - Stripe product ID
 *
 * Example:
 * ```
 * fetch('/.netlify/functions/get-product', {
 *   method: 'POST',
 *   body: JSON.stringify({ itemId: 'prod_123456789' })
 * })
 * ```
 */

const { stripeClient } = require("./utils/stripeClient");

exports.handler = async (event) => {
  const { itemId } = JSON.parse(event.body);

  try {
    console.log("--------------------------------");
    console.log("Retrieving product details...");
    console.log("--------------------------------");
    
    // Fetch product and its prices from Stripe
    const product = await stripeClient.products.retrieve(itemId, {
      expand: ['default_price']
    });

    // Get all prices for this product
    const prices = await stripeClient.prices.list({
      product: itemId,
      active: true,
    });

    // Format the response to match your frontend expectations
    const formattedResponse = {
      id: product.id,
      handle: product.metadata.handle || product.id, // You can store handle in metadata
      description: product.description,
      title: product.name,
      image: product.images[0], // First image
      variants: prices.data.map(price => ({
        node: {
          id: price.id,
          title: price.nickname || 'Default',
          quantityAvailable: null, // Stripe doesn't track inventory by default
          priceV2: {
            amount: price.unit_amount / 100, // Stripe stores amounts in cents
            currencyCode: price.currency.toUpperCase()
          }
        }
      }))
    };

    return {
      statusCode: 200,
      body: JSON.stringify(formattedResponse)
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};
