import { Note } from '../../components/note';

import { setupTemplate } from '../helpers';

/**
 * In order to model the way that a user interacts with this component, we
 * would need to have a setup that allowed us to access it idiomatically. So
 * perhaps allowing a public interface that gives access to the udnerlying
 * html procedurally?
 *
 * But I don't really like that, since I like having the component standalone
 * and fire events. So then what are we testing here?
 */
describe('Note', () => {
  beforeAll(() => {
    setupTemplate('note_template.html', 'share-note', Note);
  });

  it('creates a note', () => {
    let n = new Note();
    document.body.appendChild(n);
    expect(n).toBeDefined();

    expect(n.querySelector('.container')).toEqual('oh hi');
  });
});
