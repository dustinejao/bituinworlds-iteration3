class TextAnimator {
    constructor(element) {
        this.element = element;
        // Use the initial text content as the first item in the array
        const initialText = element.textContent.trim();
        const animatedTexts = JSON.parse(element.dataset.textAnimated || '[]');
        
        // If animatedTexts is empty, duplicate the initial text
        this.texts = animatedTexts.length > 0 
            ? [initialText, ...animatedTexts] 
            : [initialText, initialText];

        this.speed = parseInt(element.dataset.textAnimatedSpeed) || 3000;
        this.effect = element.dataset.textAnimatedEffect || 'slideTop';
        this.currentIndex = 0;
        this.nextIndex = 1;
        this.initialize();
    }

    initialize() {
        // No need to set initial text, as it's already in the element
        this.element.innerHTML = `<span>${this.texts[0]}</span>`;
    }

    animate() {
        setInterval(() => {
            this[this.effect]();
            this.currentIndex = (this.currentIndex + 1) % this.texts.length;
            this.nextIndex = (this.nextIndex + 1) % this.texts.length;
        }, this.speed);
    }

    slideLeft() {
        const current = this.element.children[0];
        const next = document.createElement('span');
        next.textContent = this.texts[this.nextIndex];
        next.style.transform = 'translateX(100%)';
        this.element.appendChild(next);

        setTimeout(() => {
            current.style.transform = 'translateX(-100%)';
            current.style.opacity = '0';
            next.style.transform = 'translateX(0)';
            next.style.opacity = '1';
        }, 50);

        setTimeout(() => {
            this.element.removeChild(current);
        }, 500);
    }

    slideRight() {
        const current = this.element.children[0];
        const next = document.createElement('span');
        next.textContent = this.texts[this.nextIndex];
        next.style.transform = 'translateX(-100%)';
        this.element.appendChild(next);

        setTimeout(() => {
            current.style.transform = 'translateX(100%)';
            current.style.opacity = '0';
            next.style.transform = 'translateX(0)';
            next.style.opacity = '1';
        }, 50);

        setTimeout(() => {
            this.element.removeChild(current);
        }, 500);
    }

    slideTop() {
        const current = this.element.children[0];
        const next = document.createElement('span');
        next.textContent = this.texts[this.nextIndex];
        next.style.transform = 'translateY(100%)';
        this.element.appendChild(next);

        setTimeout(() => {
            current.style.transform = 'translateY(-100%)';
            current.style.opacity = '0';
            next.style.transform = 'translateY(0)';
            next.style.opacity = '1';
        }, 50);

        setTimeout(() => {
            this.element.removeChild(current);
        }, 500);
    }

    slideBottom() {
        const current = this.element.children[0];
        const next = document.createElement('span');
        next.textContent = this.texts[this.nextIndex];
        next.style.transform = 'translateY(-100%)';
        this.element.appendChild(next);

        setTimeout(() => {
            current.style.transform = 'translateY(100%)';
            current.style.opacity = '0';
            next.style.transform = 'translateY(0)';
            next.style.opacity = '1';
        }, 50);

        setTimeout(() => {
            this.element.removeChild(current);
        }, 500);
    }

    zoomIn() {
        const current = this.element.children[0];
        const next = document.createElement('span');
        next.textContent = this.texts[this.nextIndex];
        next.style.transform = 'scale(0)';
        next.style.opacity = '0';
        this.element.appendChild(next);

        setTimeout(() => {
            current.style.transform = 'scale(1.5)';
            current.style.opacity = '0';
            next.style.transform = 'scale(1)';
            next.style.opacity = '1';
        }, 50);

        setTimeout(() => {
            this.element.removeChild(current);
        }, 500);
    }

    zoomOut() {
        const current = this.element.children[0];
        const next = document.createElement('span');
        next.textContent = this.texts[this.nextIndex];
        next.style.transform = 'scale(1.5)';
        next.style.opacity = '0';
        this.element.appendChild(next);

        setTimeout(() => {
            current.style.transform = 'scale(0)';
            current.style.opacity = '0';
            next.style.transform = 'scale(1)';
            next.style.opacity = '1';
        }, 50);

        setTimeout(() => {
            this.element.removeChild(current);
        }, 500);
    }

    zoomInOut() {
        const current = this.element.children[0];
        const next = document.createElement('span');
        next.textContent = this.texts[this.nextIndex];
        next.style.transform = 'scale(0)';
        next.style.opacity = '0';
        this.element.appendChild(next);

        setTimeout(() => {
            current.style.transform = 'scale(1.5)';
            current.style.opacity = '0';
            next.style.transform = 'scale(0.7)';
            next.style.opacity = '1';
        }, 250);

        setTimeout(() => {
            next.style.transform = 'scale(1)';
        }, 500);

        setTimeout(() => {
            this.element.removeChild(current);
        }, 750);
    }

    rotateTop() {
        const current = this.element.children[0];
        const next = document.createElement('span');
        next.textContent = this.texts[this.nextIndex];
        next.style.transform = 'rotateX(-90deg)';
        next.style.opacity = '0';
        next.style.transformOrigin = 'top';
        this.element.appendChild(next);

        setTimeout(() => {
            current.style.transform = 'rotateX(90deg)';
            current.style.opacity = '0';
            current.style.transformOrigin = 'top';
            next.style.transform = 'rotateX(0deg)';
            next.style.opacity = '1';
        }, 50);

        setTimeout(() => {
            this.element.removeChild(current);
        }, 500);
    }

    rotateBottom() {
        const current = this.element.children[0];
        const next = document.createElement('span');
        next.textContent = this.texts[this.nextIndex];
        next.style.transform = 'rotateX(90deg)';
        next.style.opacity = '0';
        next.style.transformOrigin = 'bottom';
        this.element.appendChild(next);

        setTimeout(() => {
            current.style.transform = 'rotateX(-90deg)';
            current.style.opacity = '0';
            current.style.transformOrigin = 'bottom';
            next.style.transform = 'rotateX(0deg)';
            next.style.opacity = '1';
        }, 50);

        setTimeout(() => {
            this.element.removeChild(current);
        }, 500);
    }

    typewriter() {
        const current = this.element.children[0];
        const currentText = current.textContent;
        const nextText = this.texts[this.nextIndex];
        let i = currentText.length;

        const eraseInterval = setInterval(() => {
            if (i > 0) {
                current.textContent = currentText.slice(0, i - 1) + '|';
                i--;
            } else {
                clearInterval(eraseInterval);
                i = 0;
                const typeInterval = setInterval(() => {
                    if (i < nextText.length) {
                        current.textContent = nextText.slice(0, i + 1) + '|';
                        i++;
                    } else {
                        clearInterval(typeInterval);
                        current.textContent = nextText;
                    }
                }, 50);
            }
        }, 50);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('[data-text-animated]');
    animatedElements.forEach(element => {
        const animator = new TextAnimator(element);
        animator.animate();
    });
});