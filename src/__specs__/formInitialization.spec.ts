import { FormValidationRules, initForm } from '../index';

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
});
