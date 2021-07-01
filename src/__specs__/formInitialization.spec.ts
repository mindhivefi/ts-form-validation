import { MessageType, validateForm } from '..';
import { FormValidationRules, initForm } from '..';

interface ExampleForm {
  field1: string;
  optional?: number;
}

describe('Form initialization', () => {
  it('Will return a functional form when calling initForm', () => {
    const rules: FormValidationRules<ExampleForm> = {};
    expect(
      initForm<ExampleForm>(
        {
          field1: 'value',
        },

        rules,
      ),
    ).toEqual({
      values: {
        field1: 'value',
      },
      filled: {},
      messages: {},
      rules,
      isFormValid: false,
    });
  });

  it('Will clear old messages from form on new validation', () => {
    const input = {
      values: {
        a: 'a',
        b: '',
      },
      filled: {
        a: true,
      },
      messages: {
        b: {
          type: MessageType.ERROR,
          message: 'This should vanish',
        },
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
      messages: {},
      isFormValid: true,
    });
  });

  it('Will clear old messages from form on new validation', () => {
    const input = {
      values: {
        a: 'a',
        b: '',
      },
      filled: {
        a: true,
      },
      messages: {
        a: {
          type: MessageType.ERROR,
          message: 'This should vanish',
        },
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
      messages: {},
      isFormValid: true,
    });
  });

  it('Will return a initial filled values when calling initForm', () => {
    const rules: FormValidationRules<ExampleForm> = {};
    expect(
      initForm<ExampleForm>(
        {
          field1: 'value',
        },

        rules,

        {
          field1: true, 
        }
      ),
    ).toEqual({
      values: {
        field1: 'value',
      },
      filled: {
        field1: true,
      },
      messages: {},
      rules,
      isFormValid: false,
    });
  });
});
