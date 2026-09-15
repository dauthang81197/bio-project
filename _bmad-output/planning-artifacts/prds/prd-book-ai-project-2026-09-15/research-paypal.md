# PayPal Discovery Notes

Researched on 2026-09-15. These findings inform discovery; they are not user-approved scope.

- Standard Checkout supports browser UI with server-side order creation and capture. Keep credentials on the server. Source: https://developer.paypal.com/studio/checkout/standard/integrate
- Payment approval does not imply completed capture. Proposed requirement: release the purchased PDF only after server-confirmed successful payment for the order; pending payments should not trigger fulfillment. Source: https://developer.paypal.com/payment-methods/webhooks
- If webhooks are used, verify authenticity and handle repeated events safely. Source: https://developer.paypal.com/api/rest/webhooks/rest/
- Confirm merchant account country, business account readiness, buyer markets, and currency. Do not infer the merchant's country from conversation language. Sources: https://www.paypal.com/vn/business/accept-payments and https://developer.paypal.com/checkout/integrate
- PDF delivery journey remains a product decision: guest versus account purchase, email versus library access, and re-download policy. PayPal checkout does not decide these application behaviors.
