// Vanstra Capital - Main JavaScript
// Handles animations, interactions, and dynamic content

document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeParticles();
    initializeTypedText();
    initializeScrollAnimations();
    initializeTestimonialSlider();
    initializeGrowthChart();
    initializeNavigation();
});

// Initialize all animations
function initializeAnimations() {
    // Animate elements on page load
    anime({
        targets: '.animate-fade-in',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        delay: anime.stagger(200),
        easing: 'easeOutCubic'
    });
    
    // Button hover animations
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            anime({
                targets: button,
                scale: 1.05,
                duration: 300,
                easing: 'easeOutCubic'
            });
        });
        
        button.addEventListener('mouseleave', () => {
            anime({
                targets: button,
                scale: 1,
                duration: 300,
                easing: 'easeOutCubic'
            });
        });
    });
    
    // Card hover animations
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            anime({
                targets: card,
                translateY: -8,
                scale: 1.02,
                duration: 400,
                easing: 'easeOutCubic'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            anime({
                targets: card,
                translateY: 0,
                scale: 1,
                duration: 400,
                easing: 'easeOutCubic'
            });
        });
    });
}

// Initialize particle system for hero background
function initializeParticles() {
    const container = document.getElementById('particleContainer');
    if (!container) return;
    
    // Create PIXI application
    const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000000,
        backgroundAlpha: 0,
        antialias: true
    });
    
    container.appendChild(app.view);
    
    // Create particle container
    const particleContainer = new PIXI.Container();
    app.stage.addChild(particleContainer);
    
    // Particle array
    const particles = [];
    const particleCount = 50;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const particle = new PIXI.Graphics();
        particle.beginFill(0xC89A3A, 0.3);
        particle.drawCircle(0, 0, Math.random() * 3 + 1);
        particle.endFill();
        
        particle.x = Math.random() * app.screen.width;
        particle.y = Math.random() * app.screen.height;
        particle.vx = (Math.random() - 0.5) * 0.5;
        particle.vy = (Math.random() - 0.5) * 0.5;
        
        particles.push(particle);
        particleContainer.addChild(particle);
    }
    
    // Animate particles
    app.ticker.add(() => {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around screen
            if (particle.x > app.screen.width) particle.x = 0;
            if (particle.x < 0) particle.x = app.screen.width;
            if (particle.y > app.screen.height) particle.y = 0;
            if (particle.y < 0) particle.y = app.screen.height;
            
            // Pulse effect
            particle.alpha = 0.3 + Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.2;
        });
    });
    
    // Handle resize
    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
    });
}

// Initialize typed text effect
function initializeTypedText() {
    const typedElement = document.getElementById('typed-text');
    if (!typedElement) return;
    
    new Typed('#typed-text', {
        strings: [
            'Modern Success',
            'Financial Growth',
            'Wealth Building',
            'Smart Banking'
        ],
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    });
}

// Initialize scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate feature icons
                if (entry.target.querySelector('.feature-icon')) {
                    anime({
                        targets: entry.target.querySelector('.feature-icon'),
                        scale: [0, 1],
                        rotate: [0, 360],
                        duration: 800,
                        easing: 'easeOutBounce'
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('.animate-fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Initialize testimonial slider
function initializeTestimonialSlider() {
    const slider = document.getElementById('testimonialSlider');
    if (!slider) return;
    
    new Splide('#testimonialSlider', {
        type: 'loop',
        perPage: 1,
        perMove: 1,
        gap: '2rem',
        autoplay: true,
        interval: 5000,
        pauseOnHover: true,
        arrows: true,
        pagination: true,
        breakpoints: {
            768: {
                perPage: 1,
                gap: '1rem'
            }
        }
    }).mount();
}

// Initialize growth chart
function initializeGrowthChart() {
    const chartElement = document.getElementById('growthChart');
    if (!chartElement) return;
    
    const chart = echarts.init(chartElement);
    
    const option = {
        backgroundColor: 'transparent',
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            axisLine: {
                lineStyle: {
                    color: '#8B96A3'
                }
            },
            axisLabel: {
                color: '#8B96A3'
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#8B96A3'
                }
            },
            axisLabel: {
                color: '#8B96A3',
                formatter: '${value}K'
            },
            splitLine: {
                lineStyle: {
                    color: '#E5E7EB',
                    type: 'dashed'
                }
            }
        },
        series: [
            {
                name: 'Vanstra Capital (4.85% APY)',
                type: 'line',
                data: [10.0, 10.04, 10.08, 10.12, 10.16, 10.20, 10.24, 10.28, 10.32, 10.36, 10.40, 10.44],
                lineStyle: {
                    color: '#C89A3A',
                    width: 3
                },
                itemStyle: {
                    color: '#C89A3A'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(200, 154, 58, 0.3)' },
                            { offset: 1, color: 'rgba(200, 154, 58, 0.05)' }
                        ]
                    }
                },
                smooth: true,
                symbol: 'circle',
                symbolSize: 6
            },
            {
                name: 'Traditional Bank (0.4% APY)',
                type: 'line',
                data: [10.0, 10.003, 10.006, 10.009, 10.012, 10.015, 10.018, 10.021, 10.024, 10.027, 10.030, 10.033],
                lineStyle: {
                    color: '#8B96A3',
                    width: 2,
                    type: 'dashed'
                },
                itemStyle: {
                    color: '#8B96A3'
                },
                smooth: true,
                symbol: 'circle',
                symbolSize: 4
            }
        ],
        legend: {
            data: ['Vanstra Capital (4.85% APY)', 'Traditional Bank (0.4% APY)'],
            textStyle: {
                color: '#041225'
            },
            bottom: 0
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#C89A3A',
            borderWidth: 1,
            textStyle: {
                color: '#041225'
            },
            formatter: function(params) {
                let result = params[0].name + '<br/>';
                params.forEach(param => {
                    result += param.marker + param.seriesName + ': $' + param.value + 'K<br/>';
                });
                return result;
            }
        }
    };
    
    chart.setOption(option);
    
    // Handle resize
    window.addEventListener('resize', () => {
        chart.resize();
    });
}

// Initialize navigation functionality
function initializeNavigation() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Mobile menu toggle (if needed)
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Add scroll effect to navigation
    let lastScrollTop = 0;
    const nav = document.querySelector('nav');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            nav.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            nav.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        type === 'warning' ? 'bg-yellow-500 text-black' :
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(full)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Form validation utilities
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return re.test(phone);
}

// Local storage utilities
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn('Could not save to localStorage:', e);
    }
}

function getFromStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.warn('Could not read from localStorage:', e);
        return null;
    }
}

// Currency Utilities
function formatCurrency(amount) {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

function formatNumber(number) {
    return new Intl.NumberFormat('de-DE').format(number);
}

// Admin functionality
let adminMessages = JSON.parse(localStorage.getItem('adminMessages') || '[]');
let mockUserAccounts = [
    { id: 1, name: 'Max Mustermann', email: 'max@example.com', balance: 15420.50, status: 'Active' },
    { id: 2, name: 'Anna Schmidt', email: 'anna@example.com', balance: 8932.75, status: 'Active' },
    { id: 3, name: 'Klaus Weber', email: 'klaus@example.com', balance: 32100.00, status: 'Pending' },
    { id: 4, name: 'Sophie Müller', email: 'sophie@example.com', balance: 5678.90, status: 'Active' },
    { id: 5, name: 'Thomas Becker', email: 'thomas@example.com', balance: 9876.25, status: 'Suspended' }
];

// Store mock accounts in localStorage
localStorage.setItem('mockUserAccounts', JSON.stringify(mockUserAccounts));

// Admin login functionality
function showAdminLogin() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 class="text-2xl font-bold mb-6 text-center text-navy">Admin Login</h2>
            <form id="adminLoginForm">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input type="password" id="adminPassword" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-accent" placeholder="Enter admin password">
                </div>
                <div class="flex space-x-4">
                    <button type="button" onclick="closeAdminLogin()" class="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" class="flex-1 px-4 py-2 bg-gold-accent text-white rounded-md hover:bg-opacity-90">Login</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const password = document.getElementById('adminPassword').value;
        if (password === 'admin123') {
            window.location.href = 'admin.html';
        } else {
            alert('Invalid password');
        }
    });
}

function closeAdminLogin() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// Coming soon modal
function showComingSoon() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <div class="w-16 h-16 bg-gold-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <h2 class="text-2xl font-bold mb-4 text-navy">Coming Soon</h2>
            <p class="text-gray-600 mb-6">This feature is currently under development and will be available soon.</p>
            <button onclick="closeComingSoon()" class="px-6 py-2 bg-gold-accent text-white rounded-md hover:bg-opacity-90">OK</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeComingSoon() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// Export functions for use in other pages
window.VanstraCapital = {
    showNotification,
    validateEmail,
    validatePhone,
    saveToStorage,
    getFromStorage,
    formatCurrency,
    formatNumber,
    showAdminLogin,
    closeAdminLogin,
    showComingSoon,
    closeComingSoon
};