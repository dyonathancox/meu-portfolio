const projectsData = {
            1: {
                id: 1,
                title: "Nome do Projeto Detalhado 1",
                image: "https://placehold.co/600x350/e53e3e/ffffff?text=Detalhe+Projeto+1",
                techs: ["React", "Node.js", "MongoDB", "Express"],
                description: "Este é o Projeto 1. Foi desenvolvido com o objetivo de criar uma plataforma interativa para X, utilizando as mais recentes tecnologias front-end e back-end.",
                details: "O principal desafio foi integrar Y e Z de forma eficiente, resultando em uma aplicação robusta e escalável. Foram aplicados princípios de design responsivo para garantir uma ótima experiência em todos os dispositivos.",
                liveLink: "#",
                repoLink: "#"
            },
            2: {
                id: 2,
                title: "Super Aplicativo Web 2",
                image: "https://placehold.co/600x350/c53030/ffffff?text=Detalhe+Projeto+2",
                techs: ["Vue.js", "Firebase", "Tailwind CSS", "Vite"],
                description: "O Projeto 2 é uma solução inovadora para o problema de ABC. Focado na experiência do usuário, utiliza Vue.js para uma interface dinâmica.",
                details: "Firebase foi utilizado para backend e autenticação em tempo real, proporcionando uma plataforma ágil e segura. A estilização com Tailwind CSS permitiu um desenvolvimento rápido e consistente.",
                liveLink: "#",
                repoLink: "#"
            },
             3: {
                id: 3,
                title: "Plataforma Criativa 3",
                image: "https://placehold.co/600x350/9b2c2c/ffffff?text=Detalhe+Projeto+3",
                techs: ["HTML5", "SASS", "JavaScript ES6+", "Parcel"],
                description: "Este projeto foca na criação de uma landing page altamente responsiva e otimizada para performance.",
                details: "Foram utilizadas técnicas modernas de CSS com SASS e JavaScript puro para animações e interatividade, resultando em uma página leve e visualmente atraente. O Parcel foi usado como bundler.",
                liveLink: "#",
                repoLink: "#"
            }
        };

        let currentProjectId = null;

        const modal = document.getElementById('projectModal');
        const closeModalButton = document.getElementById('closeModalButton');
        const openModalButtons = document.querySelectorAll('.open-modal-button');

        const modalTitle = document.getElementById('modalTitle');
        const modalImage = document.getElementById('modalImage');
        const modalTechsContainer = document.getElementById('modalTechs'); // Renomeado para evitar conflito
        const modalDescription = document.getElementById('modalDescription');
        const modalDetails = document.getElementById('modalDetails');
        const modalLiveLink = document.getElementById('modalLiveLink');
        const modalRepoLink = document.getElementById('modalRepoLink');

        const geminiOptimizeDescriptionButton = document.getElementById('geminiOptimizeDescription');
        const geminiSuggestNextStepsButton = document.getElementById('geminiSuggestNextSteps');
        const geminiResultArea = document.getElementById('geminiResultArea');
        const geminiOutputText = document.getElementById('geminiOutputText');

        openModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                currentProjectId = button.dataset.projectId;
                const project = projectsData[currentProjectId];

                if (project) {
                    modalTitle.textContent = project.title;
                    modalImage.src = project.image;
                    modalImage.alt = `Imagem detalhada do ${project.title}`;
                    
                    modalTechsContainer.innerHTML = ''; 
                    project.techs.forEach(tech => {
                        const techTag = document.createElement('span');
                        techTag.className = 'project-tech-tag'; // Usando a classe global
                        techTag.textContent = tech;
                        modalTechsContainer.appendChild(techTag);
                    });

                    modalDescription.textContent = project.description;
                    modalDetails.textContent = project.details;
                    modalLiveLink.href = project.liveLink;
                    modalLiveLink.style.display = project.liveLink === "#" ? "none" : "inline-flex"; // inline-flex para botões
                    modalRepoLink.href = project.repoLink;
                    modalRepoLink.style.display = project.repoLink === "#" ? "none" : "inline-flex";
                    
                    geminiResultArea.classList.add('hidden'); // Esconde resultados anteriores
                    geminiResultArea.classList.remove('visible');
                    geminiOutputText.textContent = '';

                    modal.style.display = "flex";
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        function closeProjectModal() {
            modal.style.display = "none";
            document.body.style.overflow = 'auto';
            currentProjectId = null;
        }

        closeModalButton.addEventListener('click', closeProjectModal);
        window.addEventListener('click', (event) => { if (event.target == modal) closeProjectModal(); });
        window.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modal.style.display === 'flex') closeProjectModal(); });

        const GEMINI_API_KEY = "";
        const GEMINI_API_URL_FLASH = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

        async function callGeminiAPI(prompt, buttonElement) {
            const buttonTextEl = buttonElement.querySelector('.gemini-button-text');
            const loadingSpinnerEl = buttonElement.querySelector('.loading-spinner');

            if (buttonTextEl) buttonTextEl.classList.add('hidden');
            if (loadingSpinnerEl) loadingSpinnerEl.classList.remove('hidden');
            buttonElement.disabled = true;
            geminiResultArea.classList.add('hidden');
            geminiResultArea.classList.remove('visible');
            geminiOutputText.textContent = 'A gerar sugestão...';

            try {
                let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
                const payload = { contents: chatHistory };
                
                const response = await fetch(GEMINI_API_URL_FLASH, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Erro da API Gemini:", errorData);
                    throw new Error(`Erro da API: ${response.statusText} - ${errorData?.error?.message || 'Detalhes não disponíveis'}`);
                }
                const result = await response.json();

                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    const text = result.candidates[0].content.parts[0].text;
                    geminiOutputText.textContent = text;
                    geminiResultArea.classList.remove('hidden');
                    geminiResultArea.classList.add('visible');
                } else {
                    console.error("Resposta da API Gemini inesperada:", result);
                    geminiOutputText.textContent = "Não foi possível obter uma sugestão neste momento (resposta inesperada).";
                    geminiResultArea.classList.remove('hidden');
                    geminiResultArea.classList.add('visible');
                }
            } catch (error) {
                console.error('Falha ao chamar a API Gemini:', error);
                geminiOutputText.textContent = `Erro ao contactar a IA: ${error.message}. Tente novamente mais tarde.`;
                geminiResultArea.classList.remove('hidden');
                geminiResultArea.classList.add('visible');
            } finally {
                if (buttonTextEl) buttonTextEl.classList.remove('hidden');
                if (loadingSpinnerEl) loadingSpinnerEl.classList.add('hidden');
                buttonElement.disabled = false;
            }
        }

        geminiOptimizeDescriptionButton.addEventListener('click', () => {
            if (!currentProjectId) return;
            const project = projectsData[currentProjectId];
            const prompt = `Aja como um especialista em marketing de produtos de tecnologia.
                Otimize a seguinte descrição e detalhes de um projeto de portfólio para torná-la mais impactante, profissional e orientada a resultados.
                Mantenha um tom entusiasmado, mas profissional. Destaque os benefícios e as habilidades demonstradas.
                Não invente tecnologias que não foram mencionadas.
                Formate a resposta de forma clara, talvez com um título e parágrafos.

                Título do Projeto: ${project.title}
                Tecnologias Usadas: ${project.techs.join(', ')}
                Descrição Atual: ${project.description}
                Detalhes Adicionais: ${project.details}

                Gere a descrição otimizada:`;
            callGeminiAPI(prompt, geminiOptimizeDescriptionButton);
        });

        geminiSuggestNextStepsButton.addEventListener('click', () => {
            if (!currentProjectId) return;
            const project = projectsData[currentProjectId];
            const prompt = `Aja como um gestor de produto experiente e inovador.
                Para o projeto de portfólio descrito abaixo, sugira 3 a 5 próximos passos ou funcionalidades futuras que poderiam agregar valor, demonstrar visão de futuro ou explorar novas tecnologias.
                Seja criativo e prático. Explique brevemente o porquê de cada sugestão.
                Formate a resposta como uma lista com marcadores (bullet points).

                Título do Projeto: ${project.title}
                Tecnologias Usadas: ${project.techs.join(', ')}
                Descrição Atual: ${project.description}
                Detalhes Adicionais: ${project.details}

                Sugira os próximos passos:`;
            callGeminiAPI(prompt, geminiSuggestNextStepsButton);
        });

        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu'); // Este é o UL
        const navMenuDesktop = document.getElementById('nav-menu-desktop'); // Menu desktop

        mobileMenuButton.addEventListener('click', () => {
            const isHidden = mobileMenu.style.display === 'none' || mobileMenu.style.display === '';
            mobileMenu.style.display = isHidden ? 'block' : 'none';
        });
        
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.style.display = 'none';
            });
        });
        
        document.addEventListener('click', function(event) {
            const mainHeader = document.getElementById('main-header');
            if (!mainHeader.contains(event.target) && (mobileMenu.style.display === 'block')) {
                mobileMenu.style.display = 'none';
            }
        });

        document.getElementById('currentYear').textContent = new Date().getFullYear();

        const mainHeader = document.getElementById('main-header');
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop && scrollTop > 80) {
                 mainHeader.style.top = '-100px';
            } else {
                mainHeader.style.top = '0';
            }
            // Efeito de blur no scroll já está no CSS com backdrop-filter
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
        });

        const sectionsToAnimate = document.querySelectorAll('main section[id]');
        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up-active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        sectionsToAnimate.forEach(section => {
            section.classList.add('fade-in-up-initial');
            animationObserver.observe(section);
        });