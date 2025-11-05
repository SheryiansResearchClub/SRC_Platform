import SplitType from "split-type";
import { debounce } from "./Utils";
import gsap from "gsap";

const lettersAndSymbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '!', '@', '#', '$', '%', '^', '&', '*', '-', '_', '+', '=', ';', ':', '<', '>', ','];

export default class TextAnimator {
  constructor(textElement, config = {}) {
    // Check if the provided element is valid.
    if (!textElement || !(textElement instanceof HTMLElement)) {
      throw new Error('Invalid text element provided.');
    }

    this.textElement = textElement;
    this.originalChars = []; // Store the original characters


    const charDelay = 1 / (config.staticCharDelay ? textElement.innerHTML.length : 10);

    this.controls = {
      charDuration: config.charDuration || 0.03,
      charDelayMultiplier: charDelay * config.charDelayMultiplier || charDelay,
      repeatCount: config.repeatCount || 2,
      repeatDelay: config.repeatDelay || 0.05,
      completionDelay: config.completionDelay || 0.1,
      mainDuration: config.mainDuration || 1,
      mainEase: config.mainEase || 'expo',
    };

    this.splitText();
  }

  splitText() {
    // Split text for animation and store the reference.
    this.splitter = new TextSplitter(this.textElement, {
      splitTypeTypes: 'words, chars'
    });
    this.textElement.classList.add('split-text');

    // Save the initial state of each character
    this.originalChars = this.splitter.getChars().map(char => char.innerHTML);
  }

  animate() {
    // Reset any ongoing animations
    this.reset();

    // Query all individual characters in the line for animation.
    const chars = this.splitter.getChars();

    chars.forEach((char, position) => {
      let initialHTML = char.innerHTML;

      gsap.fromTo(char, {
        opacity: 0
      },
        {
          duration: this.controls.charDuration,
          onComplete: () => gsap.set(char, { innerHTML: initialHTML, delay: this.controls.completionDelay }),
          repeat: this.controls.repeatCount,
          repeatRefresh: true,
          repeatDelay: this.controls.repeatDelay,
          delay: (position + 1) * this.controls.charDelayMultiplier,
          // innerHTML: () => lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)],
          opacity: 1
        });
    });

    gsap.fromTo(this.textElement, {
      '--anim': 0
    },
      {
        duration: this.controls.mainDuration,
        ease: this.controls.mainEase,
        '--anim': 1
      });
  }

  reset() {
    // Reset the text to its original state
    const chars = this.splitter.getChars();
    chars.forEach((char, index) => {
      gsap.killTweensOf(char); // Ensure no ongoing animations
      char.innerHTML = this.originalChars[index];
    });

    gsap.killTweensOf(this.textElement);
    gsap.set(this.textElement, { '--anim': 0 });
  }

  updateControls(newConfig) {
    this.controls = {
      ...this.controls,
      ...newConfig
    };
  }
}
export class TextSplitter {
  constructor(textElement, options = {}) {
    if (!textElement || !(textElement instanceof HTMLElement)) {
      throw new Error('Invalid text element provided.');
    }

    const { resizeCallback, splitTypeTypes } = options;

    this.textElement = textElement;
    this.onResize = typeof resizeCallback === 'function' ? resizeCallback : null;

    const splitOptions = splitTypeTypes ? { types: splitTypeTypes } : {};
    this.splitText = new SplitType(this.textElement, splitOptions);

    if (this.onResize) {
      this.initResizeObserver();
    }
  }

  initResizeObserver() {
    this.previousContainerWidth = null;

    let resizeObserver = new ResizeObserver(
      debounce((entries) => this.handleResize(entries), 100)
    );
    resizeObserver.observe(this.textElement);
  }

  handleResize(entries) {
    const [{ contentRect }] = entries;
    const width = Math.floor(contentRect.width);
    if (this.previousContainerWidth && this.previousContainerWidth !== width) {
      this.splitText.split();
      this.onResize();
    }
    this.previousContainerWidth = width;
  }

  revert() {
    return this.splitText.revert();
  }

  getLines() {
    return this.splitText.lines;
  }

  getWords() {
    return this.splitText.words;
  }

  getChars() {
    return this.splitText.chars;
  }
}