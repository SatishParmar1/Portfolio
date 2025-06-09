// Check if running in browser environment
if (typeof window !== 'undefined') {
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, {
            threshold: 0.1
        });

        // Observe all sections when DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('section').forEach((section) => {
                observer.observe(section);
            });
            
            // Add fade-in class to initial elements
            document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
        });
    } else {
        console.warn('IntersectionObserver not supported in this browser');
    }

    // Smooth scroll functionality
    function smoothScroll(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Handle active state for bottom navigation
    function updateActiveNavItem() {
        const sections = ['14', '10', '11', '12'];
        const navItems = document.querySelectorAll('.nav-item');
        
        let currentSection = sections[0];
        sections.forEach(section => {
            const element = document.getElementById(section);
            const rect = element.getBoundingClientRect();
            if (rect.top <= 100) {
                currentSection = section;
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSection}`) {
                item.classList.add('active');
            }
        });
    }

    // Form submission handler
    async function submitForm(e) {
        e.preventDefault();

        // Reset any previous error states
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
        document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

        // Validation
        let hasErrors = false;
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const email = document.getElementById('email');
        const mobile = document.getElementById('mobile');
        const message = document.getElementById('message');
        const submitBtn = document.querySelector('input[type="submit"]');

        // Name validation
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(firstName.value.trim())) {
            showError(firstName, 'Please enter a valid name (alphabets only)');
            hasErrors = true;
        }
        
        if (!nameRegex.test(lastName.value.trim())) {
            showError(lastName, 'Please enter a valid last name (alphabets only)');
            hasErrors = true;
        }

        // Add real-time validation for names
        [firstName, lastName].forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value;
                // Remove any non-alphabetic characters
                value = value.replace(/[^A-Za-z\s]/g, '');
                e.target.value = value;
                
                // Remove error if value becomes valid
                if (nameRegex.test(value.trim())) {
                    e.target.classList.remove('input-error');
                    const errorDiv = e.target.nextElementSibling;
                    if (errorDiv && errorDiv.classList.contains('error-message')) {
                        errorDiv.style.display = 'none';
                    }
                }
            });
        });

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            showError(email, 'Please enter a valid email address');
            hasErrors = true;
        }

        // Enhanced Mobile validation
        const mobileRegex = /^[6-9]\d{9}$/; // Indian mobile number format
        const formattedMobile = mobile.value.replace(/\D/g, ''); // Remove non-digits
        
        if (!mobileRegex.test(formattedMobile)) {
            showError(mobile, 'Please enter a valid Indian mobile number (10 digits starting with 6-9)');
            hasErrors = true;
        }

        // Real-time mobile number formatting
        mobile.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) value = value.slice(0, 10);
            // Format as: XXX-XXX-XXXX
            if (value.length > 6) {
                value = value.slice(0,3) + '-' + value.slice(3,6) + '-' + value.slice(6);
            } else if (value.length > 3) {
                value = value.slice(0,3) + '-' + value.slice(3);
            }
            e.target.value = value;
        });

        // Required fields validation
        [firstName, lastName, email, mobile, message].forEach(field => {
            if (!field.value.trim()) {
                showError(field, 'This field is required');
                hasErrors = true;
            }
        });

        if (hasErrors) return;

        // Update button state
        submitBtn.classList.add('loading');
        submitBtn.value = 'Sending...';

        try {
            const formData = {
                from_name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
                to_name: "Satish Parmar",
                to_email: "satishparmarparmar486@gmail.com",
                email: document.getElementById('email').value,
                mobile: document.getElementById('mobile').value,
                message: document.getElementById('message').value,
            };

            // Initialize EmailJS with your public key
            emailjs.init("1Hje7WDp009UIiVOr"); // Replace with your public key

            // Show sending toast
            Toastify({
                text: "Sending message...",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                style: {
                    background: "#333",
                }
            }).showToast();

            // Send email using EmailJS
            const result = await emailjs.send(
                "service_vulgof5", // Replace with your service ID
                "template_xqmowln", // Replace with your template ID
                formData
            );

            if (result.status === 200) {
                // Show success toast
                Toastify({
                    text: "Message sent successfully!",
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "right",
                    style: {
                        background: "#4caf50",
                    }
                }).showToast();

                // Clear form
                document.getElementById('contactForm').reset();
            }

            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');
            submitBtn.value = 'Message Sent!';

            setTimeout(() => {
                submitBtn.classList.remove('success');
                submitBtn.value = 'Send Message';
            }, 3000);

        } catch (error) {
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('error');
            submitBtn.value = 'Error!';

            setTimeout(() => {
                submitBtn.classList.remove('error');
                submitBtn.value = 'Send Message';
            }, 3000);
        }
    }

    function showError(element, message) {
        element.classList.add('input-error');
        let errorDiv = element.nextElementSibling;
        if (!errorDiv || !errorDiv.classList.contains('error-message')) {
            errorDiv = document.createElement('div');
            errorDiv.classList.add('error-message');
            element.parentNode.insertBefore(errorDiv, element.nextSibling);
        }
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    // Export functions for use in HTML
    window.smoothScroll = smoothScroll;
    window.submitForm = submitForm;

    window.addEventListener('scroll', updateActiveNavItem);
    document.addEventListener('DOMContentLoaded', updateActiveNavItem);
}
