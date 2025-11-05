
import { createFromHTML, addClass, removeClass, get, createElem } from './Utils';

const DEFAULT_DURATION_MS = 1000;
const DEFAULT_TOTAL_DIGITS = 3;

const VALUE_HTML = '<span class="odometer-value"></span>';
const RIBBON_HTML = `<span class="odometer-ribbon"><span class="odometer-ribbon-inner">${VALUE_HTML}</span></span>`;
const DIGIT_HTML = `<span class="odometer-digit"><span class="odometer-digit-spacer">8</span><span class="odometer-digit-inner">${RIBBON_HTML}</span></span>`;

class OdometerLite {
    constructor(el, options = {}) {
        if (!el) {
            throw new Error("OdometerLite: Element not provided.");
        }
        this.el = typeof el === 'string' ? get(el) : el;

        this.options = {
            duration: options.duration || DEFAULT_DURATION_MS,
            digits: options.digits || DEFAULT_TOTAL_DIGITS,
            maxValue: options.maxValue !== undefined ? options.maxValue : 100
        };

        if (this.options.digits <= 0) {
            throw new Error("OdometerLite: 'digits' option must be greater than 0.");
        }

        this.el.innerHTML = '';
        addClass(this.el, 'odometer');
        addClass(this.el, 'odometer-theme-minimal');

        this.inside = createElem('odometer-inside', this.el);
        this.ribbonInnerElements = [];
        this.digitHeight = 0;
        this.currentDisplayStr = '0'.padStart(this.options.digits, '0');

        this._setupDigitsAndMeasureHeight();
        this._initialRender();
    }

    _setupDigitsAndMeasureHeight() {
        for (let i = 0; i < this.options.digits; i++) {
            const digitEl = createFromHTML(DIGIT_HTML, this.inside);
            const ribbonInner = get('.odometer-ribbon-inner', digitEl);
            this.ribbonInnerElements.push(ribbonInner);
        }

        const firstRibbon = this.ribbonInnerElements[0];
        if (firstRibbon) {
            const tempValEl = createFromHTML(VALUE_HTML);
            tempValEl.textContent = '0';
            firstRibbon.appendChild(tempValEl);
            this.digitHeight = tempValEl.offsetHeight;
            firstRibbon.innerHTML = '';
        }

        if (this.digitHeight === 0 && document.body.contains(this.el)) {
            console.warn("OdometerLite: Digit height measured as 0. Ensure .odometer-value has CSS height (line-height or height) and the element is visible during initialization. Current height:", this.digitHeight);
        }
    }

    _initialRender() {
        const initialChars = this.currentDisplayStr.split('');
        for (let i = 0; i < this.options.digits; i++) {
            const ribbonInnerEl = this.ribbonInnerElements[i];
            ribbonInnerEl.style.transition = 'none';

            const valEl = createFromHTML(VALUE_HTML);
            valEl.textContent = initialChars[i] || '0';
            ribbonInnerEl.appendChild(valEl);
            ribbonInnerEl.style.transform = 'translateY(0px)';
        }
    }

    _animateDigit(ribbonInnerEl, fromChar, toChar) {
        if (this.digitHeight === 0) {
            if (this.ribbonInnerElements[0]) {
                const tempValEl = createFromHTML(VALUE_HTML);
                tempValEl.textContent = '0';
                this.ribbonInnerElements[0].appendChild(tempValEl);
                this.digitHeight = tempValEl.offsetHeight;
                this.ribbonInnerElements[0].innerHTML = '';
            }
            if (this.digitHeight === 0) {
                ribbonInnerEl.innerHTML = '';
                const valEl = createFromHTML(VALUE_HTML);
                valEl.textContent = toChar;
                ribbonInnerEl.appendChild(valEl);
                ribbonInnerEl.style.transform = 'translateY(0px)';
                return;
            }
        }

        const fromNum = parseInt(fromChar, 10);
        const toNum = parseInt(toChar, 10);
        const valuesToRender = [];

        if (fromNum === toNum) return;

        if (fromNum < toNum) {
            for (let i = fromNum; i <= toNum; i++) valuesToRender.push(String(i));
        } else {
            for (let i = fromNum; i >= toNum; i--) valuesToRender.push(String(i));
        }

        ribbonInnerEl.style.transition = 'none';
        ribbonInnerEl.innerHTML = '';

        valuesToRender.forEach(valStr => {
            const valEl = createFromHTML(VALUE_HTML);
            valEl.textContent = valStr;
            ribbonInnerEl.appendChild(valEl);
        });

        ribbonInnerEl.style.transform = 'translateY(0px)';
        void ribbonInnerEl.offsetHeight;

        ribbonInnerEl.style.transition = `transform ${this.options.duration / 1000}s cubic-bezier(0.4, 0, 0.2, 1)`;
        const targetTranslateY = -(valuesToRender.length - 1) * this.digitHeight;
        ribbonInnerEl.style.transform = `translateY(${targetTranslateY}px)`;
    }

    setValue(value) {
        let num = parseInt(value, 10);
        if (isNaN(num)) num = 0;

        num = Math.max(0, Math.min(num, this.options.maxValue));

        const targetStr = String(num).padStart(this.options.digits, '0');

        if (targetStr === this.currentDisplayStr) return;

        if (this.digitHeight === 0 && this.ribbonInnerElements[0]) {
            const tempValEl = createFromHTML(VALUE_HTML);
            tempValEl.textContent = '0';
            this.ribbonInnerElements[0].appendChild(tempValEl);
            this.digitHeight = tempValEl.offsetHeight;
            this.ribbonInnerElements[0].innerHTML = '';
            if (this.digitHeight === 0) {
                console.warn("OdometerLite.setValue: Digit height still 0. Animation might be incorrect.");
            }
        }

        for (let i = 0; i < this.options.digits; i++) {
            const oldChar = this.currentDisplayStr[i];
            const newChar = targetStr[i];

            if (oldChar !== newChar) {
                this._animateDigit(this.ribbonInnerElements[i], oldChar, newChar);
            }
        }

        this.currentDisplayStr = targetStr;

        addClass(this.el, 'odometer-animating');

        if (this._animationEndTimeout) clearTimeout(this._animationEndTimeout);
        this._animationEndTimeout = setTimeout(() => {
            removeClass(this.el, 'odometer-animating');
        }, this.options.duration + 50);
    }
}

export { OdometerLite };
export default OdometerLite;
