type NoteState = {
  dragging: boolean;
  adjustment: [number, number];
};

function px(value: number): string {
  return `${value}px`;
}

export const TEMPLATE_ID = 'share-note-note-template';

/**
 * The primary interface for this should be event driven and callback, like a
 * standard element.
 */
export class Note extends HTMLElement {
  public delete: HTMLElement;
  private state: NoteState;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      dragging: false,
      adjustment: [0, 0],
    };
    const template = document.getElementById(TEMPLATE_ID);
    // @ts-ignore TODO: Why TF is content not a part of the type for this?
    const templateContent = template.content;

    const clone = templateContent.cloneNode(true);
    const container = clone.querySelector('.container');
    const input = clone.querySelector('.input');
    const header = clone.querySelector('.header');
    const deleteBtn = clone.querySelector('.delete');

    const oldSelect = document.body.style.userSelect;

    input.onmousedown = (e: MouseEvent) => e.stopImmediatePropagation();
    deleteBtn.onclick = (_event: MouseEvent) => {
      const event = new CustomEvent('softdelete', {
        detail: parseInt(this.id),
      });
      this.dispatchEvent(event);
    };

    header.onmousedown = (event: MouseEvent) => {
      const [top, left] = [parseInt(this.style.top), parseInt(this.style.left)];
      const { pageX, pageY } = event;
      container.classList.add('dragging');

      document.body.style.userSelect = 'none';

      this.state.adjustment = [top - pageY, left - pageX];
      this.state.dragging = true;
      document.onmousemove = this.drag;
    };

    header.onmouseup = () => {
      document.body.style.userSelect = oldSelect;
      this.state.dragging = false;
      container.classList.remove('dragging');
      const event = new CustomEvent('ondragstop', {
        detail: [parseInt(this.style.top), parseInt(this.style.left)],
      });
      this.dispatchEvent(event);
      document.onmousemove = null;
    };
    this.shadowRoot.append(clone);
    return this;
  }

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
