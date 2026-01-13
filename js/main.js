// Main JavaScript for Million Challenge

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Countdown Timer
    const countdownElement = document.getElementById("countdown");
    if (countdownElement) {
        const countdownDate = new Date("2026-02-01T00:00:00").getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = countdownDate - now;

            if (distance < 0) {
                countdownElement.innerHTML = "<h2>انطلقت المسابقة!</h2>";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (document.getElementById("days")) document.getElementById("days").innerText = String(days).padStart(2, '0');
            if (document.getElementById("hours")) document.getElementById("hours").innerText = String(hours).padStart(2, '0');
            if (document.getElementById("minutes")) document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
            if (document.getElementById("seconds")) document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
        };

        setInterval(updateCountdown, 1000);
        updateCountdown();
    }

    // Sticky Header Effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
            } else {
                header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
            }
        });
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Custom Toast Notification System
    const showToast = (message, type = 'info') => {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        let icon = 'fa-info-circle';
        if (type === 'success') icon = 'fa-check-circle';
        if (type === 'error') icon = 'fa-exclamation-circle';

        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('fade-out');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 3000);
    };

    // Subscription Form Handling
    const subscribeForm = document.getElementById('subscribeForm');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const phoneInput = subscribeForm.querySelector('input[type="tel"]');
            // Assuming National ID is the second text input or selecting by placeholder/order. 
            // Better to match by order since we replaced file content. 
            // Order in HTML: Name (text), Phone (tel), National ID (text), Email (email)
            // Let's use querySelectorAll to be safe or add IDs in HTML would be better but I can assume order.
            // Actually, I can use the placeholder or adding a class would be best, but let's stick to type/order for now or simple selector.
            // The previous text input is Name. The new one is National ID.
            const textInputs = subscribeForm.querySelectorAll('input[type="text"]');
            const nameInput = textInputs[0];
            const nidInput = textInputs[1];

            const emailInput = subscribeForm.querySelector('input[type="email"]');
            const termsCheckbox = document.getElementById('termsCheckbox');

            const name = nameInput.value.trim();
            const nid = nidInput ? nidInput.value.trim() : '';
            const phone = phoneInput.value.trim();
            const email = emailInput.value.trim();
            const terms = termsCheckbox.checked;

            // Reset Errors
            [nameInput, nidInput, phoneInput, emailInput].forEach(input => {
                if (input) input.classList.remove('error-border');
            });

            let hasError = false;

            // Basic Empty Checks
            if (!name) {
                nameInput.classList.add('error-border');
                hasError = true;
            } else {
                // Name Validation (At least 3 words)
                const nameParts = name.trim().split(/\s+/);
                if (nameParts.length < 3) {
                    nameInput.classList.add('error-border');
                    showToast('يرجى كتابة الاسم ثلاثي على الأقل', 'error');
                    return;
                }
            }

            if (!phone) {
                phoneInput.classList.add('error-border');
                hasError = true;
            } else {
                // Phone Format Validation (Egypt: 11 digits, starts with 01)
                const phonePattern = /^01[0-9]{9}$/;
                if (!phonePattern.test(phone)) {
                    phoneInput.classList.add('error-border');
                    showToast('يرجى إدخال رقم هاتف صحيح (11 رقم يبدأ بـ 01)', 'error');
                    return;
                }
            }

            if (!nid) {
                if (nidInput) nidInput.classList.add('error-border');
                hasError = true;
            } else {
                // National ID Validation (14 digits)
                const nidPattern = /^[0-9]{14}$/;
                if (!nidPattern.test(nid)) {
                    if (nidInput) nidInput.classList.add('error-border');
                    showToast('يرجى إدخال رقم قومي صحيح (14 رقم)', 'error');
                    return;
                }
            }

            if (!email) {
                emailInput.classList.add('error-border');
                hasError = true;
            } else {
                // Email Format Validation
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(email)) {
                    emailInput.classList.add('error-border');
                    showToast('يرجى إدخال بريد إلكتروني صحيح', 'error');
                    return; // Stop here to show specific email error
                }
            }

            if (hasError) {
                showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
                return;
            }

            if (!terms) {
                showToast('يجب الموافقة على الشروط والأحكام للمتابعة', 'error');
                return;
            }

            // Simulate Success
            showToast('تم التسجيل بنجاح! جاري تحويلك...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        });

        // Remove error on input
        const inputs = subscribeForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('error-border');
            });
        });
    }

    // Dashboard Sidebar Navigation Logic
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('.dashboard-section');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Ignore if it's external link or just # (logout handled separately)
            const id = link.id;
            const href = link.getAttribute('href');

            // Allow navigation to other pages like voting.html or index.html
            if (href && href !== '#' && !href.startsWith('#')) {
                return;
            }

            e.preventDefault();

            // If it's a section toggle
            if (id && id.startsWith('link-')) {
                // Remove active class from all links
                sidebarLinks.forEach(l => l.classList.remove('active'));
                // Add to clicked
                link.classList.add('active');

                // Hide all sections
                sections.forEach(section => section.style.display = 'none');

                // Show target section
                const targetId = id.replace('link-', 'section-');
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.style.display = 'block';
                    // Optional: Reset animation
                    targetSection.style.animation = 'none';
                    targetSection.offsetHeight; /* trigger reflow */
                    targetSection.style.animation = 'fadeIn 0.5s ease-out';
                }
            }
        });
    });
});
