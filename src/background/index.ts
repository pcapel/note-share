import { onCreated } from './utils';
import * as Selection from './selection_context_menu';
import * as NoSelection from './no_selection_context_menu';

// @ts-ignore
browser.contextMenus.onClicked.addListener(Selection.clickReducer);

Selection.menuItems.forEach((menuItem) => {
  // @ts-ignore
  browser.contextMenus.create(menuItem, onCreated);
});

// @ts-ignore
browser.contextMenus.onClicked.addListener(NoSelection.clickReducer);

NoSelection.menuItems.forEach((menuItem) => {
  // @ts-ignore
  browser.contextMenus.create(menuItem, onCreated);
});
