
let isMobileCache = null;
let isTabletCache = null;
let isDesktopCache = null;


export const isMobile = () => {
    if (isMobileCache !== null) {
        return isMobileCache;
    }

    const ua = navigator.userAgent || navigator.vendor || window.opera;
    isMobileCache = /Mobi|Android|iPhone|iPod|Windows Phone|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    return isMobileCache;
};

export const isTablet = () => {
    if (isTabletCache !== null) {
        return isTabletCache;
    }

    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isIPadLegacy = /iPad/.test(ua);
    const isIPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

    isTabletCache = /Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua) || isIPadLegacy || isIPadOS;
    return isTabletCache;
};

export const isDesktop = () => {
    if (isDesktopCache !== null) {
        return isDesktopCache;
    }

    isDesktopCache = !isMobile() && !isTablet();
    return isDesktopCache;
};

export const isMobileOrTablet = () => isMobile() || isTablet();

export function splitNumber(num) {
    const intPart = Math.trunc(num);
    const decimalPart = num - intPart;
    return [intPart, decimalPart];
}

export function createElem(className, parent, type = "div") {
    const temp = document.createElement(type);
    temp.classList.add(className);
    const par = elem(parent);
    par && par.appendChild(temp);
    return temp;
}

export const pixelFov = (distance = 5) => 2 * Math.atan(innerHeight / 2 / distance) * (180 / Math.PI)

export function updateRenderer(renderer) {
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
}

export const get = (selector, from = document) => from.querySelector(selector);

export const getAll = (selector, from = document) => from.querySelectorAll(selector);

export const onClick = (element, callback, opts) => {
    elem(element)?.addEventListener("click", callback, opts);
}

export function createVideoElem(src) {
    const video = document.createElement("video");
    video.src = src;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.play();
    return video;
}

export function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}


export function createFromHTML(html, parent) {
    const div = document.createElement('div');
    div.innerHTML = html;
    parent && parent.appendChild(div);
    return div.firstElementChild;
}

export function onHover(element, onEnter, onLeave) {
    onEnter && elem(element).addEventListener('mouseenter', onEnter);
    onLeave && elem(element).addEventListener('mouseleave', onLeave);
}

export function onResize(callback) {
    function handleResize() {
        callback();
    }

    window.addEventListener('resize', handleResize);
    handleResize();
}


export function animate(callback) {
    function loop(time) {
        callback(time);
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

function elem(elem) {
    return typeof elem === 'string' ? get(elem) : elem;
}

export const addClass = (element, className) => elem(element).classList.add(className);
export const removeClass = (element, className) => elem(element).classList.remove(className);
export const toggleClass = (element, className, active) => elem(element).classList.toggle(className, active);
export const hasClass = (element, className) => elem(element).classList.contains(className);

export const debounce = (func, delay, immediate) => {
    let timerId;
    return (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
        immediate && immediate()
    };
};

export function monitorViewportChanges() {
    const MOBILE_BREAKPOINT = 768;
    let lastIsMobile = window.innerWidth <= MOBILE_BREAKPOINT;

    function handleViewportChange() {
        const isMobileNow = window.innerWidth <= MOBILE_BREAKPOINT;
        if (isMobileNow !== lastIsMobile) {
            isMobileCache = null;
            isTabletCache = null;
            isDesktopCache = null;
            if (isMobileNow || lastIsMobile) {
                setTimeout(() => {
                    window.location.reload();
                }, 100);
            }
            lastIsMobile = isMobileNow;
        }
    }

    window.addEventListener('resize', () => {
        setTimeout(handleViewportChange, 100);
    });

    window.addEventListener('orientationchange', () => {
        setTimeout(handleViewportChange, 300);
    });
}

export function load(callback) {

    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    function scrollToTop() {
        window.scrollTo(0, 0);
    }

    function forceScrollReset() {
        setTimeout(function () {
            scrollToTop();

            document.body.style.overflow = '';
            if (typeof callback === 'function') callback();
        }, 100);
    }

    scrollToTop();

    document.body.style.overflow = 'hidden';

    function handleLoad() {
        requestAnimationFrame(forceScrollReset);
        window.removeEventListener('load', handleLoad);
    }

    window.addEventListener('load', handleLoad);

    window.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            forceScrollReset();
        }
    });

    window.addEventListener('beforeunload', scrollToTop);
}

