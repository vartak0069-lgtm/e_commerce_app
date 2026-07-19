const Validator = {
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  password: (value) => value.length >= 6,
  phone: (value) => /^[6-9]\d{9}$/.test(value),
  pincode: (value) => /^[1-9][0-9]{5}$/.test(value),
  required: (value) => value !== undefined && value !== null && String(value).trim().length > 0,
};

function showFieldError(input, message) {
  clearFieldError(input);
  const error = document.createElement('small');
  error.className = 'text-danger field-error';
  error.textContent = message;
  input.parentElement.appendChild(error);
  input.style.borderColor = 'var(--color-danger)';
}

function clearFieldError(input) {
  const existing = input.parentElement.querySelector('.field-error');
  if (existing) existing.remove();
  input.style.borderColor = '';
}
