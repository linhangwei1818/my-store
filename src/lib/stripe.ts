import Stripe from "stripe";

function createStripe(): Stripe {
  return new Stripe(process.env.STRIPE_SECRET_KEY || "");
}

let _stripe: Stripe | undefined;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = createStripe();
  }
  return _stripe;
}
