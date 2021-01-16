type NoteState = {
  dragging: boolean;
  adjustment: [number, number];
};

function killEventPropagation(event: MouseEvent): void {
  event.stopImmediatePropagation();
}

function px(value: number): string {
  return `${value}px`;
}

export class Note extends HTMLElement {
  public input: HTMLElement;
  private container: HTMLElement;
  private state: NoteState;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      dragging: false,
      adjustment: [0, 0],
    };

    this.container = document.createElement('div');
    const header = document.createElement('h3');
    header.textContent = this.hasAttribute('header-text')
      ? this.getAttribute('header-text')
      : 'Note';
    const input = document.createElement('textarea');

    header.classList.add('header');
    input.classList.add('input');
    this.container.classList.add('container');

    this.container.appendChild(header);
    this.container.appendChild(input);

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;

    this.input = input;
    const oldSelect = document.body.style.userSelect;

    this.input.onmousedown = killEventPropagation;

    this.container.onmousedown = this.recordPosition;

    this.container.onmouseup = () => {
      document.body.style.userSelect = oldSelect;
      this.state.dragging = false;
      this.container.classList.remove('dragging');
      const event = new CustomEvent('ondragstop', {
        detail: [parseInt(this.style.top), parseInt(this.style.left)],
      });
      this.dispatchEvent(event);
      document.onmousemove = null;
    };

    this.shadowRoot.append(styleSheet, this.container);
    return this;
  }

  recordPosition = (event: MouseEvent) => {
    const [top, left] = [parseInt(this.style.top), parseInt(this.style.left)];
    const { pageX, pageY } = event;

    document.body.style.userSelect = 'none';

    this.state.adjustment = [top - pageY, left - pageX];
    this.state.dragging = true;
    this.container.classList.add('dragging');
    document.onmousemove = this.drag;
  };

  drag = (event: MouseEvent) => {
    if (this.state.dragging) {
      const [topAdj, leftAdj] = this.state.adjustment;
      this.style.top = px(event.pageY + topAdj);
      this.style.left = px(event.pageX + leftAdj);
    }
  };

  public updatePosition = (top: number, left: number) => {
    this.style.top = px(top);
    this.style.left = px(left);
  };
}

const styles = `
  .header {
    font-family: sans serif;
  }
  .container {
    z-index: 10000000;
    opacity: 0.6;
    position: absolute;
    width: 200px;
    height: 200px;
    background-color: yellow;
    cursor: pointer;
    padding: 0.5rem 0.5rem 0 0.5rem;
  }

  .input {
    resize: none;
    width: 100%;
    height: 70%;
  }

  .dragging {
    opacity: 0.2;
    background-color: purple;
    transform: translate(20deg);
  }
`;
