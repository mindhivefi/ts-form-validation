import { validateForm } from '..';

describe('Form Validation Options', () => {
  describe('Preprocessing', () => {
    it('If turned off, no preprocessing will be done', () => {
      const input = {
        values: {
          a: '  123',
          b: '234',
        },
        filled: {
          a: true,
          b: true,
        },
        rules: {},
      };

      expect(
        validateForm(input, {
          usePreprocessor: false,
        }),
      ).toEqual({
        ...input,
        messages: {},
        isFormValid: true,
      });
    });
  });
});
