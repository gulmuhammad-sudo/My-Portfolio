// DOM Elements
const hamburger = document.getElementById('hamburger');
const navList = document.getElementById('nav-list');
const terminalContent = document.getElementById('terminal-content');
const contactForm = document.getElementById('contact-form');
const currentYear = document.getElementById('current-year');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const cyberCanvas = document.getElementById('cyberCanvas');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set current year
    currentYear.textContent = new Date().getFullYear();
    
    // Initialize canvas animation
    initCanvas();
    
    // Add click event to terminal for copy functionality
    terminalContent.addEventListener('click', copyTerminalContent);
    
    // Setup form submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Setup keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Close mobile menu when link is clicked
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Add active class to current section in navigation
    window.addEventListener('scroll', highlightNavLink);
});

// Mobile Menu Toggle
if (hamburger) {
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navList.classList.toggle('active');
    });
}

function closeMobileMenu() {
    if (hamburger) {
        hamburger.classList.remove('active');
    }
    if (navList) {
        navList.classList.remove('active');
    }
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update URL without scrolling
            history.pushState(null, null, targetId);
        }
    });
});

// Highlight active navigation link based on scroll position
function highlightNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-list a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        if (window.pageYOffset >= (sectionTop - headerHeight - 50)) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Copy Terminal Content
function copyTerminalContent() {
    const textToCopy = terminalContent.textContent;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('Terminal content copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Failed to copy content');
    });
}

// Contact Form Handling - UPDATED
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    
    // Show loading state
    const submitBtn = document.querySelector('#contact-form button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Send form data to FormSubmit using AJAX
    fetch('https://formsubmit.co/ajax/ae652aa6e8a2d1fd88fbcf16fbca4bb4', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message,
            _subject: "New message from Gul Muhammad's Portfolio",
            _replyto: formData.email,
            _template: "table"
        })
    })
    .then(response => response.json())
    .then(data => {
        // Show success message
        showToast('Message sent successfully! Redirecting...');
        
        // Redirect to thank you page after a short delay
        setTimeout(() => {
            window.location.href = 'Thankyou.html';
        }, 1500);
    })
    .catch(error => {
        // Show error message
        showToast('Failed to send message. Please try again.');
        console.error('Error:', error);
        
        // Fallback: Open in new tab as backup
        setTimeout(() => {
            contactForm.setAttribute('action', 'https://formsubmit.co/ae652aa6e8a2d1fd88fbcf16fbca4bb4');
            contactForm.setAttribute('method', 'POST');
            contactForm.setAttribute('target', '_blank');
            
            // Add hidden fields for fallback
            const subjectField = document.createElement('input');
            subjectField.type = 'hidden';
            subjectField.name = '_subject';
            subjectField.value = "New message from Gul Muhammad's Portfolio";
            contactForm.appendChild(subjectField);
            
            const templateField = document.createElement('input');
            templateField.type = 'hidden';
            templateField.name = '_template';
            templateField.value = "table";
            contactForm.appendChild(templateField);
            
            contactForm.submit();
        }, 2000);
    })
    .finally(() => {
        // Reset button state after a delay
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 3000);
    });
}

// Toast Notification
function showToast(message) {
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Keyboard Shortcuts
function handleKeyboardShortcuts(e) {
    // Ctrl + K to show a toast
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        showToast('Keyboard shortcut activated!');
    }
    
    // Escape key to close mobile menu
    if (e.key === 'Escape' && navList && navList.classList.contains('active')) {
        closeMobileMenu();
    }
}

// Canvas Background Animation
function initCanvas() {
    const ctx = cyberCanvas.getContext('2d');
    cyberCanvas.width = window.innerWidth;
    cyberCanvas.height = window.innerHeight;
    
    // Array to store particles
    const particles = [];
    const particleCount = 100;
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * cyberCanvas.width;
            this.y = Math.random() * cyberCanvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = `hsl(${Math.random() * 60 + 180}, 100%, 70%)`;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > cyberCanvas.width || this.x < 0) {
                this.speedX = -this.speedX;
            }
            
            if (this.y > cyberCanvas.height || this.y < 0) {
                this.speedY = -this.speedY;
            }
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Connect particles with lines
    function connectParticles() {
        const maxDistance = 100;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = 1 - distance / maxDistance;
                    ctx.strokeStyle = `rgba(10, 251, 96, ${opacity * 0.2})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, cyberCanvas.width, cyberCanvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        connectParticles();
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', function() {
        cyberCanvas.width = window.innerWidth;
        cyberCanvas.height = window.innerHeight;
    });
}
// Countdown timer for redirection
document.addEventListener('DOMContentLoaded', function() {
    let countdown = 10;
    const countdownElement = document.getElementById('countdown');
    const countdownInterval = setInterval(function() {
        countdown--;
        countdownElement.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            window.location.href = 'index.html';
        }
    }, 1000);
    
    // Add cyber particles effect
    createCyberParticles();
});

// Create cyber particles effect
function createCyberParticles() {
    const container = document.querySelector('.animation-container');
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('cyber-particle');
        
        // Random properties
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;
        
        // Apply styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        // Add to container
        container.appendChild(particle);
    }
}

// Add CSS for cyber particles
const style = document.createElement('style');
style.textContent = `
    .cyber-particle {
        position: absolute;
        background-color: var(--primary-color);
        border-radius: 50%;
        opacity: 0;
        pointer-events: none;
        animation: cyber-float 15s infinite linear;
    }
    
    @keyframes cyber-float {
        0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 0.7;
        }
        90% {
            opacity: 0.7;
        }
        100% {
            transform: translateY(-100vh) translateX(calc(-50vw + 50%));
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Keyboard shortcut to skip countdown
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        window.location.href = 'index.html';
    }
});