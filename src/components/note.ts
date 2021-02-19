import { buildChildren, unpx, px } from '../utils';

type NoteChildren = {
  container?: HTMLElement;
  input?: HTMLElement;
  header?: HTMLElement;
  deleteBtn?: HTMLElement;
};

type NoteState = {
  dragging: boolean;
  adjustment: [number, number];
  children: NoteChildren;
  userSelect: string;
};

export const TEMPLATE_ID = 'share-note-note-template';
const CHILD_CLASSES = ['.container', '.input', '.header', '.deleteBtn'];

/**
 * Emits Events:
 *
 * ondragstop: When dragging is stopped.
 *  detail: [top, left]
 *
 * softdelete: When delete button is pressed
 *  detail: noteId
 *
 * noteupdate: When onchange fires for the input
 *  detail: inputValue
 *
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
      children: {},
      userSelect: '',
    };

    const template = document.getElementById(TEMPLATE_ID);
    // @ts-ignore TODO: Why TF is content not a part of the type for this?
    const templateContent = template.content;

    const clone = templateContent.cloneNode(true);

    this.state.children = buildChildren(clone, CHILD_CLASSES);

    this.state.children.input.onmousedown = (e: MouseEvent) =>
      e.stopImmediatePropagation();
    this.state.children.deleteBtn.onclick = this.dispatchSoftDelete;
    this.state.children.header.onmousedown = this.capturePosition;
    this.state.children.header.onmouseup = this.recordPosition;
    this.state.children.input.onfocus = () => this.isOpaque(false);
    this.state.children.input.onblur = () => this.isOpaque(true);

    // Tracked because we don't want dragable units to do weird selection crap.
    this.state.userSelect = document.body.style.userSelect;

    this.shadowRoot.append(clone);
    return this;
  }

  public updatePosition = (top: number, left: number) => {
    this.style.top = px(top);
    this.style.left = px(left);
  };

  private recordPosition = () => {
    this.state.dragging = false;
    this.state.children?.container.classList.remove('dragging');

    document.body.style.userSelect = this.state.userSelect;

    const event = new CustomEvent('ondragstop', {
      detail: [unpx(this.style.top), unpx(this.style.left)],
    });
    this.dispatchEvent(event);
    document.onmousemove = null;
  };

  private capturePosition = (event: MouseEvent) => {
    const [top, left] = [unpx(this.style.top), unpx(this.style.left)];
    const { pageX, pageY } = event;
    this.state.children?.container.classList.add('dragging');

    document.body.style.userSelect = 'none';

    this.state.adjustment = [top - pageY, left - pageX];
    this.state.dragging = true;
    document.onmousemove = this.drag;
  };

  private isOpaque = (val: boolean) => {
    if (val) {
      this.state.children.container.classList.add('opaque');
    } else {
      this.state.children.container.classList.remove('opaque');
    }
  };

  private dispatchSoftDelete = () => {
    const event = new CustomEvent('softdelete', {
      detail: parseInt(this.id),
    });
    this.dispatchEvent(event);
  };

  private drag = (event: MouseEvent) => {
    if (this.state.dragging) {
      const [topAdj, leftAdj] = this.state.adjustment;
      this.style.top = px(event.pageY + topAdj);
      this.style.left = px(event.pageX + leftAdj);
    }
  };
}
