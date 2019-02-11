import {
  validateFormFields,
  MessageType,
  DEFAULT_ERRORMESSAGE_FIELD_IS_REQUIRED,
  FormValidationMessageCode,
} from '../';

describe('Handling form validation', () => {
  it('Will not validate, if field is not set to filled', () => {
    expect(
      validateFormFields({
        values: {
          a: '',
        },
        filled: {
          a: false,
        },
        rules: {
          fields: {
            a: {
              required: true,
            },
          },
        },
      }),
    ).toEqual({
      values: { a: '' },
      messages: {},
      isFormValid: false,
    });
  });

  it('Will fail if required field is not filled', () => {
    expect(
      validateFormFields({
        values: {
          a: undefined,
        },
        filled: {
          a: true,
        },
        rules: {
          fields: {
            a: {
              required: true,
            },
          },
        },
      }),
    ).toEqual({
      values: {
        a: undefined,
      },
      messages: {
        a: {
          type: MessageType.ERROR,
          code: FormValidationMessageCode.FIELD_IS_REQUIRED,
          message: DEFAULT_ERRORMESSAGE_FIELD_IS_REQUIRED,
        },
      },
      isFormValid: false,
    });
  });

  it('Will fail if required field is empty', () => {
    expect(
      validateFormFields({
        values: {
          a: '',
        },
        filled: {
          a: true,
        },
        rules: {
          fields: {
            a: {
              required: true,
            },
          },
        },
      }),
    ).toEqual({
      values: {
        a: '',
      },
      messages: {
        a: {
          type: MessageType.ERROR,
          code: FormValidationMessageCode.FIELD_IS_REQUIRED,
          message: DEFAULT_ERRORMESSAGE_FIELD_IS_REQUIRED,
        },
      },
      isFormValid: false,
    });
  });

  describe('Custom validation function', () => {
    it('Custom Validation Function will match', () => {
      expect(
        validateFormFields({
          values: {
            a: '123',
          },
          filled: {
            a: true,
          },
          rules: {
            fields: {
              a: {
                required: true,
                validate: (value: any) =>
                  value && value === '123' ? false : { type: MessageType.ERROR, message: 'Douh!' },
              },
            },
          },
        }),
      ).toEqual({
        values: {
          a: '123',
        },
        messages: {},
        isFormValid: true,
      });
    });

    it('Custom Validation Function will fail', () => {
      expect(
        validateFormFields({
          values: {
            a: '123',
          },
          filled: {
            a: true,
          },
          rules: {
            fields: {
              a: {
                required: true,
                validate: (value: any) =>
                  value && value === 'wrong' ? false : { type: MessageType.ERROR, message: 'Douh!' },
              },
            },
          },
        }),
      ).toEqual({
        values: {
          a: '123',
        },
        messages: {
          a: {
            type: MessageType.ERROR,
            message: 'Douh!',
          },
        },
        isFormValid: false,
      });
    });
  });

  describe('Form Validation Function', () => {
    it('will handle succeed validation', () => {
      expect(
        validateFormFields({
          values: {
            a: '123',
            b: '123',
          },
          filled: {
            a: true,
            b: true,
          },
          rules: {
            validateForm: form => {
              return {
                isFormValid: true,
                messages: {},
              };
            },
            fields: {
              a: {
                required: true,
              },
              b: {
                required: true,
              },
            },
          },
        }),
      ).toEqual({
        values: {
          a: '123',
          b: '123',
        },
        messages: {},
        isFormValid: true,
      });
    });

    it('will handle failed validation', () => {
      expect(
        validateFormFields({
          values: {
            a: '123',
            b: '234',
          },
          filled: {
            a: true,
            b: true,
          },
          rules: {
            validateForm: form => {
              return {
                isFormValid: form.values.a === form.values.b,
                messages: {
                  a: {
                    type: MessageType.WARNING,
                    message: 'Values do not match',
                  },
                },
                formMessage: {
                  type: MessageType.WARNING,
                  message: 'a and b must match',
                },
              };
            },
            fields: {
              a: {
                required: true,
              },
              b: {
                required: true,
              },
            },
          },
        }),
      ).toEqual({
        values: {
          a: '123',
          b: '234',
        },
        messages: {
          a: {
            type: MessageType.WARNING,
            message: 'Values do not match',
          },
        },
        formMessage: {
          type: MessageType.WARNING,
          message: 'a and b must match',
        },
        isFormValid: false,
      });
    });
  });

  describe('Form Valid State Chekcs', () => {
    it('will treat form valid, if all fields are valid event if they are not marked filled', () => {
      expect(
        validateFormFields({
          values: {
            a: '123',
            b: '234',
          },
          filled: {
            a: false,
            b: false,
          },
          rules: {
            fields: {
              a: {
                required: true,
              },
              b: {
                required: true,
              },
            },
          },
        }),
      ).toEqual({
        values: {
          a: '123',
          b: '234',
        },
        messages: {},
        isFormValid: true,
      });
    });
  });

  it('will treat form invalid, if some o fields are not event if they are not marked filled', () => {
    expect(
      validateFormFields({
        values: {
          a: 'ABC',
          b: '',
        },
        filled: {
          a: false,
          b: false,
        },
        rules: {
          fields: {
            a: {
              required: true,
            },
            b: {
              required: true,
            },
          },
        },
      }),
    ).toEqual({
      values: {
        a: 'ABC',
        b: '',
      },
      messages: {},
      isFormValid: false,
    });
  });
});
