export type Action = { type: string; data: any };

export type Reducer = (state: any, action: Action) => any;

export function createAction(name: string) {
  function action(data: any): Action {
    return {
      type: name,
      data,
    };
  }
  action.type = name;
  return action;
}

export const buildDispatch = (reducer: Reducer) => async (
  action: Action
): Promise<any> => {
  const href = window.location.href;
  return browser.storage.local
    .get(href)
    .then((state) => reducer(state[href], action))
    .then((nextState) => {
      browser.storage.local.set({ [window.location.href]: nextState });
      return nextState;
    });
};
