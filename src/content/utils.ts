export enum Context {
  normal = 'Normal',
  search = 'Search',
}

export type ContextEntry = {
  normal: string;
  search: string;
};

export class HotKeyStack {
  private _contextEntries: ContextEntry;
  private _currentContext: string;

  private _action: string;
  private _object: string;

  constructor(contextEntry: ContextEntry) {
    this._contextEntries = contextEntry;
    this._currentContext = '';

    this._action = '';
    this._object = '';
  }

  clear(): void {
    this._currentContext = '';
    this._action = '';
    this._object = '';
  }

  triggerContext(value: string): boolean {
    if (this.inContext) return false;

    switch (value) {
      case this._contextEntries.normal:
        this._currentContext = Context.normal;
        return true;
      case this._contextEntries.search:
        this._currentContext = Context.search;
        return true;
      default:
        this._currentContext = '';
        return false;
    }
  }

  add(value: string): HotKeyStack {
    if (!this.inContext) {
      this.triggerContext(value);
    } else if (this._action === '') {
      this._action = value;
    } else if (this._object === '') {
      this._object = value;
    }
    return this;
  }

  get sequenceComplete(): boolean {
    return !!this._action && !!this._object;
  }

  get inContext(): boolean {
    return this._currentContext !== '';
  }

  get sequence(): string {
    return [this._action, this._object].join('-');
  }

  get contextEntries(): ContextEntry {
    return this._contextEntries;
  }

  set contextEntries(value: ContextEntry) {
    this._contextEntries = value;
  }

  get currentContext(): string {
    return this._currentContext;
  }
}
