document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Tab Switching Logic ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active', 'text-cyan-400'));
            tabBtns.forEach(b => b.classList.add('text-gray-500'));
            
            tabContents.forEach(c => {
                c.classList.add('hidden');
                c.classList.remove('active');
            });

            // Add active class to clicked button
            btn.classList.add('active', 'text-cyan-400');
            btn.classList.remove('text-gray-500');

            // Show corresponding content
            const targetId = btn.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.remove('hidden');
                targetContent.classList.add('active');
            }
        });
    });

    // --- 2. Neural Network Background ---
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let particles = [];
        const numParticles = 80;
        let activations = [];

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.radius = Math.random() * 2 + 1;
                this.flashTime = 0;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
                
                if (this.flashTime > 0) this.flashTime--;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                if (this.flashTime > 0) {
                    ctx.fillStyle = `rgba(168, 85, 247, ${this.flashTime/30})`; // Purple flash for activation
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = 'rgba(168, 85, 247, 0.8)';
                } else {
                    ctx.fillStyle = 'rgba(34, 211, 238, 0.4)'; // Cyan resting state
                    ctx.shadowBlur = 0;
                }
                ctx.fill();
            }
        }

        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Draw connecting lines and trigger activations
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        
                        // Randomly trigger activation along the connection
                        if (Math.random() < 0.0005) {
                            particles[i].flashTime = 30;
                            particles[j].flashTime = 30;
                            ctx.strokeStyle = `rgba(168, 85, 247, ${0.4 - dist/300})`;
                        } else {
                            ctx.strokeStyle = `rgba(34, 211, 238, ${0.15 - dist/800})`;
                        }
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        animate();

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
    }

    // --- 3. Navbar scroll effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-lg');
            navbar.classList.replace('bg-gray-900/80', 'bg-gray-900/95');
        } else {
            navbar.classList.remove('shadow-lg');
            navbar.classList.replace('bg-gray-900/95', 'bg-gray-900/80');
        }
    });

    // --- 4. Terminal Typewriter Effect ---
    const typewriterElement = document.getElementById('typewriter-text');
    if (typewriterElement) {
        const phrases = [
            "optimizing LLM inference...",
            "building AI agents...",
            "debugging JAX models...",
            "compiling Qflow native interfaces...",
            "deploying to Borg..."
        ];
        
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function typeWriter() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typingSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentPhrase.length) {
                // Pause at the end of phrase
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500;
            }
            
            setTimeout(typeWriter, typingSpeed);
        }
        
        // Start typewriter
        setTimeout(typeWriter, 1500);
    }

    // --- 5. Email Modal Logic ---
    const emailModal = document.getElementById('email-modal');
    const emailModalContent = document.getElementById('email-modal-content');
    const openModalBtns = document.querySelectorAll('.open-email-modal');
    const closeBtns = [document.getElementById('close-modal'), document.getElementById('close-modal-btn')];
    const copyBtn = document.getElementById('copy-email');
    const emailText = document.getElementById('email-text');
    const copySuccess = document.getElementById('copy-success');

    function openModal(e) {
        if(e) e.preventDefault();
        if(!emailModal) return;
        emailModal.classList.remove('hidden');
        emailModal.classList.add('flex');
        // small delay for transition
        setTimeout(() => {
            emailModal.classList.remove('opacity-0');
            if(emailModalContent) {
                emailModalContent.classList.remove('scale-95');
                emailModalContent.classList.add('scale-100');
            }
        }, 10);
    }

    function closeModal() {
        if(!emailModal) return;
        emailModal.classList.add('opacity-0');
        if(emailModalContent) {
            emailModalContent.classList.remove('scale-100');
            emailModalContent.classList.add('scale-95');
        }
        setTimeout(() => {
            emailModal.classList.add('hidden');
            emailModal.classList.remove('flex');
            if(copySuccess) copySuccess.classList.add('opacity-0'); // reset copy text
        }, 300);
    }

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    closeBtns.forEach(btn => {
        if(btn) btn.addEventListener('click', closeModal);
    });

    // Close on outside click
    if(emailModal) {
        emailModal.addEventListener('click', (e) => {
            if (e.target === emailModal) {
                closeModal();
            }
        });
    }

    // Copy to clipboard
    if (copyBtn && emailText && copySuccess) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(emailText.textContent).then(() => {
                copySuccess.classList.remove('opacity-0');
                setTimeout(() => {
                    copySuccess.classList.add('opacity-0');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy!', err);
            });
        });
    }

    // --- 6. GSAP ScrollReveal ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const revealElements = document.querySelectorAll('.gs-reveal');
        
        revealElements.forEach((elem) => {
            gsap.fromTo(elem, 
                { autoAlpha: 0, y: 50 }, 
                {
                    duration: 1, 
                    autoAlpha: 1, 
                    y: 0, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: elem,
                        start: "top 85%", // when top of element hits 85% of viewport height
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    } else {
        // Fallback if GSAP fails to load
        document.querySelectorAll('.gs-reveal').forEach(el => el.style.visibility = 'visible');
    }
});
