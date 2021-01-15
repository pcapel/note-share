export type Action = { action: string; data: any };

export type Reducer = (state: any, action: Action) => any;

export function createAction(name: string) {
  this.name = name;
  return (data: any): Action => ({
    action: name,
    data,
  });
}

export const buildDispatch = (reducer: Reducer) => (action: Action): void => {
  browser.storage.local
    .get(window.location.href)
    .then((state) => reducer(state, action))
    .then((nextState) =>
      browser.storage.local.set({ [window.location.href]: nextState })
    );
};
