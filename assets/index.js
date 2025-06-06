// =======================================================
// ===== FONTE DE VERDADE DOS DADOS =====
// =======================================================
const projectsData = {
  1: {
    id: 1,
    title: "Projeto de E-commerce",
    image: "https://placehold.co/600x400/e53e3e/ffffff?text=E-commerce",
    techs: ["React", "Node.js", "MongoDB"],
    description:
      "Plataforma de e-commerce completa com carrinho de compras, autenticação de usuários e painel de administração.",
    details:
      "O principal desafio foi integrar o sistema de pagamentos de forma segura e otimizar a performance das consultas ao banco de dados.",
    liveLink: "#",
    repoLink: "https://github.com/dyonathancox",
  },
  2: {
    id: 2,
    title: "Aplicativo de Tarefas",
    image: "https://placehold.co/600x400/c53030/ffffff?text=App+de+Tarefas",
    techs: ["Vue.js", "Firebase", "Tailwind CSS"],
    description:
      "Um aplicativo para gerenciamento de tarefas diárias com sincronização em tempo real entre dispositivos.",
    details:
      "O uso do Firebase Realtime Database permitiu uma experiência de usuário fluida e colaborativa.",
    liveLink: "#",
    repoLink: "#",
  },
  3: {
    id: 3,
    title: "Landing Page para Startup",
    image: "https://placehold.co/600x400/9b2c2c/ffffff?text=Landing+Page",
    techs: ["HTML5", "SASS", "JavaScript"],
    description:
      "Página de captura de leads com design moderno, totalmente responsiva e otimizada para performance (Lighthouse > 95).",
    details:
      "Foco total em semântica HTML e técnicas avançadas de CSS para animações de entrada sutis e elegantes.",
    liveLink: "#",
    repoLink: "#",
  },
};

// =======================================================
// ===== FUNÇÕES PRINCIPAIS =====
// =======================================================

/**
 * Cria e insere os cards de projeto no DOM a partir do objeto projectsData.
 */
function renderProjectCards() {
  const gridContainer = document.querySelector(".grid-projetos");
  if (!gridContainer) return;

  gridContainer.innerHTML = ""; // Limpa o container antes de adicionar os novos cards

  for (const key in projectsData) {
    const project = projectsData[key];
    const techsHtml = project.techs
      .map((tech) => `<span class="project-tech-tag">${tech}</span>`)
      .join("");

    const cardHtml = `
      <div class="card-projeto">
        <div class="project-image-container">
          <img src="${project.image}" alt="Imagem do ${project.title}" class="project-image" />
        </div>
        <div class="project-content">
          <div class="project-tech-tags-container">
            ${techsHtml}
          </div>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-description">${project.description}</p>
          <div class="project-actions">
            <button class="button primary-button open-modal-button" data-project-id="${project.id}">
              Ver Detalhes
            </button>
            <div class="project-external-links">
              <a href="${project.repoLink}" target="_blank" aria-label="Ver repositório no GitHub"><i class="fab fa-github"></i></a>
              <a href="${project.liveLink}" target="_blank" aria-label="Ver projeto online"><i class="fas fa-external-link-alt"></i></a>
            </div>
          </div>
        </div>
      </div>
    `;
    gridContainer.innerHTML += cardHtml;
  }
}

/**
 * Configura toda a lógica e os event listeners para o modal de projetos.
 */
function setupModalLogic() {
  const modal = document.getElementById("projectModal");
  if (!modal) return;

  const closeModalButton = document.getElementById("closeModalButton");
  const modalTitle = document.getElementById("modalTitle");
  const modalImage = document.getElementById("modalImage");
  const modalTechsContainer = document.getElementById("modalTechs");
  const modalDescription = document.getElementById("modalDescription");
  const modalDetails = document.getElementById("modalDetails");
  const modalLiveLink = document.getElementById("modalLiveLink");
  const modalRepoLink = document.getElementById("modalRepoLink");

  function openModal(project) {
    if (!project) return;

    modalTitle.textContent = project.title;
    modalImage.src = project.image;
    modalImage.alt = `Imagem detalhada do ${project.title}`;
    modalTechsContainer.innerHTML = project.techs
      .map((tech) => `<span class="project-tech-tag">${tech}</span>`)
      .join("");
    modalDescription.textContent = project.description;
    modalDetails.textContent = project.details;
    modalLiveLink.href = project.liveLink;
    modalLiveLink.style.display =
      project.liveLink === "#" ? "none" : "inline-flex";
    modalRepoLink.href = project.repoLink;
    modalRepoLink.style.display =
      project.repoLink === "#" ? "none" : "inline-flex";

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    modal.classList.remove("is-hiding");
  }

  function closeModal() {
    modal.classList.add("is-hiding");
    setTimeout(() => {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
      modal.classList.remove("is-hiding");
    }, 300);
  }

  const openModalButtons = document.querySelectorAll(".open-modal-button");
  openModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const projectId = button.dataset.projectId;
      openModal(projectsData[projectId]);
    });
  });

  closeModalButton.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.style.display === "flex") closeModal();
  });
}

// =======================================================
// ===== EXECUÇÃO PRINCIPAL E OUTROS SCRIPTS =====
// =======================================================

document.addEventListener("DOMContentLoaded", () => {
  // 1. Cria os cards de projeto na tela
  renderProjectCards();

  // 2. Adiciona a interatividade ao modal (agora que os botões existem)
  setupModalLogic();

  // --- Lógica do Menu (mantida) ---
  const header = document.getElementById("main-header");
  if (header) {
    let lastScrollTop = 0;
    window.addEventListener("scroll", () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
        header.classList.add("header-hidden");
      } else {
        header.classList.remove("header-hidden");
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
  }

  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("#main-header .nav-link");
  if (sections.length > 0 && navLinks.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.remove("active");
              if (link.getAttribute("href") === `#${id}`) {
                link.classList.add("active");
              }
            });
          }
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach((section) => {
      observer.observe(section);
    });
  }

  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenuButton && mobileMenu) {
    const mobileMenuLinks = mobileMenu.querySelectorAll("a");
    mobileMenuButton.addEventListener("click", () => {
      mobileMenuButton.classList.toggle("open");
      mobileMenu.classList.toggle("open");
    });
    mobileMenuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenuButton.classList.remove("open");
        mobileMenu.classList.remove("open");
      });
    });
  }

  // --- Efeito 3D nas Habilidades (mantido) ---
  const skillCards = document.querySelectorAll(".habilidade-card");
  if (skillCards.length > 0) {
    skillCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform =
          "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
      });
    });
  }
});

// --- Scripts que podem rodar fora do DOMContentLoaded ---
const currentYearEl = document.getElementById("currentYear");
if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}

const sectionsToAnimate = document.querySelectorAll("main section[id]");
if (sectionsToAnimate.length > 0) {
  const animationObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-up-active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  sectionsToAnimate.forEach((section) => {
    section.classList.add("fade-in-up-initial");
    animationObserver.observe(section);
  });
}
// =======================================================
// ===== ANIMAÇÃO DE ENTRADA PARA A SEÇÃO DE FORMAÇÃO =====
// =======================================================
document.addEventListener('DOMContentLoaded', () => {

  const timelineItems = document.querySelectorAll('.formacao-item');

  if (timelineItems.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Quando o item estiver 20% visível na tela
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.2 });

    // Observa cada um dos itens da timeline
    timelineItems.forEach(item => {
      observer.observe(item);
    });
  }

});

// Adicione este bloco dentro do seu listener 'DOMContentLoaded'

// --- Lógica para o botão "Voltar ao Topo" ---
const backToTopButton = document.getElementById("backToTopButton");

if (backToTopButton) {
  window.addEventListener("scroll", () => {
    // Se o usuário rolar mais de 400px para baixo, mostra o botão
    if (window.scrollY > 400) {
      backToTopButton.classList.add("is-visible");
    } else {
      // Senão, esconde o botão
      backToTopButton.classList.remove("is-visible");
    }
  });
}