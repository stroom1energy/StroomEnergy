// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Header background on scroll
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.12)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
            }
        });
    }
    
    // Enhanced form submission handling
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const statusDiv = document.getElementById('form-status');
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const company = formData.get('company');
            const subject = formData.get('subject');
            const message = formData.get('message');
            const privacy = formData.get('privacy');
            const newsletter = formData.get('newsletter');
            
            // Enhanced validation
            if (!name || !email || !message || !privacy) {
                showFormStatus('Будь ласка, заповніть всі обов\'язкові поля та погодьтеся з обробкою персональних даних', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormStatus('Будь ласка, введіть коректний email адрес', 'error');
                return;
            }
            
            // Phone validation (if provided)
            if (phone) {
                const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
                if (!phoneRegex.test(phone)) {
                    showFormStatus('Будь ласка, введіть коректний номер телефону', 'error');
                    return;
                }
            }
            
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.innerHTML = '<i class="fas fa-spinner"></i> Відправка...';
            submitBtn.disabled = true;
            showFormStatus('Відправка повідомлення...', 'loading');
            
            // Actual Formspree submission
            fetch('https://formspree.io/f/mzzvjvlg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    phone: phone || '',
                    company: company || '',
                    subject: subject || '',
                    message: message,
                    privacy: privacy ? 'Так' : 'Ні',
                    newsletter: newsletter ? 'Так' : 'Ні'
                })
            })
            .then(response => {
                if (response.ok) {
                    // Success
                    submitBtn.classList.remove('loading');
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Надіслати повідомлення';
                    submitBtn.disabled = false;
                    
                    showFormStatus('Дякуємо за ваше повідомлення! Ми зв\'яжемося з вами найближчим часом.', 'success');
                    
                    // Reset form
                    this.reset();
                    
                    // Clear status after 5 seconds
                    setTimeout(() => {
                        hideFormStatus();
                    }, 5000);
                } else {
                    // Error
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                
                // Reset button state
                submitBtn.classList.remove('loading');
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Надіслати повідомлення';
                submitBtn.disabled = false;
                
                showFormStatus('Помилка відправки повідомлення. Будь ласка, спробуйте ще раз або зв\'яжіться з нами безпосередньо.', 'error');
                
                // Clear error status after 8 seconds
                setTimeout(() => {
                    hideFormStatus();
                }, 8000);
            });
        });
        
        // Real-time validation - Disabled visual feedback
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Removed input event listener that was checking for error class
        });
    }
    
    // Form validation function - Disabled visual highlighting
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        // Validate based on field type (without visual feedback)
        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    return false;
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return false;
                }
                break;
            case 'phone':
                if (value && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(value)) {
                    return false;
                }
                break;
            case 'message':
                if (value.length < 10) {
                    return false;
                }
                break;
        }
        
        return true;
    }
    
    // Form status functions
    function showFormStatus(message, type) {
        const statusDiv = document.getElementById('form-status');
        if (statusDiv) {
            statusDiv.textContent = message;
            statusDiv.className = `form-status ${type}`;
            statusDiv.style.display = 'block';
        }
    }
    
    function hideFormStatus() {
        const statusDiv = document.getElementById('form-status');
        if (statusDiv) {
            statusDiv.style.display = 'none';
        }
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.info-card, .value-card, .document-item, .details-card, .step, .legal-item, .advantage-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // Smooth scrolling for internal links (if any)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#1e40af'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add CSS for notifications and animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 70px;
            flex-direction: column;
            background-color: white;
            width: 100%;
            text-align: center;
            transition: 0.3s;
            box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
            padding: 2rem 0;
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-menu li {
            margin: 1rem 0;
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }
        
        .hamburger.active span:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }
    }
    
    .loaded .hero-content {
        animation: fadeInUp 1s ease-out;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Form validation styles */
    .form-group input:invalid,
    .form-group textarea:invalid,
    .form-group select:invalid {
        border-color: #ef4444;
    }
    
    .form-group input:valid,
    .form-group textarea:valid,
    .form-group select:valid {
        border-color: #10b981;
    }
    
    /* Loading states */
    .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    /* Hover effects for cards */
    .info-card:hover,
    .value-card:hover,
    .document-item:hover,
    .details-card:hover,
    .step:hover,
    .legal-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
    
    /* Smooth transitions */
    * {
        transition: all 0.3s ease;
    }
    
    /* Focus styles for accessibility */
    .btn:focus,
    .nav-menu a:focus,
    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
        outline: 2px solid #1e40af;
        outline-offset: 2px;
    }
`;
document.head.appendChild(style); 