import { validateForm } from '../';

describe('Form preprocessing', () => {
  it('If trim is set, whitespaces will be removed from start and end of the field value', () => {
    const input = {
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
    };
    expect(validateForm(input)).toEqual({
      ...input,
      values: {
        a: 'cat',
      },
      messages: {},
      isFormValid: true,
    });
  });

  it('will do nothing when trim is set and the value is undefined', () => {
    const input = {
      values: {
        a: undefined,
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
    };
    expect(validateForm(input)).toEqual({
      ...input,
      values: {
        a: undefined,
      },
      messages: {},
      isFormValid: true,
    });
  });

  it('Will call preprocessor method if it defined for the field', () => {
    const input = {
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
    };

    expect(validateForm(input)).toEqual({
      ...input,
      values: {
        a: 'catfish',
      },
      messages: {},
      isFormValid: true,
    });
  });
});
