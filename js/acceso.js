'use strict';
// UI prototype only. No requests, account storage or simulated authentication.
(() => {
  const form = document.getElementById('access-form');
  if (!form) return;
  const mode = form.dataset.mode;
  const status = document.getElementById('form-status');
  const fields = [...form.querySelectorAll('input')];
  const touched = new Set();
  const usernamePattern = /^[a-zA-Z0-9_]{3,24}$/;
  const value = id => document.getElementById(id)?.value || '';

  function errorFor(input) {
    const v = input.value;
    if (!v.trim()) return 'Completa este campo.';
    if (input.id === 'name' && v.trim().length < 2) return 'Escribe un nombre de al menos 2 caracteres.';
    if (input.id === 'username' && !usernamePattern.test(v.trim())) return 'Usa de 3 a 24 letras sin tildes, números o guiones bajos.';
    if (mode === 'register' && input.id === 'password' && v.length < 8) return 'Usa al menos 8 caracteres para tu contraseña.';
    if (input.id === 'confirm-password' && v !== value('password')) return 'Las contraseñas no coinciden.';
    return '';
  }

  function validate(input) {
    const error = errorFor(input);
    document.getElementById(input.id + '-error').textContent = error;
    input.setAttribute('aria-invalid', String(Boolean(error)));
    return !error;
  }

  fields.forEach(input => {
    if (input.type === 'password') input.dataset.password = 'true';
    input.addEventListener('blur', () => { touched.add(input.id); validate(input); });
    input.addEventListener('input', () => {
      status.textContent = '';
      if (touched.has(input.id)) validate(input);
      if (input.id === 'password' && touched.has('confirm-password')) validate(document.getElementById('confirm-password'));
    });
  });

  document.querySelectorAll('[data-toggle]').forEach(button => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.toggle);
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      button.textContent = show ? 'Ocultar' : 'Ver';
      button.setAttribute('aria-pressed', String(show));
      button.setAttribute('aria-label', (show ? 'Ocultar ' : 'Mostrar ') + (input.id === 'confirm-password' ? 'confirmación de contraseña' : 'contraseña'));
    });
  });

  function clearPasswords() {
    form.querySelectorAll('[data-password]').forEach(input => {
      input.value = '';
      input.type = 'password';
      const button = form.querySelector('[data-toggle="' + input.id + '"]');
      button.textContent = 'Ver';
      button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-label', 'Mostrar ' + (input.id === 'confirm-password' ? 'confirmación de contraseña' : 'contraseña'));
      touched.delete(input.id);
      input.removeAttribute('aria-invalid');
      document.getElementById(input.id + '-error').textContent = '';
    });
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const invalid = [];
    fields.forEach(input => { touched.add(input.id); if (!validate(input)) invalid.push(input); });
    if (invalid.length) {
      status.textContent = 'Revisa los campos señalados para continuar.';
      invalid[0].focus();
      return;
    }
    clearPasswords();
    status.textContent = mode === 'register'
      ? 'Los campos tienen un formato válido. Esta es una vista previa: no se creó una cuenta ni se verificaron el usuario o el código de clase. La contraseña se ha borrado del formulario.'
      : 'Los campos están completos. El inicio de sesión estará disponible al conectar el servidor. No se verificaron las credenciales y la contraseña se ha borrado del formulario.';
    status.focus();
  });

  form.querySelector('[type=submit]').disabled = false;

  // Forms must never submit secrets through a URL, even before JavaScript loads.
  window.addEventListener('pagehide', clearPasswords);
})();