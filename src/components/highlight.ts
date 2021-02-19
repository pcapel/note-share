export function buildHighlight(template: HTMLElement) {
  return class Highlight extends HTMLElement {
    private container: HTMLElement;

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });

      this.container = document.createElement('span');
      this.container.classList.add('highlighted');
      let color = 'yellow';
      if (this.hasAttribute('color')) {
        color = this.getAttribute('color');
      }

      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
      .highlighted {background-color: ${color};}
      .hidden { visibility: none; display: none; }
    `;

      this.shadowRoot.append(this.container);

      return this;
    }

    public hide(): void {
      this.classList.add('hidden');
    }

    public show(): void {
      this.classList.remove('hidden');
    }
  };
}
