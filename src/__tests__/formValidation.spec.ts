import {
  DEFAULT_ERRORMESSAGE_FIELD_IS_REQUIRED,
  FormValidationMessageCode,
  InputForm,
  MessageType,
  validateForm,
} from '../';

describe('Handling form validation', () => {
  it('Will not validate, if field is not set to filled', () => {
    const input = {
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
    };
    expect(validateForm(input)).toEqual({
      ...input,
      messages: {},
      isFormValid: false,
    });
  });

  it('Will fail if required field is not filled', () => {
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
            required: true,
          },
        },
      },
    };
    expect(validateForm(input)).toEqual({
      ...input,
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
    const input = {
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
    };
    expect(validateForm(input)).toEqual({
      ...input,
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
      const input = {
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
      };
      expect(validateForm(input)).toEqual({
        ...input,
        messages: {},
        isFormValid: true,
      });
    });

    it('Custom Validation Function will fail', () => {
      const input = {
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
      };
      expect(validateForm(input)).toEqual({
        ...input,
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
      const input = {
        values: {
          a: '123',
          b: '123',
        },
        filled: {
          a: true,
          b: true,
        },
        rules: {
          validateForm: () => {
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
      };
      expect(validateForm(input)).toEqual({
        ...input,
        messages: {},
        isFormValid: true,
      });
    });

    it('will handle failed validation', () => {
      interface AB {
        a: string;
        b: string;
      }
      const input: InputForm<AB> = {
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
      };

      expect(validateForm(input)).toEqual({
        ...input,
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

    it('will handle form as invalid, if validateForm will return error message event if isFormValid = true', () => {
      interface AB {
        a: string;
        b: string;
      }
      const input: InputForm<AB> = {
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
              isFormValid: true,
              messages: {},
              formMessage: {
                type: MessageType.ERROR,
                message: 'error',
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
      };

      expect(validateForm(input)).toEqual({
        ...input,
        formMessage: {
          type: MessageType.ERROR,
          message: 'error',
        },
        messages: {},
        isFormValid: false,
      });
    });
  });

  describe('Form Valid State Checks', () => {
    it('will treat form valid, if all fields are valid event if they are not marked filled', () => {
      const input = {
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
      };
      expect(validateForm(input)).toEqual({
        ...input,
        messages: {},
        isFormValid: true,
      });
    });
  });

  it('will treat form as invalid, if some of fields are not even if they are not marked filled', () => {
    const input = {
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
    };
    expect(validateForm(input)).toEqual({
      ...input,
      messages: {},
      isFormValid: false,
    });
  });

  it('will treat form valid, if it only have other messages than errors', () => {
    const input = {
      values: {
        a: '123',
        b: '234',
      },
      filled: {
        a: true,
        b: true,
      },
      rules: {
        fields: {
          a: {
            validate: (value: string) => ({ type: MessageType.WARNING, message: 'be careful' }),
          },
          b: {
            validate: (value: string) => ({ type: MessageType.HINT, message: 'look into mirror' }),
          },
        },
      },
    };
    expect(validateForm(input)).toEqual({
      ...input,
      messages: {
        a: {
          message: 'be careful',
          type: 'warning',
        },
        b: {
          message: 'look into mirror',
          type: 'hint',
        },
      },
      isFormValid: true,
    });
  });
});
