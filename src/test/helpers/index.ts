const fs = require('fs');

export function setupTemplate(
  templateName: string,
  componentName: string,
  constructor: CustomElementConstructor
) {
  // NOTE: filepath is relative to the run dir
  // So root dir if you're using yarn test
  const templatePath = `html/templates/${templateName}`;
  const templateString = fs.readFileSync(templatePath);
  const templateContainer = document.createElement('div');

  document.body.appendChild(templateContainer);
  templateContainer.innerHTML = templateString;

  customElements.define(componentName, constructor);
}
