import {
  DEFAULT_ERRORMESSAGE_FIELD_IS_REQUIRED,
  FormValidationMessageCode,
  InputForm,
  MessageType,
  validateForm,
} from '../';

// tslint:disable-next-line: no-big-function
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

  describe('Required fields', () => {
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

    it('Will treat form as valid if ', () => {
      const input = {
        values: {
          a: 'cat',
        },
        filled: {
          a: true,
        },
        rules: {
          validateForm: () => true as any,
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
        isFormValid: true,
      });
    });

    it('Will not require messages to be returned from formValidation', () => {
      const input = {
        values: {
          a: 'cat',
        },
        filled: {
          a: true,
        },
        rules: {
          validateForm: () => {
            return {
              isFormValid: false,              
            }
          },
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

    it('Will show user defined error message defined in the fields rule ', () => {
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
              requiredText: 'Not good',
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
            message: 'Not good',
          },
        },
        isFormValid: false,
      });
    });

    it('Will show default error message for required field when it is defined in rules default messages.', () => {
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
          defaultMessages: {
            // tslint:disable-next-line: no-duplicate-string
            requiredField: 'Default not good',
          },
        },
      };
      expect(validateForm(input)).toEqual({
        ...input,
        messages: {
          a: {
            type: MessageType.ERROR,
            code: FormValidationMessageCode.FIELD_IS_REQUIRED,
            message: 'Default not good',
          },
        },
        isFormValid: false,
      });
    });

    it('Will show user defined error function content defined in the fields rule ', () => {
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
              requiredText: () => 'Not good',
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
            message: 'Not good',
          },
        },
        isFormValid: false,
      });
    });

    it('Will show default error function content for required field when it is defined in rules default messages.', () => {
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
          defaultMessages: {
            requiredField: () => 'Default not good',
          },
        },
      };
      expect(validateForm(input)).toEqual({
        ...input,
        messages: {
          a: {
            type: MessageType.ERROR,
            code: FormValidationMessageCode.FIELD_IS_REQUIRED,
            message: 'Default not good',
          },
        },
        isFormValid: false,
      });
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
              validate: (value: any) => (value && value === '123') || { type: MessageType.ERROR, message: 'Douh!' },
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
              validate: (value: any) => (value && value === 'wrong') || { type: MessageType.ERROR, message: 'Douh!' },
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

  // tslint:disable-next-line: no-identical-functions
  it('will treat form as valid, if all field validators give valid result event if the fields are not marked as filled', () => {
    const input = {
      values: {
        a: 'ABC',
        b: 'def',
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
            validate: (value: string) => ({
              type: MessageType.WARNING,
              // tslint:disable-next-line: no-duplicate-string
              message: 'be careful',
            }),
          },
          b: {
            validate: (value: string) => ({
              type: MessageType.HINT,
              // tslint:disable-next-line: no-duplicate-string
              message: 'look into mirror',
            }),
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

  // tslint:disable-next-line: no-identical-functions
  it('will treat empty array as , if it only have other messages than errors', () => {
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
            validate: (value: string) => ({
              type: MessageType.WARNING,
              message: 'be careful',
            }),
          },
          b: {
            validate: (value: string) => ({
              type: MessageType.HINT,
              message: 'look into mirror',
            }),
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

  it('will mark field filled when set to options', () => {
    const input = {
      values: {
        a: '123',
        b: '234',
      },
      filled: {
        a: true,
      },
      rules: {
        fields: {
          a: {
            validate: (value: string) => ({
              type: MessageType.WARNING,
              message: 'be careful',
            }),
          },
          b: {
            validate: (value: string) => ({
              type: MessageType.HINT,
              message: 'look into mirror',
            }),
          },
        },
      },
    };
    expect(
      validateForm(input, {
        setFilled: 'b',
      }),
    ).toEqual({
      ...input,
      filled: {
        a: true,
        b: true,
      },
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

  it('will mark field filled when set to options as an array', () => {
    const input = {
      values: {
        a: '123',
        b: '234',
      },
      rules: {
        fields: {
          a: {
            validate: (value: string) => ({
              type: MessageType.WARNING,
              message: 'be careful',
            }),
          },
          b: {
            validate: (value: string) => ({
              type: MessageType.HINT,
              message: 'look into mirror',
            }),
          },
        },
      },
    };
    expect(
      validateForm(input, {
        setFilled: ['a', 'b'],
      }),
    ).toEqual({
      ...input,
      filled: {
        a: true,
        b: true,
      },
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

  it('will mark filled fields when an object notation', () => {
    const input = {
      values: {
        a: '123',
        b: '234',
      },
      rules: {
        fields: {
          a: {
            validate: (value: string) => ({
              type: MessageType.WARNING,
              message: 'be careful',
            }),
          },
          b: {
            validate: (value: string) => ({
              type: MessageType.HINT,
              message: 'look into mirror',
            }),
          },
        },
      },
    };
    expect(
      validateForm(input, {
        setFilled: {
          a: true,
          b: false,
        },
      }),
    ).toEqual({
      ...input,
      filled: {
        a: true,
        b: false,
      },
      messages: {
        a: {
          message: 'be careful',
          type: 'warning',
        },
      },
      isFormValid: true,
    });
  });

  it('will set values set on options', () => {
    const input = {
      values: {
        a: '123',
      },
      filled: {
        a: true,
        b: true,
      },
      rules: {
        fields: {
          a: {
            validate: (value: string) => ({
              type: MessageType.WARNING,
              message: 'be careful',
            }),
          },
          b: {
            validate: (value: string) => ({
              type: MessageType.HINT,
              message: 'look into mirror',
            }),
          },
        },
      },
    };

    expect(
      validateForm(input, {
        setValues: {
          b: '456',
        },
      }),
    ).toEqual({
      ...input,
      values: {
        a: '123',
        b: '456',
      },
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

  describe('Custom data delivery to validators', () => {
    it('will deliver data to a field validator', () => {
      let got;
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
              validate: ((value: any, data: any) => {
                got = data.test;
                return true;
              }) as any,
            },
          },
        },
      };
      validateForm(input, { data: { test: 'yay!' } });

      expect(got).toEqual('yay!');
    });

    it('will deliver data to the form field validator', () => {
      let got;
      const input = {
        values: {
          a: '',
        },
        filled: {
          a: true,
        },
        rules: {
          fields: {},
          validateForm: ((form: any, data: any) => {
            got = data.test;
            return true;
          }) as any,
        },
      };
      validateForm(input, { data: { test: 'yay!' } });

      expect(got).toEqual('yay!');
    });
  });
});
