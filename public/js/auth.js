document.addEventListener('DOMContentLoaded', () => {
  const loginForm = qs('#loginForm');
  const registerForm = qs('#registerForm');
  const forgotForm = qs('#forgotPasswordForm');
  const resetForm = qs('#resetPasswordForm');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = qs('#email').value.trim();
      const password = qs('#password').value;

      if (!Validator.email(email)) return showFieldError(qs('#email'), 'Enter a valid email');
      if (!Validator.password(password)) return showFieldError(qs('#password'), 'Password too short');

      try {
        const res = await api.post('/auth/login', { email, password }, { auth: false });
        setTokens(res.data);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        showToast('Login successful!', 'success');
        setTimeout(() => (window.location.href = '/'), 600);
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = qs('#name').value.trim();
      const email = qs('#email').value.trim();
      const password = qs('#password').value;
      const phone = qs('#phone')?.value.trim();

      if (!Validator.required(name)) return showFieldError(qs('#name'), 'Name is required');
      if (!Validator.email(email)) return showFieldError(qs('#email'), 'Enter a valid email');
      if (!Validator.password(password)) return showFieldError(qs('#password'), 'Min 6 characters');

      try {
        const res = await api.post('/auth/register', { name, email, password, phone }, { auth: false });
        setTokens(res.data);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        showToast('Account created!', 'success');
        setTimeout(() => (window.location.href = '/'), 600);
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = qs('#email').value.trim();
      try {
        const res = await api.post('/auth/forgot-password', { email }, { auth: false });
        showToast(res.message, 'success');
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  if (resetForm) {
    resetForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const token = getQueryParam('token');
      const newPassword = qs('#newPassword').value;
      try {
        await api.post('/auth/reset-password', { token, newPassword }, { auth: false });
        showToast('Password reset! Please log in.', 'success');
        setTimeout(() => (window.location.href = '/auth/login.html'), 1000);
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }
});
