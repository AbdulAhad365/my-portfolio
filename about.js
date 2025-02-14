// Counter animation
document.addEventListener('DOMContentLoaded', function() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.closest('.stat-item').dataset.count);
        let count = 0;
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps

        const updateCounter = () => {
            if (count < target) {
                count += increment;
                counter.textContent = Math.ceil(count);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };

        // Start counter when element is in view
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.disconnect();
            }
        });

        observer.observe(counter);
    });

    const title = document.querySelector('.title-3d-container');
    
    // Mouse move effect
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const x = (clientX - innerWidth / 2) / 50;
        const y = (clientY - innerHeight / 2) / 50;
        
        title.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
    });
    
    // Reset on mouse leave
    document.addEventListener('mouseleave', () => {
        title.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });

    // 3D Background Animation
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 100;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.z = Math.random() * 1000;
            this.size = Math.random() * 2 + 0.5;
            this.speed = Math.random() * 2 + 0.5;
            this.color = `rgba(79, 70, 229, ${Math.random() * 0.5 + 0.2})`;
        }
        
        move() {
            this.z -= this.speed;
            if (this.z <= 1) {
                this.z = 1000;
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
            }
        }
        
        draw() {
            const scale = 1000 / (1000 - this.z);
            const x = (this.x - canvas.width/2) * scale + canvas.width/2;
            const y = (this.y - canvas.height/2) * scale + canvas.height/2;
            const s = this.size * scale;
            
            ctx.beginPath();
            ctx.arc(x, y, s, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.move();
            particle.draw();
        });
        
        // Connect nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = (particles[i].x - particles[j].x) * (1000 / (1000 - particles[i].z));
                const dy = (particles[i].y - particles[j].y) * (1000 / (1000 - particles[i].z));
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(
                        (particles[i].x - canvas.width/2) * (1000 / (1000 - particles[i].z)) + canvas.width/2,
                        (particles[i].y - canvas.height/2) * (1000 / (1000 - particles[i].z)) + canvas.height/2
                    );
                    ctx.lineTo(
                        (particles[j].x - canvas.width/2) * (1000 / (1000 - particles[j].z)) + canvas.width/2,
                        (particles[j].y - canvas.height/2) * (1000 / (1000 - particles[j].z)) + canvas.height/2
                    );
                    ctx.strokeStyle = `rgba(79, 70, 229, ${0.1 * (1 - distance/100)})`;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();

    // Add mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.1;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.1;
        
        document.querySelector('.network-grid').style.transform = 
            `perspective(500px) rotateX(${60 + mouseY * 0.1}deg) rotateY(${mouseX * 0.1}deg)`;
    });
}); 