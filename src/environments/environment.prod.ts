export const environment = {
  production: true,
  stripe: {
    publishableKey: process.env['STRIPE_PUBLISHABLE_KEY'] || '',
  }
};
