class GSTooltip {
    constructor() {
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.init();
    }
  
    init() {
        document.querySelectorAll('[data-gs-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', this.handleMouseOver);
            element.addEventListener('mouseleave', this.handleMouseOut);
        });
    }
  
    GSPBgetTransformValue(transformString, valueName) {
        const matrix = new DOMMatrix(transformString);
    
        const values = {
            scale: () => Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b),
            rotate: () => Math.atan2(matrix.b, matrix.a) * (180 / Math.PI),
            scaleX: () => matrix.a,
            scaleY: () => matrix.d,
            rotateX: () => {
                const match = transformString.match(/rotateX\(([^)]+)\)/);
                return match ? parseFloat(match[1]) : 0;
            },
            rotateY: () => {
                const match = transformString.match(/rotateY\(([^)]+)\)/);
                return match ? parseFloat(match[1]) : 0;
            },
            translateX: () => matrix.e,
            translateY: () => matrix.f,
            translateZ: () => matrix.m34
        };
    
        if (values.hasOwnProperty(valueName)) {
            return values[valueName]();
        } else {
            return null;
        }
    }
  
    createTooltipElement(text) {
        const tooltip = document.createElement('span');
        tooltip.classList.add('gs_tooltip');
        tooltip.textContent = text;
        return tooltip;
    }
  
    show(element, tooltipText) {
        const tooltip = this.createTooltipElement(tooltipText);
  
        if (!element.classList.contains('gs_tooltip_trigger')) {
            element.classList.add('gs_tooltip_trigger');
        }
  
        element.appendChild(tooltip);
  
        // Force reflow and add show class
        tooltip.offsetHeight;
        const rect = tooltip.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        if (rect.right > windowWidth - 20 || rect.left < 20) {
            tooltip.style.position = 'fixed';
            tooltip.style.whiteSpace = 'normal';
            
            if (rect.right > windowWidth - 20) {
                tooltip.style.left = `${windowWidth - rect.width - 20}px`;
                tooltip.style.setProperty('--tooltip-after-right', '20px');
                tooltip.style.setProperty('--tooltip-after-left', 'auto');
            } else {
                tooltip.style.left = '20px';
                tooltip.style.setProperty('--tooltip-after-right', 'auto');
                tooltip.style.setProperty('--tooltip-after-left', '20px');
            }
            tooltip.style.bottom = 'auto';
  
            let transformOriginal = window.getComputedStyle(tooltip).transform;
            let transformY = this.GSPBgetTransformValue(transformOriginal, 'translateY');
            let transformScale = this.GSPBgetTransformValue(transformOriginal, 'scale');
            let transformRotateX = this.GSPBgetTransformValue(transformOriginal, 'rotateX');
            tooltip.style.transform = `translateY(${transformY}px) scale(${transformScale}) rotateX(${transformRotateX}deg) translateX(0px)`;
  
            tooltip.offsetHeight;
            const updatedRect = tooltip.getBoundingClientRect();
  
            if (updatedRect.right > windowWidth - 40) {
                tooltip.style.right = '20px';
            }
            if (updatedRect.left < 40) {
                tooltip.style.left = '20px';
            }
  
            const parentRect = tooltip.parentElement.getBoundingClientRect();
            tooltip.style.top = `${parentRect.top - updatedRect.height - 8}px`;
            tooltip.classList.add('gs_tooltip_show_mobile');
        } else {
            tooltip.classList.add('gs_tooltip_show');
        }
    }
  
    hide(element) {
        const tooltips = element.querySelectorAll('.gs_tooltip');
        if (tooltips) {
            tooltips.forEach(tooltip => {
                tooltip.classList.remove('gs_tooltip_show');
                tooltip.classList.remove('gs_tooltip_show_mobile');
                tooltip.style.transition = '0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                setTimeout(() => tooltip.remove(), 300);
            });
        }
    }
  
    handleMouseOver(event) {
        const element = event.currentTarget;
        const tooltipText = element.getAttribute('data-gs-tooltip');
        this.show(element, tooltipText);
    }
  
    handleMouseOut(event) {
        this.hide(event.currentTarget);
    }
  }
  
  // Initialize tooltips
  new GSTooltip();
  