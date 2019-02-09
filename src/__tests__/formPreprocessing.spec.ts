import { validateFormFields } from '../';

describe('Form preprocessing', () => {
  it('If trim is set, whitespaces will be removed from start and end', () => {
    expect(
      validateFormFields({
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

  it('If supports custom preprocessor methods', () => {
    expect(
      validateFormFields({
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
