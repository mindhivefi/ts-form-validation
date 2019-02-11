import { validateForm } from '../';

describe('Form preprocessing', () => {
  it('If trim is set, whitespaces will be removed from start and end of the field value', () => {
    expect(
      validateForm({
        values: {
          a: '  cat  ',
        },
        filled: {
          a: true,
        },
        rules: {
          fields: {
            a: {
              trim: true,
            },
          },
        },
      }),
    ).toEqual({
      values: {
        a: 'cat',
      },
      messages: {},
      isFormValid: true,
    });
  });

  it('Will call preprocessor method if it defined for the field', () => {
    expect(
      validateForm({
        values: {
          a: 'cat',
        },
        filled: {
          a: true,
        },
        rules: {
          fields: {
            a: {
              preprocess: (value: any) => `${value}fish`,
            },
          },
        },
      }),
    ).toEqual({
      values: {
        a: 'catfish',
      },
      messages: {},
      isFormValid: true,
    });
  });
});
