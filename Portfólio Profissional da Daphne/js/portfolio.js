(function () {
  "use strict";

  function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
    })[character]);
  }

  function safeURL(value) {
    if (!value) return "";
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  }

  function projectCard(project, index) {
    const image = safeURL(project.image);
    const projectLink = safeURL(project.link);
    const githubLink = safeURL(project.github);
    const techs = String(project.technologies || "").split(",").map((tech) => tech.trim()).filter(Boolean);
    return `
      <article class="project-card reveal is-visible">
        <div class="project-cover ${image ? "has-image" : ""}">
          ${image ? `<img src="${escapeHTML(image)}" alt="Capa do projeto ${escapeHTML(project.title)}" loading="lazy">` : `<div class="default-cover"><span>DP / ${String(index + 1).padStart(2, "0")}</span><strong>&lt;/&gt;</strong><i></i></div>`}
          <span class="project-number">${String(index + 1).padStart(2, "0")}</span>
        </div>
        <div class="project-body">
          <div class="project-techs">${techs.map((tech) => `<span>${escapeHTML(tech)}</span>`).join("")}</div>
          <h3>${escapeHTML(project.title)}</h3>
          <p>${escapeHTML(project.description)}</p>
          <div class="project-actions">
            ${projectLink ? `<a class="text-link" href="${escapeHTML(projectLink)}" target="_blank" rel="noopener noreferrer">Visualizar projeto <span>↗</span></a>` : `<span class="muted-link">Projeto sem link público</span>`}
            ${githubLink ? `<a class="icon-link" href="${escapeHTML(githubLink)}" target="_blank" rel="noopener noreferrer" aria-label="Ver código de ${escapeHTML(project.title)} no GitHub">GitHub ↗</a>` : ""}
          </div>
        </div>
      </article>`;
  }

  function emptyState() {
    return `<div class="empty-state"><div class="empty-visual"><span>&lt;/&gt;</span><i></i><i></i></div><p class="kicker">Em construção</p><h3>Novos projetos serão publicados em breve.</h3><p>Este portfólio acompanha uma trajetória real de aprendizado. Assim que novos trabalhos forem concluídos, eles aparecerão aqui.</p><a class="button button-secondary" href="quemsoueu.html">Conheça minha trajetória</a></div>`;
  }

  const projects = window.ProjectStore?.getProjects() || [];
  const portfolioGrid = document.getElementById("portfolio-projects-grid");
  const featuredGrid = document.getElementById("featured-projects-grid");
  const count = document.getElementById("project-count");

  if (count) count.textContent = projects.length;
  if (portfolioGrid) portfolioGrid.innerHTML = projects.length ? projects.map(projectCard).join("") : emptyState();
  if (featuredGrid) featuredGrid.innerHTML = projects.length ? projects.slice(0, 3).map(projectCard).join("") : emptyState();
})();
