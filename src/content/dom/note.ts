type NoteState = {
  dragging: boolean;
  adjustment: [number, number];
};

function kill(event: MouseEvent): void {
  event.stopImmediatePropagation();
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

    this.input.onmousedown = kill;
    this.container.onmousedown = this.recordPosition;
    document.onmousemove = this.drag;
    this.container.onmouseup = () => {
      document.body.style.userSelect = oldSelect;
      this.state.dragging = false;
      this.container.classList.remove('dragging');
    };

    this.shadowRoot.append(styleSheet, this.container);
    return this;
  }

  attributeChangedCallback = (name: any, oldValue: any, newValue: any) => {
    console.log(name, oldValue, newValue);
  };

  recordPosition = (event: MouseEvent) => {
    const [top, left] = [parseInt(this.style.top), parseInt(this.style.left)];
    const { pageX, pageY } = event;
    document.body.style.userSelect = 'none';
    this.state.adjustment = [top - pageY, left - pageX];
    this.state.dragging = true;
    this.container.classList.add('dragging');
  };

  drag = (event: MouseEvent) => {
    if (this.state.dragging) {
      const [topAdj, leftAdj] = this.state.adjustment;
      this.style.top = `${event.pageY + topAdj}`;
      this.style.left = `${event.pageX + leftAdj}`;
    }
  };
}

const styles = `
  .header {
    font-family: sans serif;
  }
  .container {
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
