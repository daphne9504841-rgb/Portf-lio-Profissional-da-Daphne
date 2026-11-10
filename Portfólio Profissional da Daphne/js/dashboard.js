(function () {
  "use strict";

  if (sessionStorage.getItem("daphneAdminAuthenticated") !== "true") {
    window.location.replace("login.html");
    return;
  }

  const form = document.getElementById("project-form");
  const list = document.getElementById("admin-project-list");
  const message = document.getElementById("dashboard-message");
  const cancelButton = document.getElementById("cancel-edit");
  const description = document.getElementById("project-description");

  const fields = {
    id: document.getElementById("project-id"),
    title: document.getElementById("project-title"),
    technologies: document.getElementById("project-tech"),
    description,
    image: document.getElementById("project-image"),
    link: document.getElementById("project-link"),
    github: document.getElementById("project-github"),
  };

  document.getElementById("current-date").textContent = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long" }).format(new Date());
  document.getElementById("logout-button").addEventListener("click", () => {
    sessionStorage.removeItem("daphneAdminAuthenticated");
    window.location.href = "login.html";
  });

  description.addEventListener("input", () => {
    document.getElementById("description-count").textContent = description.value.length;
  });

  function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
    })[character]);
  }

  function showMessage(text, type) {
    message.textContent = text;
    message.className = `dashboard-message show ${type}`;
    window.setTimeout(() => { message.classList.remove("show"); }, 3500);
  }

  function isValidURL(value) {
    if (!value) return true;
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol);
    } catch {
      return false;
    }
  }

  function validate() {
    let valid = true;
    form.querySelectorAll(".field-error").forEach((element) => { element.textContent = ""; });
    ["title", "technologies", "description"].forEach((key) => {
      if (!fields[key].value.trim()) {
        fields[key].closest(".form-group").querySelector(".field-error").textContent = "Este campo é obrigatório.";
        valid = false;
      }
    });
    ["image", "link", "github"].forEach((key) => {
      if (!isValidURL(fields[key].value.trim())) {
        fields[key].closest(".form-group").querySelector(".field-error").textContent = "Informe uma URL completa iniciada por http:// ou https://.";
        valid = false;
      }
    });
    return valid;
  }

  function projectData() {
    return {
      title: fields.title.value.trim(),
      technologies: fields.technologies.value.trim(),
      description: fields.description.value.trim(),
      image: fields.image.value.trim(),
      link: fields.link.value.trim(),
      github: fields.github.value.trim(),
    };
  }

  function resetForm() {
    form.reset();
    fields.id.value = "";
    document.getElementById("description-count").textContent = "0";
    document.getElementById("form-title").textContent = "Adicionar novo projeto";
    document.getElementById("submit-label").textContent = "Publicar projeto";
    cancelButton.hidden = true;
    form.querySelectorAll(".field-error").forEach((element) => { element.textContent = ""; });
  }

  function editProject(id) {
    const project = window.ProjectStore.getProjects().find((item) => item.id === id);
    if (!project) return;
    Object.keys(fields).forEach((key) => {
      if (key !== "id") fields[key].value = project[key] || "";
    });
    fields.id.value = project.id;
    document.getElementById("description-count").textContent = fields.description.value.length;
    document.getElementById("form-title").textContent = "Editar projeto";
    document.getElementById("submit-label").textContent = "Salvar alterações";
    cancelButton.hidden = false;
    document.getElementById("novo-projeto").scrollIntoView({ behavior: "smooth" });
    fields.title.focus({ preventScroll: true });
  }

  function removeProject(id) {
    const project = window.ProjectStore.getProjects().find((item) => item.id === id);
    if (!project || !window.confirm(`Excluir o projeto “${project.title}”? Esta ação não pode ser desfeita.`)) return;
    window.ProjectStore.deleteProject(id);
    if (fields.id.value === id) resetForm();
    render();
    showMessage("Projeto excluído com sucesso.", "success");
  }

  function render() {
    const projects = window.ProjectStore.getProjects();
    const technologies = new Set(projects.flatMap((project) => project.technologies.split(",").map((tech) => tech.trim().toLowerCase()).filter(Boolean)));
    document.getElementById("total-projects").textContent = projects.length;
    document.getElementById("published-projects").textContent = projects.length;
    document.getElementById("total-techs").textContent = technologies.size;
    document.getElementById("project-list-count").textContent = `${projects.length} ${projects.length === 1 ? "item" : "itens"}`;

    if (!projects.length) {
      list.innerHTML = `<div class="admin-empty"><span>＋</span><h3>Nenhum projeto cadastrado</h3><p>Use o formulário acima para publicar seu primeiro projeto.</p></div>`;
      return;
    }

    list.innerHTML = projects.map((project) => `
      <article class="admin-project-item">
        <div class="admin-project-thumb">${project.image ? `<img src="${escapeHTML(project.image)}" alt="">` : "<span>&lt;/&gt;</span>"}</div>
        <div class="admin-project-info"><h3>${escapeHTML(project.title)}</h3><p>${escapeHTML(project.technologies)}</p><small>Atualizado em ${new Intl.DateTimeFormat("pt-BR").format(new Date(project.updatedAt))}</small></div>
        <div class="admin-project-actions"><button type="button" data-edit="${escapeHTML(project.id)}">Editar</button><button class="danger" type="button" data-delete="${escapeHTML(project.id)}">Excluir</button></div>
      </article>`).join("");

    list.querySelectorAll("[data-edit]").forEach((button) => button.addEventListener("click", () => editProject(button.dataset.edit)));
    list.querySelectorAll("[data-delete]").forEach((button) => button.addEventListener("click", () => removeProject(button.dataset.delete)));
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validate()) {
      showMessage("Revise os campos destacados antes de continuar.", "error");
      return;
    }
    if (fields.id.value) {
      window.ProjectStore.updateProject(fields.id.value, projectData());
      showMessage("Projeto atualizado com sucesso.", "success");
    } else {
      window.ProjectStore.createProject(projectData());
      showMessage("Projeto publicado no portfólio.", "success");
    }
    resetForm();
    render();
  });

  cancelButton.addEventListener("click", resetForm);
  render();
})();
