const { SHIPPING_CHARGE, FREE_SHIPPING_THRESHOLD } = require('../config/constants');

// Simple shipping calculator - no paid courier API needed for a college/internship project.
// Swap this out with FedEx/UPS/Delhivery API later if needed.
function calculateShipping(subtotal) {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return SHIPPING_CHARGE;
}

function estimateDeliveryDate(daysFromNow = 5) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
}

module.exports = { calculateShipping, estimateDeliveryDate };
