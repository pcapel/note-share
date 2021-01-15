import { HotKeyStack, Context } from '../content/utils';

const ContextEntries = { normal: 'Backslash', search: 'LeftShift' };

describe('HotKeyStack', () => {
  const Stack = new HotKeyStack(ContextEntries);

  beforeEach(() => {
    Stack.clear();
  });

  describe('.clear(): void', () => {
    it('resets the sequence and context to empty values', () => {
      Stack.add(ContextEntries.normal);
      Stack.add('KeyA');
      Stack.add('KeyN');
      expect(Stack.currentContext).toEqual(Context.normal);
      expect(Stack.sequence).toEqual('KeyA-KeyN');

      Stack.clear();

      expect(Stack.currentContext).toEqual('');
      expect(Stack.sequence).toEqual('-');
    });
  });

  describe('.triggerContext(value: string): boolean', () => {
    it('Takes a value and triggers the context if it is configured', () => {
      Stack.triggerContext(ContextEntries.normal);
      expect(Stack.inContext).toBe(true);
      expect(Stack.currentContext).toEqual(Context.normal);

      Stack.clear();

      Stack.triggerContext(ContextEntries.search);
      expect(Stack.inContext).toBe(true);
      expect(Stack.currentContext).toEqual(Context.search);
    });
  });

  describe('.add(value: string): HotKeyStack', () => {
    describe('context has not been triggered', () => {
      it('is a noop', () => {
        // Not in context
        Stack.add('KeyA');
        Stack.add('KeyN');
        expect(Stack.sequence).toEqual('-');
      });
    });

    describe('context has been triggered', () => {
      it('adds the next component to the hot key sequence', () => {
        Stack.triggerContext(ContextEntries.normal);

        Stack.add('KeyA');
        Stack.add('KeyN');
        expect(Stack.sequence).toEqual('KeyA-KeyN');
      });
    });

    describe('context entry is passed in first', () => {
      it('triggers context and then allows the addition of hot key sequences', () => {
        Stack.add(ContextEntries.normal);
        Stack.add('KeyA');
        Stack.add('KeyN');

        expect(Stack.sequence).toEqual('KeyA-KeyN');
      });
    });
  });

  describe('get sequenceComplete(): boolean', () => {
    it('returns false when the sequence has not been completed', () => {
      Stack.add(ContextEntries.normal);
      Stack.add('KeyA');

      expect(Stack.sequenceComplete).toBe(false);
    });

    it('returns true when the sequence has been completed', () => {
      Stack.add(ContextEntries.normal);
      Stack.add('KeyA');
      Stack.add('KeyN');

      expect(Stack.sequenceComplete).toBe(true);
    });
  });

  describe('get inContext(): boolean', () => {
    it('returns true if any context has been triggered', () => {
      expect(Stack.inContext).toBe(false);

      Stack.triggerContext(ContextEntries.normal);

      expect(Stack.inContext).toBe(true);

      Stack.clear();

      expect(Stack.inContext).toBe(false);

      Stack.triggerContext(ContextEntries.search);

      expect(Stack.inContext).toBe(true);
    });
  });

  describe('get contextEntries(): ContextEntry', () => {
    it('returns the currently configured entry keys for the hot key contexts', () => {
      expect(Stack.contextEntries).toEqual(ContextEntries);
    });
  });

  describe('set contextEntries(value: ContextEntry)', () => {
    it('sets the currently configured entry keys for the hot key contexts', () => {
      const NewStack = new HotKeyStack({
        normal: 'Something',
        search: 'Something',
      });
      const expected = {
        normal: 'Something Else',
        search: 'Entirely',
      };

      NewStack.contextEntries = expected;
      expect(NewStack.contextEntries).toEqual(expected);
    });
  });

  describe('get currentContext(): string', () => {
    it('returns the value of the current context', () => {
      Stack.triggerContext(ContextEntries.normal);
      expect(Stack.currentContext).toEqual(Context.normal);
    });
  });
});
