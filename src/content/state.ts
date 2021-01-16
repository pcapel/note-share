import { currentUrl } from '../utils';

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
  const url = currentUrl();
  return browser.storage.local
    .get(url)
    .then((state) => {
      console.log('calling the reducer');
      return reducer(state[url], action);
    })
    .then((nextState) => {
      browser.storage.local.set({ [url]: nextState });
      return nextState;
    });
};
