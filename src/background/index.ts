import { onCreated } from './utils';
import * as Selection from './selection_context_menu';
import * as NoSelection from './no_selection_context_menu';

import { pick } from '../utils';

type Id = number;
type TemplateName = string;
type TemplateContent = string;
type Template = [TemplateName, TemplateContent];

const templates: Template[] = [
  [
    'share-note-note-template',
    require('../../html/templates/note_template.html'),
  ],
];

// @ts-ignore TODO: figure out why contextMenus isn't part of the type declaration
browser.contextMenus.onClicked.addListener(Selection.clickReducer);

Selection.menuItems.forEach((menuItem) => {
  // @ts-ignore
  browser.contextMenus.create(menuItem, onCreated);
});

// @ts-ignore
browser.contextMenus.onClicked.addListener(NoSelection.clickReducer);

NoSelection.menuItems.forEach((menuItem) => {
  // @ts-ignore TODO: figure out why contextMenus isn't part of the type declaration
  browser.contextMenus.create(menuItem, onCreated);
});

function sendTemplatesToTab(tabId: Id) {
  console.log('sending templates to tabs');
  browser.tabs.sendMessage(tabId, templates).catch((e) => {
    console.log('Ugh, error....', e);
  });
}

function sendAllTemplates(tabIds: Id[]) {
  tabIds.forEach(sendTemplatesToTab);
}
// on load send all tabs the templates
browser.tabs.query({}).then((tabs) => sendAllTemplates(pick(tabs, 'id')));

browser.tabs.onCreated.addListener(({ id }) => sendAllTemplates([id]));

// @ts-ignore TODO: look into why this doesn't think there are two args
browser.tabs.onUpdated.addListener((tabId, action, tabInfo) => {
  if (action.status === 'complete') {
    sendAllTemplates([tabId]);
  }
});
