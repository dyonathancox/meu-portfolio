const projectsData = {
  1: {
    id: 1,
    title: 'Nome do Projeto Detalhado 1',
    image: 'https://placehold.co/600x350/e53e3e/ffffff?text=Detalhe+Projeto+1',
    techs: ['React', 'Node.js', 'MongoDB', 'Express'],
    description: 'Este é o Projeto 1...',
    details: 'O principal desafio foi integrar Y e Z...',
    liveLink: '#',
    repoLink: '#',
  },
  2: {
    id: 2,
    title: 'Super Aplicativo Web 2',
    image: 'https://placehold.co/600x350/c53030/ffffff?text=Detalhe+Projeto+2',
    techs: ['Vue.js', 'Firebase', 'Tailwind CSS', 'Vite'],
    description: 'O Projeto 2 é uma solução inovadora...',
    details: 'Firebase foi utilizado para backend...',
    liveLink: '#',
    repoLink: '#',
  },
  3: {
    id: 3,
    title: 'Plataforma Criativa 3',
    image: 'https://placehold.co/600x350/9b2c2c/ffffff?text=Detalhe+Projeto+3',
    techs: ['HTML5', 'SASS', 'JavaScript ES6+', 'Parcel'],
    description: 'Este projeto foca na criação de uma landing page...',
    details: 'Foram utilizadas técnicas modernas de CSS...',
    liveLink: '#',
    repoLink: '#',
  },
};

let currentProjectId = null;

const modal = document.getElementById('projectModal');
const closeModalButton = document.getElementById('closeModalButton');
const openModalButtons = document.querySelectorAll('.open-modal-button');

const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImage');
const modalTechsContainer = document.getElementById('modalTechs');
const modalDescription = document.getElementById('modalDescription');
const modalDetails = document.getElementById('modalDetails');
const modalLiveLink = document.getElementById('modalLiveLink');
const modalRepoLink = document.getElementById('modalRepoLink');

openModalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentProjectId = button.dataset.projectId;
    const project = projectsData[currentProjectId];

    if (project) {
      modalTitle.textContent = project.title;
      modalImage.src = project.image;
      modalImage.alt = `Imagem detalhada do ${project.title}`;

      modalTechsContainer.innerHTML = '';
      project.techs.forEach((tech) => {
        const techTag = document.createElement('span');
        techTag.className = 'project-tech-tag';
        techTag.textContent = tech;
        modalTechsContainer.appendChild(techTag);
      });

      modalDescription.textContent = project.description;
      modalDetails.textContent = project.details;
      modalLiveLink.href = project.liveLink;
      modalLiveLink.style.display =
        project.liveLink === '#' ? 'none' : 'inline-flex';
      modalRepoLink.href = project.repoLink;
      modalRepoLink.style.display =
        project.repoLink === '#' ? 'none' : 'inline-flex';

      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  });
});

function closeProjectModal() {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
  currentProjectId = null;
}

closeModalButton.addEventListener('click', closeProjectModal);
window.addEventListener('click', (event) => {
  if (event.target == modal) closeProjectModal();
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.style.display === 'flex')
    closeProjectModal();
});

const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const navMenuDesktop = document.getElementById('nav-menu-desktop');

mobileMenuButton.addEventListener('click', () => {
  const isHidden =
    mobileMenu.style.display === 'none' || mobileMenu.style.display === '';
  mobileMenu.style.display = isHidden ? 'block' : 'none';
});

mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.style.display = 'none';
  });
});

document.addEventListener('click', function (event) {
  const mainHeader = document.getElementById('main-header');
  if (
    !mainHeader.contains(event.target) &&
    mobileMenu.style.display === 'block'
  ) {
    mobileMenu.style.display = 'none';
  }
});

document.getElementById('currentYear').textContent = new Date().getFullYear();

const mainHeader = document.getElementById('main-header');
let lastScrollTop = 0;
window.addEventListener('scroll', function () {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > lastScrollTop && scrollTop > 80) {
    mainHeader.style.top = '-100px';
  } else {
    mainHeader.style.top = '0';
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

const sectionsToAnimate = document.querySelectorAll('main section[id]');
const animationObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up-active');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);
sectionsToAnimate.forEach((section) => {
  section.classList.add('fade-in-up-initial');
  animationObserver.observe(section);
});
