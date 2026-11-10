(function () {
  "use strict";

  // Login apenas para demonstração escolar. Autenticação feita somente no navegador
  // não é segura em produção, pois as credenciais podem ser descobertas no JavaScript.
  const DEMO_CREDENTIALS = { username: "admin", password: "daphne123" };
  const form = document.getElementById("login-form");
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const message = document.getElementById("login-message");
  const toggle = document.getElementById("toggle-password");

  toggle?.addEventListener("click", () => {
    const showing = password.type === "text";
    password.type = showing ? "password" : "text";
    toggle.setAttribute("aria-label", showing ? "Mostrar senha" : "Ocultar senha");
    toggle.classList.toggle("active", !showing);
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    document.querySelectorAll(".field-error").forEach((element) => { element.textContent = ""; });
    message.textContent = "";
    message.className = "form-message";

    let valid = true;
    if (!username.value.trim()) {
      document.getElementById("username-error").textContent = "Informe o usuário.";
      valid = false;
    }
    if (!password.value) {
      document.getElementById("password-error").textContent = "Informe a senha.";
      valid = false;
    }
    if (!valid) return;

    if (username.value.trim() === DEMO_CREDENTIALS.username && password.value === DEMO_CREDENTIALS.password) {
      sessionStorage.setItem("daphneAdminAuthenticated", "true");
      message.textContent = "Acesso autorizado. Abrindo o painel...";
      message.classList.add("success");
      setTimeout(() => { window.location.href = "dashboard.html"; }, 600);
    } else {
      message.textContent = "Usuário ou senha incorretos. Confira os dados de demonstração.";
      message.classList.add("error");
      password.focus();
    }
  });
})();
