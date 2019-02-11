import { validateForm } from '..';

describe('Form Validation Options', () => {
  describe('Preprocessing', () => {
    it('If turned off, no preprocessing will be done', () => {
      expect(
        validateForm(
          {
            values: {
              a: '  123',
              b: '234',
            },
            filled: {
              a: true,
              b: true,
            },
            rules: {},
          },
          {
            usePreprocessor: false,
          },
        ),
      ).toEqual({
        values: {
          a: '  123',
          b: '234',
        },
        messages: {},
        isFormValid: true,
      });
    });
  });
});
