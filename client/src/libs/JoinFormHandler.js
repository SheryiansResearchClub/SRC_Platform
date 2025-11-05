import Toast from './Toast';
import { ScrollTrigger } from 'gsap/all';
import { addClass, debounce, createElem, get, getAll, isMobileOrTablet, onClick, removeClass } from './Utils';

export default class JoinFormHandler {
  constructor() {
    this.form = get('.joinForm');
    this.sections = Array.from(getAll('.form-section', this.form));
    this.progressSteps = Array.from(getAll('.progress-step', this.form));
    this.nextButtons = Array.from(getAll('.next-btn', this.form));
    this.prevButtons = Array.from(getAll('.prev-btn', this.form));
    this.closeButton = get('.form-close', this.form);
    this.submitButton = get('.submit-btn', this.form);
    this.currentSection = 0;
    this.totalSections = this.sections.length;
    this.isMobile = isMobileOrTablet();
    this.appliedForRole = 'none';
    this.mouseFollower = get('.mouseFollower');

    this.phoneField = get('#phone');
    this.emailField = get('#email');
    this.cityField = get('#city');
    this.topCities = [
      "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Ahmedabad",
      "Chennai", "Kolkata", "Pune", "Jaipur", "Surat", "Lucknow",
      "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam"
    ];

    this.URL_REGEX = /^(https?|ftp|ipfs|git):\/\/(?:www\.)?[a-zA-Z0-9-]+\.(?:com|org|net|io|co|edu|gov|info|biz|me)(\/.*)?$/;

    this.validationToken = { phone: 0, email: 0 }; // Add this line

    this.init();
  }


  init() {
    this.form.style.display = 'none';

    if (this.phoneField) {
      this.phoneField.addEventListener(
        'input',
        debounce(() => {
          this.phoneField.value = this.cleanPhone(this.phoneField.value);
          this.validate(this.phoneField.value, 'phone');
        }, 200, () => {
          this.phoneField.value = this.phoneField.value.replace(/[^+0-9]/g, '');
        })
      );
    }

    if (this.emailField) {
      this.emailField.addEventListener(
        'input',
        debounce(() => {
          this.validate(this.emailField.value, 'email');
        }, 200)
      );
    }

    if (this.cityField) {
      // Create suggestion box
      const suggestionBox = createElem('city-suggestions', this.cityField.parentNode, 'ul');
      suggestionBox.style.display = 'none';

      this.cityField.addEventListener('input', () => {
        const val = this.cityField.value.trim().toLowerCase();
        suggestionBox.innerHTML = '';
        if (!val) {
          suggestionBox.style.display = 'none';
          return;
        }
        const matches = this.topCities.filter(city =>
          city.toLowerCase().startsWith(val)
        );
        if (matches.length === 0) {
          suggestionBox.style.display = 'none';
          return;
        }
        matches.forEach(city => {
          const li = document.createElement('li');
          li.textContent = city;
          li.addEventListener('mousedown', e => {
            e.preventDefault();
            this.cityField.value = city;
            suggestionBox.style.display = 'none';
          });
          suggestionBox.appendChild(li);
        });
        suggestionBox.style.display = 'block';
      });

      // Hide suggestions on blur
      this.cityField.addEventListener('blur', () => {
        setTimeout(() => suggestionBox.style.display = 'none', 100);
      });

      // Prevent Enter from submitting the form in the city field
      this.cityField.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          // Optionally, you can select the first suggestion if available:
          const firstSuggestion = suggestionBox.querySelector('li');
          if (firstSuggestion) {
            this.cityField.value = firstSuggestion.textContent;
            suggestionBox.style.display = 'none';
          }
        }
      });
    }



    onClick(this.form, e => {
      const target = e.target;

      if (target.classList.contains('next-btn')) {
        e.preventDefault();
        this.clearSectionErrors();
        this.validateAndNavigate(target.getAttribute('data-next'));
      }

      if (target.classList.contains('prev-btn')) {
        e.preventDefault();
        this.clearSectionErrors();
        this.navigateToSection(target.getAttribute('data-prev'));
      }
    });


    onClick(this.closeButton, () => this.hideForm());
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      this.handleSubmit();
    });

    getAll('.join-club').forEach(btn => {
      onClick(btn, () => {
        this.appliedForRole = 'none';
        this.showForm();
        this.appliedForRole = btn.getAttribute('data-role') || 'none';
      });
    });


    getAll('textarea', this.form).forEach(textarea => {
      const counter = createElem('char-counter', textarea.parentNode);
      counter.textContent = `0 / 600`;

      textarea.addEventListener('input', () => {
        const len = textarea.value.length;
        counter.textContent = `${len} / 600`;
        counter.style.color = len > 600 ? 'red' : '';
      });
    });

    // Add Enter navigation logic for all inputs/selects except textarea
    this.sections.forEach(section => {
      const fields = Array.from(getAll('input, select', section)).filter(
        field => field.type !== 'hidden' && field.type !== 'submit' && field.tagName.toLowerCase() !== 'textarea'
      );
      if (fields.length > 0) {
        fields.forEach((field, idx) => {
          field.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
              // Special handling for city field with suggestions
              if (field === this.cityField) {
                const suggestionBox = section.querySelector('.city-suggestions');
                const firstSuggestion = suggestionBox && suggestionBox.querySelector('li');
                if (suggestionBox && suggestionBox.style.display !== 'none' && firstSuggestion) {
                  e.preventDefault();
                  this.cityField.value = firstSuggestion.textContent;
                  suggestionBox.style.display = 'none';
                  return;
                }
              }
              e.preventDefault();
              // If not last field, focus next
              if (idx < fields.length - 1) {
                fields[idx + 1].focus();
              } else {
                // If last field, trigger next section
                const nextBtn = get('.next-btn', section);
                if (nextBtn) nextBtn.click();
              }
            }
          });
        });
      }
    });
  }


  showForm() {

    addClass(this.mouseFollower, 'form-open');

    this.sections = Array.from(getAll('.form-section', this.form));
    this.totalSections = this.sections.length;

    this.form.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    if (this.isMobile) ScrollTrigger.normalizeScroll(false);

    if (this.sections.length > 0) {
      this.navigateToSection(this.sections[0].id);
    } else {
      console.error('No form sections found');
    }
  }

  hideForm() {
    removeClass(this.mouseFollower, 'form-open');
    this.form.style.display = 'none';
    document.body.style.overflow = '';
    if (this.isMobile) ScrollTrigger.normalizeScroll(true);
  }

  navigateToSection(sectionId) {
    this.sections.forEach(s => (s.style.display = 'none'));
    const target = document.getElementById(sectionId);
    if (!target) return console.error(`Section not found: ${sectionId}`);
    target.style.display = 'flex';

    this.currentSection = this.sections.findIndex(section => section.id === sectionId);
    if (this.currentSection === -1) {
      this.currentSection = parseInt(sectionId.split('-')[1], 10) - 1;
    }

    this.updateProgressSteps();
    const content = get('.form-content', target);
    if (content) content.scrollTop = 0;
  }

  updateProgressSteps() {
    const progressContainer = get('.form-progress', this.form);

    if (this.progressSteps.length !== this.totalSections) {
      progressContainer.innerHTML = '';
      this.progressSteps = [];

      for (let i = 0; i < this.totalSections; i++) {
        if (this.totalSections < 2) return;
        const step = document.createElement('div');
        step.className = 'progress-step';
        step.dataset.step = i + 1;
        progressContainer.appendChild(step);
        this.progressSteps.push(step);
      }
    }

    this.progressSteps.forEach((step, i) => {
      step.classList.toggle('active', i <= this.currentSection);
    });
  }

  clearSectionErrors() {
    const section = this.sections[this.currentSection];
    getAll('.error', section).forEach(el => el.classList.remove('error'));
    getAll('.error-message', section).forEach(msg => msg.remove());
  }


  async validate(value, type, next = false) {
    let isValid = false;
    let field = type === 'phone' ? this.phoneField : this.emailField;

    // Increment token for this type
    const token = ++this.validationToken[type];

    if (type === 'phone') isValid = value && this.checkPhone(value);
    else if (type === 'email') isValid = value && this.checkEmail(value);

    if (!isValid) {
      if (next) {
        this.markFieldError(field, `Please enter a valid ${type}.`);
        Toast.show(`Please fill in a valid ${type}.`, 'error');
      }
      return false;
    }

    let checking = get('.checking', field.parentElement);
    if (!checking) {
      checking = createElem('checking', field.parentElement);
      checking.textContent = 'checking...';
    }

    try {
      const res = await fetch('https://tz7dsnr2-8000.inc1.devtunnels.ms/src/check-exists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, value })
      });
      const { exists, message } = await res.json();

      // Only act if this is the latest validation request
      if (token !== this.validationToken[type]) return false;

      checking.remove();
      if (exists) {
        this.markFieldError(field, message);
        Toast.show(message, 'warning');
        return false;
      } else {
        this.removeFieldError(field);
        return true;
      }
    } catch (err) {
      // Only act if this is the latest validation request
      if (token !== this.validationToken[type]) return false;
      console.error('Error checking status:', err);
      checking.remove();
      return false;
    }
  }

  checkEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  cleanPhone(phone) {
    let cleaned = phone.replace(/^0+/, '');
    if (cleaned.startsWith('+91')) cleaned = cleaned.slice(3);
    if (cleaned.startsWith('91') && cleaned.length > 11) cleaned = cleaned.slice(2);
    return cleaned;
  }

  checkPhone(phone) {
    const cleaned = this.cleanPhone(phone);
    return /^[6-9]\d{9}$/.test(cleaned) && cleaned.length === 10;
  }

  async validateAndNavigate(nextSectionId) {
    const section = this.sections[this.currentSection];
    const fields = Array.from(getAll('input, textarea, select', section));
    const expertiseField = get('#expertise', section);

    for (const field of fields) {
      const val = field.value.trim();
      const required = field.hasAttribute('required');
      const type = field.type;

      if (required && !val) {
        this.markFieldError(field, 'This field is required');
        Toast.show('Please fill in all required fields correctly.', 'error');
        return;
      }


      if ((type === 'email' || type === 'tel') && val) {
        const isValid = await this.validate(val, type === 'tel' ? 'phone' : 'email', true);
        if (!isValid) return;
      }


      if (type === 'text_url' && val) {
        let url = val;
        if (!/^(https?|ftp|ipfs|git):\/\//i.test(url)) url = 'https://' + url;
        if (!this.URL_REGEX.test(url)) {
          this.markFieldError(field, 'Please enter a valid URL (e.g., https://example.com)');
          Toast.show('Please fill in a valid URL.', 'error');
          return;
        }
      }

      if (field.tagName.toLowerCase() === 'textarea' && val) {
        if (val.length < 10) {
          this.markFieldError(field, 'Please enter at least 10 characters');
          Toast.show('Please enter at least 10 characters in the textarea.', 'error');
          return;
        }
        if (val.length > 600) {
          this.markFieldError(field, 'Please limit your input to 600 characters');
          Toast.show('Please limit your input to 600 characters.', 'error');
          return;
        }
      }
    }

    if (expertiseField && section.contains(expertiseField)) {
      const checkboxes = getAll('input[name="expertise"]', expertiseField);
      if (checkboxes.length > 0) {
        const isChecked = Array.from(checkboxes).some(cb => cb.checked);
        if (!isChecked) {
          Toast.show('Please select at least one area of interest.', 'error');
          checkboxes[0].focus();
          checkboxes.forEach(cb => cb.classList.add('error'));
          return;
        } else {
          checkboxes.forEach(cb => cb.classList.remove('error'));
        }
      }
    }

    this.navigateToSection(nextSectionId);
  }

  async handleSubmit() {

    const finishForm = (msg, error = false) => {
      Toast.show(msg, error ? 'error' : 'success');
      removeClass(this.form, 'submitting');
      this.submitButton.disabled = false;

      if (!error) {
        this.form.reset();
        this.hideForm();
      }
    }

    this.submitButton.disabled = true;
    addClass(this.form, 'submitting');

    const roleField = get('#applied_for_role', this.form)
    if (roleField) roleField.value = this.appliedForRole;

    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData.entries());

    data.expertise = formData.getAll('expertise');

    console.log(JSON.stringify(data));

    try {
      const response = await fetch('https://tz7dsnr2-8000.inc1.devtunnels.ms/src', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMsg = result.error || 'An error occurred while submitting the form.';
        finishForm(errorMsg, true);
        return;
      }

      console.log('Form submitted:', result);
      finishForm('Your application has been submitted successfully!');

    } catch (error) {
      finishForm('An error occurred while submitting the form. Please try again.', true);
      console.error('Error submitting form:', error);
    }
  }

  markFieldError(field, message) {
    field.classList.add('error');
    let lbl = get('.error-message', field.parentElement);
    if (!lbl) lbl = createElem('error-message', field.parentElement, 'span');
    lbl.textContent = message;
    field.focus();
  }

  removeFieldError(field) {
    field.classList.remove('error');
    let lbl = get('.error-message', field.parentElement);
    if (lbl) lbl.remove();
  }
}
