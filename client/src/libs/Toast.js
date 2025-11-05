
export default class Toast {

  static show(message, type = 'info', duration = 3000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const messageElement = document.createElement('div');
    messageElement.className = 'toast-message';
    messageElement.textContent = message;

    const closeButton = document.createElement('button');
    closeButton.className = 'toast-close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
      removeToast(toast);
    });

    toast.appendChild(messageElement);
    toast.appendChild(closeButton);

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    container.style.zIndex = '9999999';

    const timeoutId = setTimeout(() => {
      removeToast(toast);
    }, duration);

    toast.dataset.timeoutId = timeoutId;

    function removeToast(toastElement) {
      clearTimeout(toastElement.dataset.timeoutId);

      toastElement.classList.remove('show');

      setTimeout(() => {
        if (toastElement.parentNode) {
          toastElement.parentNode.removeChild(toastElement);
        }

        if (container.children.length === 0) {
          container.parentNode.removeChild(container);
        }
      }, 300);
    }

    return toast;
  }
}
