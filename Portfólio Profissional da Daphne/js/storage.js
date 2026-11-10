(function () {
  "use strict";

  const STORAGE_KEY = "daphnePortfolioProjects";

  function getProjects() {
    try {
      const projects = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(projects) ? projects : [];
    } catch {
      return [];
    }
  }

  function saveProjects(projects) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }

  function createProject(data) {
    const projects = getProjects();
    const project = {
      ...data,
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    projects.unshift(project);
    saveProjects(projects);
    return project;
  }

  function updateProject(id, data) {
    const projects = getProjects();
    const index = projects.findIndex((project) => project.id === id);
    if (index === -1) return null;
    projects[index] = { ...projects[index], ...data, updatedAt: new Date().toISOString() };
    saveProjects(projects);
    return projects[index];
  }

  function deleteProject(id) {
    saveProjects(getProjects().filter((project) => project.id !== id));
  }

  window.ProjectStore = { getProjects, createProject, updateProject, deleteProject };
})();
