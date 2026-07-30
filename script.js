/* ==========================================================================
   ZORRA SOCIAL - JAVASCRIPT LOGIC
   Mobile navigation, plan pre-fill behavior, client-side form validation.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Nav Drawer Toggle
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta-mobile a');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 2. Header elevation shadow on scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.style.boxShadow = '0 4px 20px rgba(43, 33, 24, 0.08)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });

  // 3. Plan Pre-fill & Scroll Handler ("Choose Plan" buttons)
  const choosePlanBtns = document.querySelectorAll('.choose-plan-btn');
  const interestedPlanSelect = document.getElementById('interestedPlan');
  const selectedPlanBanner = document.getElementById('selectedPlanBanner');
  const selectedPlanName = document.getElementById('selectedPlanName');
  const clearPlanBtn = document.getElementById('clearPlanBtn');

  function setPlan(planName) {
    if (!interestedPlanSelect) return;

    // Set select value matching option value prefix
    for (let option of interestedPlanSelect.options) {
      if (option.value.toLowerCase().startsWith(planName.toLowerCase())) {
        option.selected = true;
        break;
      }
    }

    if (selectedPlanBanner && selectedPlanName) {
      selectedPlanName.textContent = `${planName} Plan`;
      selectedPlanBanner.style.display = 'flex';
    }
  }

  choosePlanBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const plan = btn.getAttribute('data-plan');
      if (plan) {
        setPlan(plan);
      }
    });
  });

  if (clearPlanBtn) {
    clearPlanBtn.addEventListener('click', () => {
      if (interestedPlanSelect) {
        interestedPlanSelect.value = 'Not Sure Yet';
      }
      if (selectedPlanBanner) {
        selectedPlanBanner.style.display = 'none';
      }
    });
  }

  // Parse URL query parameter for pre-filling form
  const urlParams = new URLSearchParams(window.location.search);
  const planParam = urlParams.get('plan');
  if (planParam && interestedPlanSelect) {
    // Capitalize first letter for banner display
    const formattedPlan = planParam.charAt(0).toUpperCase() + planParam.slice(1);
    setPlan(formattedPlan);
  }

  // Sync banner if user manually changes dropdown
  if (interestedPlanSelect) {
    interestedPlanSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'Not Sure Yet' || !val) {
        if (selectedPlanBanner) selectedPlanBanner.style.display = 'none';
      } else {
        if (selectedPlanBanner && selectedPlanName) {
          selectedPlanName.textContent = `${val} Plan`;
          selectedPlanBanner.style.display = 'flex';
        }
      }
    });
  }

  // 4. Contact Form Client-Side Validation & Submission
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  const fullNameInput = document.getElementById('fullName');
  const businessNameInput = document.getElementById('businessName');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const businessTypeSelect = document.getElementById('businessType');

  // Helper validation functions
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function validatePhone(phone) {
    // Allows digits, spaces, dashes, plus sign, min 7 digits
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 7 && cleanPhone.length <= 15;
  }

  function setError(inputElement, errorElementId, message) {
    const parentGroup = inputElement.closest('.form-group');
    const errorEl = document.getElementById(errorElementId);
    if (parentGroup) parentGroup.classList.add('error');
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(inputElement, errorElementId) {
    const parentGroup = inputElement.closest('.form-group');
    const errorEl = document.getElementById(errorElementId);
    if (parentGroup) parentGroup.classList.remove('error');
    if (errorEl) errorEl.textContent = '';
  }

  // Real-time input clearing
  [fullNameInput, businessNameInput, emailInput, phoneInput, businessTypeSelect].forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        clearError(input, `${input.id}Error`);
      });
      if (input.tagName === 'SELECT') {
        input.addEventListener('change', () => {
          clearError(input, `${input.id}Error`);
        });
      }
    }
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Full Name
      if (!fullNameInput.value.trim()) {
        setError(fullNameInput, 'fullNameError', 'Please enter your full name');
        isValid = false;
      } else {
        clearError(fullNameInput, 'fullNameError');
      }

      // Validate Business Name
      if (!businessNameInput.value.trim()) {
        setError(businessNameInput, 'businessNameError', 'Please enter your business name');
        isValid = false;
      } else {
        clearError(businessNameInput, 'businessNameError');
      }

      // Validate Email
      if (!emailInput.value.trim()) {
        setError(emailInput, 'emailError', 'Please enter your email address');
        isValid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        setError(emailInput, 'emailError', 'Please enter a valid email address (e.g. name@example.com)');
        isValid = false;
      } else {
        clearError(emailInput, 'emailError');
      }

      // Validate Phone
      if (!phoneInput.value.trim()) {
        setError(phoneInput, 'phoneError', 'Please enter your phone number');
        isValid = false;
      } else if (!validatePhone(phoneInput.value.trim())) {
        setError(phoneInput, 'phoneError', 'Please enter a valid phone number (at least 7 digits)');
        isValid = false;
      } else {
        clearError(phoneInput, 'phoneError');
      }

      // Validate Business Type
      if (!businessTypeSelect.value) {
        setError(businessTypeSelect, 'businessTypeError', 'Please select your business type');
        isValid = false;
      } else {
        clearError(businessTypeSelect, 'businessTypeError');
      }

      if (!isValid) {
        // Focus first error input
        const firstError = contactForm.querySelector('.form-group.error input, .form-group.error select');
        if (firstError) firstError.focus();
        return;
      }

      // If valid, submit form action
      const submitBtn = document.getElementById('submitBtn');
      const originalBtnText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;

        // Reset form fields
        contactForm.reset();
        if (selectedPlanBanner) selectedPlanBanner.style.display = 'none';

        // Display requested thank-you message
        formStatus.className = 'form-status success';
        formStatus.textContent = "Thanks! We'll contact you within 24 hours.";

        // Auto hide success message after 7 seconds
        setTimeout(() => {
          formStatus.textContent = '';
          formStatus.className = 'form-status';
        }, 7000);
      }, 600);
    });
  }

  // 5. Scroll Animations (Fade/Slide-in)
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  if (animateElements.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animateElements.forEach(el => scrollObserver.observe(el));
  }
});
