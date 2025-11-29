// Data Storage
const Storage = {
  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Storage error:", error);
    }
  },
};

// Data Model
const AppData = {
  users: [
    {
      id: "1",
      name: "Max Mustermann",
      email: "max@example.com",
      role: "admin",
    },
    {
      id: "2",
      name: "Anna Schmidt",
      email: "anna@example.com",
      role: "member",
    },
    { id: "3", name: "Tom Weber", email: "tom@example.com", role: "member" },
  ],
  projects: [],
  tasks: [],
  notifications: [],
  activities: [],

  init() {
    this.projects = Storage.get("projects") || [
      {
        id: "1",
        name: "Website Redesign",
        description: "Komplette Überarbeitung der Unternehmenswebsite",
        color: "#3b82f6",
        createdAt: new Date("2024-01-15").toISOString(),
        members: ["1", "2", "3"],
        ownerId: "1",
      },
      {
        id: "2",
        name: "Mobile App",
        description: "Entwicklung einer neuen mobilen Anwendung",
        color: "#10b981",
        createdAt: new Date("2024-01-10").toISOString(),
        members: ["1", "2"],
        ownerId: "1",
      },
    ];

    this.tasks = Storage.get("tasks") || [
      {
        id: "1",
        title: "Design Mockups erstellen",
        description: "Erstelle erste Design-Mockups für die neue Homepage",
        status: "in-progress",
        priority: "high",
        projectId: "1",
        assigneeId: "2",
        tags: ["design", "ui"],
        dueDate: new Date("2024-02-01").toISOString(),
        createdAt: new Date("2024-01-15").toISOString(),
        estimatedHours: 8,
      },
      {
        id: "2",
        title: "API Integration",
        description: "Backend API für User-Authentifizierung integrieren",
        status: "todo",
        priority: "high",
        projectId: "2",
        assigneeId: "3",
        tags: ["backend", "api"],
        dueDate: new Date("2024-02-05").toISOString(),
        createdAt: new Date("2024-01-16").toISOString(),
        estimatedHours: 12,
      },
    ];

    this.notifications = Storage.get("notifications") || [];
    this.activities = Storage.get("activities") || [];
    this.save();
  },

  save() {
    Storage.set("projects", this.projects);
    Storage.set("tasks", this.tasks);
    Storage.set("notifications", this.notifications);
    Storage.set("activities", this.activities);
  },

  addProject(project) {
    const newProject = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    this.projects.push(newProject);
    this.save();
    return newProject;
  },

  updateProject(id, updates) {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.projects[index] = { ...this.projects[index], ...updates };
      this.save();
    }
  },

  deleteProject(id) {
    this.projects = this.projects.filter((p) => p.id !== id);
    this.tasks = this.tasks.filter((t) => t.projectId !== id);
    this.save();
  },

  addTask(task) {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      comments: [],
    };
    this.tasks.push(newTask);
    this.save();
    if (newTask.assigneeId) {
      this.addNotification({
        userId: newTask.assigneeId,
        type: "task_assigned",
        title: "Neue Aufgabe zugewiesen",
        message: `Du wurdest der Aufgabe "${newTask.title}" zugewiesen`,
      });
    }
    return newTask;
  },

  updateTask(id, updates) {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.tasks[index] = { ...this.tasks[index], ...updates };
      this.save();
    }
  },

  deleteTask(id) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
    this.save();
  },

  addNotification(notification) {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(newNotification);
    this.save();
    this.updateNotificationBadges();
  },

  markNotificationRead(id) {
    const notification = this.notifications.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
      this.save();
      this.updateNotificationBadges();
    }
  },

  markAllNotificationsRead() {
    this.notifications.forEach((n) => (n.read = true));
    this.save();
    this.updateNotificationBadges();
  },

  updateNotificationBadges() {
    const unreadCount = this.notifications.filter((n) => !n.read).length;
    const badges = document.querySelectorAll(".badge");
    badges.forEach((badge) => {
      if (unreadCount > 0) {
        badge.textContent = unreadCount > 9 ? "9+" : unreadCount;
        badge.classList.remove("hidden");
      } else {
        badge.classList.add("hidden");
      }
    });
  },
};

// Router
const Router = {
  currentPage: "dashboard",

  init() {
    window.addEventListener("hashchange", () => this.handleRoute());
    this.handleRoute();
  },

  handleRoute() {
    const hash = window.location.hash.slice(1) || "dashboard";
    this.navigate(hash);
  },

  navigate(page) {
    // Update nav
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active");
      if (item.dataset.page === page) {
        item.classList.add("active");
      }
    });

    // Update pages
    document.querySelectorAll(".page").forEach((p) => {
      p.classList.remove("active");
    });

    const targetPage = document.getElementById(`${page}-page`);
    if (targetPage) {
      targetPage.classList.add("active");
      this.currentPage = page;
      this.loadPage(page);
    }
  },

  loadPage(page) {
    switch (page) {
      case "dashboard":
        Dashboard.render();
        break;
      case "projects":
        Projects.render();
        break;
      case "kanban":
        Kanban.render();
        break;
      case "list":
        List.render();
        break;
      case "calendar":
        Calendar.render();
        break;
      case "tasks":
        Tasks.render();
        break;
      case "notifications":
        Notifications.render();
        break;
      case "settings":
        Settings.render();
        break;
    }
  },
};

// Theme Manager
const Theme = {
  init() {
    const saved = localStorage.getItem("theme") || "light";
    document.body.classList.toggle("dark", saved === "dark");
    document
      .getElementById("theme-toggle")
      .addEventListener("click", () => this.toggle());
  },

  toggle() {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  },
};

// Dashboard
const Dashboard = {
  render() {
    const stats = this.getStats();
    this.renderStats(stats);
    this.renderRecentTasks();
    this.renderActivities();
    this.renderProjects();
  },

  getStats() {
    return {
      projects: AppData.projects.length,
      tasks: AppData.tasks.length,
      completed: AppData.tasks.filter((t) => t.status === "done").length,
      inProgress: AppData.tasks.filter((t) => t.status === "in-progress")
        .length,
      overdue: AppData.tasks.filter((t) => {
        if (!t.dueDate || t.status === "done") return false;
        return new Date(t.dueDate) < new Date();
      }).length,
    };
  },

  renderStats(stats) {
    const container = document.getElementById("dashboard-stats");
    container.innerHTML = `
      <div class="stat-card">
        <div class="stat-info">
          <p>Projekte</p>
          <p>${stats.projects}</p>
        </div>
        <div class="stat-icon" style="background: rgba(2, 132, 199, 0.1);">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--primary);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <p>Aufgaben</p>
          <p>${stats.tasks}</p>
        </div>
        <div class="stat-icon" style="background: rgba(16, 185, 129, 0.1);">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--success);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <p>In Bearbeitung</p>
          <p>${stats.inProgress}</p>
        </div>
        <div class="stat-icon" style="background: rgba(2, 132, 199, 0.1);">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--primary);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <p>Überfällig</p>
          <p style="color: var(--danger);">${stats.overdue}</p>
        </div>
        <div class="stat-icon" style="background: rgba(239, 68, 68, 0.1);">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--danger);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
      </div>
    `;
  },

  renderRecentTasks() {
    const container = document.getElementById("recent-tasks");
    const tasks = AppData.tasks
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    if (tasks.length === 0) {
      container.innerHTML =
        '<p class="text-center" style="color: var(--gray); padding: 2rem;">Keine Aufgaben vorhanden</p>';
      return;
    }

    container.innerHTML = tasks
      .map((task) => {
        const project = AppData.projects.find((p) => p.id === task.projectId);
        return `
        <div class="task-item" style="padding: 0.75rem; margin-bottom: 0.5rem; border: 1px solid var(--border); border-radius: 0.5rem;">
          <div style="display: flex; align-items: start; gap: 0.75rem;">
            <div style="width: 0.5rem; height: 0.5rem; border-radius: 50%; background: ${this.getStatusColor(
              task.status
            )}; margin-top: 0.5rem;"></div>
            <div style="flex: 1;">
              <p style="font-weight: 500; margin-bottom: 0.25rem;">${
                task.title
              }</p>
              ${
                project
                  ? `<span style="font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 0.25rem; background: ${project.color}20; color: ${project.color};">${project.name}</span>`
                  : ""
              }
            </div>
          </div>
        </div>
      `;
      })
      .join("");
  },

  renderActivities() {
    const container = document.getElementById("recent-activities");
    const activities = AppData.activities
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    if (activities.length === 0) {
      container.innerHTML =
        '<p class="text-center" style="color: var(--gray); padding: 2rem;">Keine Aktivitäten vorhanden</p>';
      return;
    }

    container.innerHTML = activities
      .map((activity) => {
        const date = new Date(activity.createdAt).toLocaleDateString("de-DE");
        return `
        <div style="padding: 0.75rem; border-bottom: 1px solid var(--border);">
          <p style="font-size: 0.875rem;">${activity.description}</p>
          <p style="font-size: 0.75rem; color: var(--gray); margin-top: 0.25rem;">${date}</p>
        </div>
      `;
      })
      .join("");
  },

  renderProjects() {
    const container = document.getElementById("projects-overview");
    container.innerHTML = AppData.projects
      .map((project) => {
        const projectTasks = AppData.tasks.filter(
          (t) => t.projectId === project.id
        );
        const completed = projectTasks.filter(
          (t) => t.status === "done"
        ).length;
        const progress =
          projectTasks.length > 0
            ? Math.round((completed / projectTasks.length) * 100)
            : 0;

        return `
        <div class="project-card" onclick="Router.navigate('kanban')">
          <div class="project-name">
            <div class="project-dot" style="background: ${
              project.color
            };"></div>
            <h3 style="font-weight: 600;">${project.name}</h3>
          </div>
          ${
            project.description
              ? `<p style="font-size: 0.875rem; color: var(--gray); margin: 0.5rem 0;">${project.description}</p>`
              : ""
          }
          <div style="margin-top: 1rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 0.5rem;">
              <span style="color: var(--gray);">Fortschritt</span>
              <span style="font-weight: 500;">${progress}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress}%; background: ${
          project.color
        };"></div>
            </div>
            <p style="font-size: 0.75rem; color: var(--gray); margin-top: 0.5rem;">${completed} von ${
          projectTasks.length
        } Aufgaben</p>
          </div>
        </div>
      `;
      })
      .join("");
  },

  getStatusColor(status) {
    const colors = {
      todo: "var(--gray)",
      "in-progress": "var(--primary)",
      review: "var(--warning)",
      done: "var(--success)",
    };
    return colors[status] || colors.todo;
  },
};

// Projects
const Projects = {
  render() {
    const container = document.getElementById("projects-container");
    container.innerHTML = AppData.projects
      .map((project) => {
        const projectTasks = AppData.tasks.filter(
          (t) => t.projectId === project.id
        );
        const completed = projectTasks.filter(
          (t) => t.status === "done"
        ).length;
        const progress =
          projectTasks.length > 0
            ? Math.round((completed / projectTasks.length) * 100)
            : 0;

        return `
        <div class="project-card">
          <div class="project-header">
            <div class="project-name">
              <div class="project-dot" style="background: ${
                project.color
              };"></div>
              <div>
                <h3 style="font-weight: 600;">${project.name}</h3>
                ${
                  project.description
                    ? `<p style="font-size: 0.875rem; color: var(--gray); margin-top: 0.25rem;">${project.description}</p>`
                    : ""
                }
              </div>
            </div>
            <button onclick="Projects.deleteProject('${
              project.id
            }')" style="background: none; border: none; color: var(--danger); cursor: pointer; padding: 0.5rem;">✕</button>
          </div>
          <div style="margin-top: 1rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 0.5rem;">
              <span style="color: var(--gray);">Fortschritt</span>
              <span style="font-weight: 500;">${progress}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress}%; background: ${
          project.color
        };"></div>
            </div>
            <p style="font-size: 0.75rem; color: var(--gray); margin-top: 0.5rem;">${completed} von ${
          projectTasks.length
        } Aufgaben</p>
          </div>
          <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;" onclick="Router.navigate('kanban')">Projekt öffnen</button>
        </div>
      `;
      })
      .join("");
  },

  deleteProject(id) {
    if (confirm("Projekt wirklich löschen?")) {
      AppData.deleteProject(id);
      this.render();
      Dashboard.render();
    }
  },

  initModal() {
    document.getElementById("new-project-btn").addEventListener("click", () => {
      document.getElementById("project-modal").classList.remove("hidden");
      document.getElementById("modal-overlay").classList.remove("hidden");
      document.getElementById("project-form").reset();
      document.getElementById("project-id").value = "";
      this.renderColorPicker();
    });

    document
      .getElementById("close-project-modal")
      .addEventListener("click", () => {
        document.getElementById("project-modal").classList.add("hidden");
        document.getElementById("modal-overlay").classList.add("hidden");
      });

    document.getElementById("cancel-project").addEventListener("click", () => {
      document.getElementById("project-modal").classList.add("hidden");
      document.getElementById("modal-overlay").classList.add("hidden");
    });

    document.getElementById("project-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const project = {
        name: document.getElementById("project-name").value,
        description: document.getElementById("project-description").value,
        color:
          document.querySelector(".color-option.selected")?.style
            .backgroundColor || "#3b82f6",
        members: [],
        ownerId: "1",
      };
      AppData.addProject(project);
      this.render();
      Dashboard.render();
      document.getElementById("project-modal").classList.add("hidden");
      document.getElementById("modal-overlay").classList.add("hidden");
    });
  },

  renderColorPicker() {
    const colors = [
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
      "#84cc16",
      "#f97316",
      "#6366f1",
    ];
    const container = document.getElementById("color-picker");
    container.innerHTML = colors
      .map(
        (color) => `
      <div class="color-option" style="background: ${color};" onclick="this.parentElement.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected')); this.classList.add('selected');"></div>
    `
      )
      .join("");
    container.querySelector(".color-option").classList.add("selected");
  },
};

// Kanban
const Kanban = {
  render() {
    const container = document.getElementById("kanban-board");
    const columns = [
      { id: "todo", title: "Zu erledigen" },
      { id: "in-progress", title: "In Bearbeitung" },
      { id: "review", title: "Review" },
      { id: "done", title: "Erledigt" },
    ];

    container.innerHTML = columns
      .map((column) => {
        const tasks = AppData.tasks.filter((t) => t.status === column.id);
        return `
        <div class="kanban-column">
          <div class="column-header">
            <h3 class="column-title">${column.title}</h3>
            <span class="column-count">${tasks.length}</span>
          </div>
          ${tasks.map((task) => this.renderTask(task)).join("")}
          <button class="btn btn-secondary" style="width: 100%; margin-top: 0.5rem;" onclick="TaskModal.open(null, '${
            column.id
          }')">+ Aufgabe hinzufügen</button>
        </div>
      `;
      })
      .join("");

    this.initDragDrop();
  },

  renderTask(task) {
    const project = AppData.projects.find((p) => p.id === task.projectId);
    const assignee = AppData.users.find((u) => u.id === task.assigneeId);
    const dueDate = task.dueDate
      ? new Date(task.dueDate).toLocaleDateString("de-DE")
      : "";

    return `
      <div class="task-card" draggable="true" data-task-id="${
        task.id
      }" onclick="TaskModal.open('${task.id}')">
        <div class="task-header">
          <span class="task-title">${task.title}</span>
          <div class="priority-dot priority-${task.priority}"></div>
        </div>
        ${
          task.description
            ? `<p style="font-size: 0.875rem; color: var(--gray); margin: 0.5rem 0;">${task.description}</p>`
            : ""
        }
        ${
          project
            ? `<span style="font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 0.25rem; background: ${project.color}20; color: ${project.color}; display: inline-block; margin: 0.25rem 0.25rem 0.25rem 0;">${project.name}</span>`
            : ""
        }
        ${task.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        <div class="task-meta">
          ${assignee ? `<span>👤 ${assignee.name}</span>` : ""}
          ${dueDate ? `<span>📅 ${dueDate}</span>` : ""}
        </div>
      </div>
    `;
  },

  initDragDrop() {
    const tasks = document.querySelectorAll(".task-card");
    tasks.forEach((task) => {
      task.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", task.dataset.taskId);
      });
    });

    const columns = document.querySelectorAll(".kanban-column");
    columns.forEach((column) => {
      column.addEventListener("dragover", (e) => {
        e.preventDefault();
        column.style.background = "var(--card)";
      });

      column.addEventListener("dragleave", () => {
        column.style.background = "var(--bg)";
      });

      column.addEventListener("drop", (e) => {
        e.preventDefault();
        column.style.background = "var(--bg)";
        const taskId = e.dataTransfer.getData("text/plain");
        const status = column.querySelector(
          ".column-header .column-title"
        ).textContent;
        const statusMap = {
          "Zu erledigen": "todo",
          "In Bearbeitung": "in-progress",
          Review: "review",
          Erledigt: "done",
        };
        AppData.updateTask(taskId, { status: statusMap[status] });
        this.render();
        Dashboard.render();
      });
    });
  },
};

// List View
const List = {
  render() {
    const container = document.getElementById("list-container");
    const search = document.getElementById("list-search").value.toLowerCase();
    const statusFilter = document.getElementById("status-filter").value;
    const priorityFilter = document.getElementById("priority-filter").value;

    let tasks = AppData.tasks;

    if (search) {
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          (t.description && t.description.toLowerCase().includes(search))
      );
    }

    if (statusFilter !== "all") {
      tasks = tasks.filter((t) => t.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      tasks = tasks.filter((t) => t.priority === priorityFilter);
    }

    if (tasks.length === 0) {
      container.innerHTML =
        '<p class="text-center" style="padding: 3rem; color: var(--gray);">Keine Aufgaben gefunden</p>';
      return;
    }

    container.innerHTML = `
      <table class="list-table">
        <thead>
          <tr>
            <th>Aufgabe</th>
            <th>Projekt</th>
            <th>Status</th>
            <th>Priorität</th>
            <th>Zugewiesen</th>
            <th>Fälligkeitsdatum</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          ${tasks
            .map((task) => {
              const project = AppData.projects.find(
                (p) => p.id === task.projectId
              );
              const assignee = AppData.users.find(
                (u) => u.id === task.assigneeId
              );
              return `
              <tr>
                <td>
                  <div>
                    <p style="font-weight: 500;">${task.title}</p>
                    ${
                      task.description
                        ? `<p style="font-size: 0.875rem; color: var(--gray);">${task.description}</p>`
                        : ""
                    }
                  </div>
                </td>
                <td>${
                  project
                    ? `<span style="padding: 0.25rem 0.5rem; border-radius: 0.25rem; background: ${project.color}20; color: ${project.color}; font-size: 0.875rem;">${project.name}</span>`
                    : "-"
                }</td>
                <td><span class="status-badge status-${
                  task.status
                }">${this.getStatusLabel(task.status)}</span></td>
                <td>${task.priority}</td>
                <td>${assignee ? assignee.name : "-"}</td>
                <td>${
                  task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString("de-DE")
                    : "-"
                }</td>
                <td>
                  <button onclick="TaskModal.open('${
                    task.id
                  }')" style="background: none; border: none; color: var(--primary); cursor: pointer; margin-right: 0.5rem;">✏️</button>
                  <button onclick="List.deleteTask('${
                    task.id
                  }')" style="background: none; border: none; color: var(--danger); cursor: pointer;">🗑️</button>
                </td>
              </tr>
            `;
            })
            .join("")}
        </tbody>
      </table>
    `;
  },

  deleteTask(id) {
    if (confirm("Aufgabe wirklich löschen?")) {
      AppData.deleteTask(id);
      this.render();
      Dashboard.render();
    }
  },

  getStatusLabel(status) {
    const labels = {
      todo: "Zu erledigen",
      "in-progress": "In Bearbeitung",
      review: "Review",
      done: "Erledigt",
    };
    return labels[status] || status;
  },

  init() {
    document
      .getElementById("list-search")
      .addEventListener("input", () => this.render());
    document
      .getElementById("status-filter")
      .addEventListener("change", () => this.render());
    document
      .getElementById("priority-filter")
      .addEventListener("change", () => this.render());
    document
      .getElementById("new-task-list-btn")
      .addEventListener("click", () => TaskModal.open());
  },
};

// Calendar
const Calendar = {
  currentDate: new Date(),

  render() {
    const container = document.getElementById("calendar-container");
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    let html = `
      <div class="calendar-header">
        <button onclick="Calendar.prevMonth()" class="btn btn-secondary">←</button>
        <h2 style="font-weight: 600;">${this.currentDate.toLocaleDateString(
          "de-DE",
          { month: "long", year: "numeric" }
        )}</h2>
        <button onclick="Calendar.nextMonth()" class="btn btn-secondary">→</button>
      </div>
      <div class="calendar-grid">
        ${["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]
          .map((day) => `<div class="calendar-day-header">${day}</div>`)
          .join("")}
    `;

    // Empty cells for days before month starts
    for (
      let i = 0;
      i < (startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1);
      i++
    ) {
      html += '<div class="calendar-day"></div>';
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const tasks = AppData.tasks.filter((t) => {
        if (!t.dueDate) return false;
        const taskDate = new Date(t.dueDate);
        return taskDate.toDateString() === date.toDateString();
      });
      const isToday = date.toDateString() === new Date().toDateString();

      html += `
        <div class="calendar-day ${
          isToday ? "today" : ""
        }" onclick="Calendar.showDayTasks('${date.toISOString()}')">
          <div class="calendar-day-number">${day}</div>
          ${
            tasks.length > 0
              ? `<div class="calendar-tasks">${tasks.length} Aufgaben</div>`
              : ""
          }
        </div>
      `;
    }

    html += "</div>";
    container.innerHTML = html;
  },

  prevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.render();
  },

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.render();
  },

  showDayTasks(date) {
    const tasks = AppData.tasks.filter((t) => {
      if (!t.dueDate) return false;
      return (
        new Date(t.dueDate).toDateString() === new Date(date).toDateString()
      );
    });
    alert(
      `${tasks.length} Aufgaben für ${new Date(date).toLocaleDateString(
        "de-DE"
      )}`
    );
  },
};

// Tasks
const Tasks = {
  render() {
    const container = document.getElementById("tasks-container");
    const tasks = AppData.tasks;

    if (tasks.length === 0) {
      container.innerHTML =
        '<p class="text-center" style="padding: 3rem; color: var(--gray);">Keine Aufgaben vorhanden</p>';
      return;
    }

    container.innerHTML = tasks
      .map((task) => {
        const project = AppData.projects.find((p) => p.id === task.projectId);
        const assignee = AppData.users.find((u) => u.id === task.assigneeId);
        return `
        <div class="task-item">
          <div style="display: flex; align-items: start; justify-content: space-between;">
            <div style="flex: 1;">
              <h3 style="font-weight: 600; margin-bottom: 0.5rem;">${
                task.title
              }</h3>
              ${
                task.description
                  ? `<p style="color: var(--gray); margin-bottom: 0.75rem;">${task.description}</p>`
                  : ""
              }
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                ${
                  project
                    ? `<span style="padding: 0.25rem 0.5rem; border-radius: 0.25rem; background: ${project.color}20; color: ${project.color}; font-size: 0.875rem;">${project.name}</span>`
                    : ""
                }
                <span class="status-badge status-${
                  task.status
                }">${List.getStatusLabel(task.status)}</span>
                ${
                  assignee
                    ? `<span style="font-size: 0.875rem; color: var(--gray);">👤 ${assignee.name}</span>`
                    : ""
                }
                ${
                  task.dueDate
                    ? `<span style="font-size: 0.875rem; color: var(--gray);">📅 ${new Date(
                        task.dueDate
                      ).toLocaleDateString("de-DE")}</span>`
                    : ""
                }
              </div>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button onclick="TaskModal.open('${
                task.id
              }')" class="btn btn-secondary">Bearbeiten</button>
              <button onclick="Tasks.deleteTask('${
                task.id
              }')" class="btn btn-secondary" style="color: var(--danger);">Löschen</button>
            </div>
          </div>
        </div>
      `;
      })
      .join("");
  },

  deleteTask(id) {
    if (confirm("Aufgabe wirklich löschen?")) {
      AppData.deleteTask(id);
      this.render();
      Dashboard.render();
    }
  },
};

// Notifications
const Notifications = {
  render() {
    const container = document.getElementById("notifications-container");
    const notifications = AppData.notifications;
    const unreadCount = notifications.filter((n) => !n.read).length;

    document.getElementById("notifications-subtitle").textContent =
      unreadCount > 0
        ? `${unreadCount} ungelesene Benachrichtigung${
            unreadCount !== 1 ? "en" : ""
          }`
        : "Alle Benachrichtigungen gelesen";

    if (notifications.length === 0) {
      container.innerHTML =
        '<p class="text-center" style="padding: 3rem; color: var(--gray);">Keine Benachrichtigungen vorhanden</p>';
      return;
    }

    container.innerHTML = notifications
      .map(
        (notification) => `
      <div class="notification-item ${
        notification.read ? "" : "unread"
      }" onclick="Notifications.markRead('${notification.id}')">
        <div class="notification-icon" style="background: rgba(2, 132, 199, 0.1);">🔔</div>
        <div style="flex: 1;">
          <h3 style="font-weight: 600; margin-bottom: 0.25rem;">${
            notification.title
          }</h3>
          <p style="color: var(--gray); margin-bottom: 0.5rem;">${
            notification.message
          }</p>
          <p style="font-size: 0.75rem; color: var(--gray);">${new Date(
            notification.createdAt
          ).toLocaleDateString("de-DE")}</p>
        </div>
      </div>
    `
      )
      .join("");
  },

  markRead(id) {
    AppData.markNotificationRead(id);
    this.render();
  },

  init() {
    document
      .getElementById("mark-all-read-btn")
      .addEventListener("click", () => {
        AppData.markAllNotificationsRead();
        this.render();
      });
  },
};

// Settings
const Settings = {
  render() {
    const container = document.getElementById("settings-container");
    container.innerHTML = `
      <div class="setting-group">
        <h2 class="card-title">Erscheinungsbild</h2>
        <div class="setting-item">
          <div>
            <h3 style="font-weight: 500;">Dark Mode</h3>
            <p style="font-size: 0.875rem; color: var(--gray);">Zwischen hellem und dunklem Design wechseln</p>
          </div>
          <div class="toggle ${
            document.body.classList.contains("dark") ? "active" : ""
          }" onclick="Theme.toggle(); this.classList.toggle('active');">
            <div class="toggle-slider"></div>
          </div>
        </div>
      </div>
      <div class="setting-group">
        <h2 class="card-title">Daten exportieren</h2>
        <button class="btn btn-primary" onclick="Settings.exportData()">Daten als JSON exportieren</button>
      </div>
      <div class="setting-group">
        <h2 class="card-title">Statistiken</h2>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
          <div style="text-align: center; padding: 1rem; background: var(--bg); border-radius: 0.5rem;">
            <p style="font-size: 1.5rem; font-weight: bold;">${
              AppData.projects.length
            }</p>
            <p style="font-size: 0.875rem; color: var(--gray);">Projekte</p>
          </div>
          <div style="text-align: center; padding: 1rem; background: var(--bg); border-radius: 0.5rem;">
            <p style="font-size: 1.5rem; font-weight: bold;">${
              AppData.tasks.length
            }</p>
            <p style="font-size: 0.875rem; color: var(--gray);">Aufgaben</p>
          </div>
        </div>
      </div>
    `;
  },

  exportData() {
    const data = {
      projects: AppData.projects,
      tasks: AppData.tasks,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `task-manager-export-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);
  },
};

// Task Modal
const TaskModal = {
  open(taskId = null, defaultStatus = null) {
    const modal = document.getElementById("task-modal");
    const overlay = document.getElementById("modal-overlay");
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");

    const form = document.getElementById("task-form");
    form.reset();

    // Populate project select
    const projectSelect = document.getElementById("task-project");
    projectSelect.innerHTML = AppData.projects
      .map((p) => `<option value="${p.id}">${p.name}</option>`)
      .join("");

    // Populate assignee select
    const assigneeSelect = document.getElementById("task-assignee");
    assigneeSelect.innerHTML =
      '<option value="">Nicht zugewiesen</option>' +
      AppData.users
        .map((u) => `<option value="${u.id}">${u.name}</option>`)
        .join("");

    if (taskId) {
      const task = AppData.tasks.find((t) => t.id === taskId);
      if (task) {
        document.getElementById("task-id").value = task.id;
        document.getElementById("task-title").value = task.title;
        document.getElementById("task-description").value =
          task.description || "";
        document.getElementById("task-status").value = task.status;
        document.getElementById("task-priority").value = task.priority;
        document.getElementById("task-project").value = task.projectId;
        document.getElementById("task-assignee").value = task.assigneeId || "";
        document.getElementById("task-due-date").value = task.dueDate
          ? task.dueDate.split("T")[0]
          : "";
        document.getElementById("task-hours").value = task.estimatedHours || "";
        this.renderTags(task.tags || []);
        document.getElementById("modal-title").textContent =
          "Aufgabe bearbeiten";
      }
    } else {
      document.getElementById("task-id").value = "";
      if (defaultStatus) {
        document.getElementById("task-status").value = defaultStatus;
      }
      document.getElementById("modal-title").textContent = "Neue Aufgabe";
      this.renderTags([]);
    }
  },

  close() {
    document.getElementById("task-modal").classList.add("hidden");
    document.getElementById("modal-overlay").classList.add("hidden");
  },

  renderTags(tags) {
    const container = document.getElementById("task-tags");
    container.innerHTML = tags
      .map(
        (tag) => `
      <span class="tag-item">
        ${tag}
        <button type="button" class="tag-remove" onclick="TaskModal.removeTag('${tag}')">×</button>
      </span>
    `
      )
      .join("");
  },

  removeTag(tag) {
    const tags = Array.from(document.querySelectorAll(".tag-item"))
      .map((el) => el.textContent.replace("×", "").trim())
      .filter((t) => t !== tag);
    this.renderTags(tags);
  },

  init() {
    document
      .getElementById("close-modal")
      .addEventListener("click", () => this.close());
    document
      .getElementById("cancel-task")
      .addEventListener("click", () => this.close());
    document.getElementById("modal-overlay").addEventListener("click", (e) => {
      if (e.target.id === "modal-overlay") this.close();
    });

    document.getElementById("new-tag").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const tag = e.target.value.trim();
        if (tag) {
          const currentTags = Array.from(
            document.querySelectorAll(".tag-item")
          ).map((el) => el.textContent.replace("×", "").trim());
          if (!currentTags.includes(tag)) {
            this.renderTags([...currentTags, tag]);
            e.target.value = "";
          }
        }
      }
    });

    document.getElementById("task-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const taskId = document.getElementById("task-id").value;
      const tags = Array.from(document.querySelectorAll(".tag-item")).map(
        (el) => el.textContent.replace("×", "").trim()
      );

      const task = {
        title: document.getElementById("task-title").value,
        description: document.getElementById("task-description").value,
        status: document.getElementById("task-status").value,
        priority: document.getElementById("task-priority").value,
        projectId: document.getElementById("task-project").value,
        assigneeId: document.getElementById("task-assignee").value || null,
        dueDate: document.getElementById("task-due-date").value || null,
        estimatedHours: document.getElementById("task-hours").value
          ? parseFloat(document.getElementById("task-hours").value)
          : null,
        tags,
      };

      if (taskId) {
        AppData.updateTask(taskId, task);
      } else {
        AppData.addTask(task);
      }

      this.close();
      Router.loadPage(Router.currentPage);
      Dashboard.render();
    });
  },
};

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  AppData.init();
  Theme.init();
  Router.init();
  Projects.initModal();
  TaskModal.init();
  List.init();
  Notifications.init();

  // New task buttons
  document
    .getElementById("new-task-btn")
    ?.addEventListener("click", () => TaskModal.open());
  document
    .getElementById("new-task-list-btn")
    ?.addEventListener("click", () => TaskModal.open());
  document
    .getElementById("new-task-calendar-btn")
    ?.addEventListener("click", () => TaskModal.open());
  document
    .getElementById("new-task-tasks-btn")
    ?.addEventListener("click", () => TaskModal.open());

  // Render projects in sidebar
  const projectsList = document.getElementById("projects-list");
  if (AppData.projects.length > 0) {
    projectsList.innerHTML =
      '<h3 style="font-size: 0.75rem; font-weight: 600; color: var(--gray); text-transform: uppercase; padding: 0 1rem 0.5rem;">Projekte</h3>' +
      AppData.projects
        .map(
          (p) => `
        <a href="#kanban" class="project-nav-item" onclick="Router.navigate('kanban')">
          <div class="project-dot" style="background: ${p.color};"></div>
          <span>${p.name}</span>
        </a>
      `
        )
        .join("");
  }

  AppData.updateNotificationBadges();
});
