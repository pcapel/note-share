export class NoteRow extends HTMLElement {
  private wrapper: HTMLElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.wrapper = document.createElement('tr');
    const styleSheet = document.createElement('style');
    styleSheet.textContent = ``;

    this.shadowRoot.append(this.wrapper);

    return this;
  }
}
