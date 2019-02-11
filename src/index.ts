/**
 * # ts-form-validation
 *
 * A simple form validation library for typescript users.
 *
 * @author Ville Venäläinen / Mindhive Oy
 */

export const DEFAULT_ERRORMESSAGE_FIELD_IS_REQUIRED = 'This field is required';

/**
 * Validator definitions for a single form field.
 */
export interface FieldValidator {
  /**
   * Is field required. Default is false.
   */
  required?: boolean;
  /**
   * Trim whitespaces from string's begining and end.
   */
  trim?: boolean;
  /**
   * Do custom preprocessing for the form value, before the validation.
   */
  preprocess?: (value: any) => any;
  /**
   * Validate Fields given value
   */
  validate?: (value: any) => MessageField;
}

/**
 * Initialize form with default set
 */
export const initForm = <T>(values: T, rules: FormValidationRules<T>): Form<T> => ({
  values,
  filled: {},
  messages: {},
  rules,
  isFormValid: false,
});

export interface Form<T> extends InputForm<T>, ValidatedForm<T> {}
/**
 * Definition of the form to be validated
 */
export interface InputForm<T> {
  /**
   * Current form values
   *
   * @type {T}
   * @memberof Form
   */
  values: T;
  /**
   * Set of fields that user has already filled an input. If input is not given, the
   * field will not be validated.
   *
   * @type {FilledFormFields<T>}
   * @memberof Form
   */
  filled: FilledFormFields<T>;
  /**
   * Rules for the validation.
   *
   * @type {FormValidationRules<T>}
   * @memberof Form
   */
  rules: FormValidationRules<T>;
}

type BooleanMap<T> = { [P in keyof T]?: boolean };
type MapType<T, U> = { [P in keyof T]?: U };

export type FieldValidatorMap<T> = Partial<{ [P in keyof T]: FieldValidator }>;

export enum MessageType {
  ERROR = 'error',
  WARNING = 'warning',
  HINT = 'hint',
}

export enum FormValidationMessageCode {
  NONE = 0,
  FIELD_IS_REQUIRED = 1,
  CUSTOM = 100,
}

/**
 * Set of message types triggered in validatio
 */
export type MessageTypeSet = { [P in keyof MessageType]: true };

export interface ValidationMessage {
  /**
   * Type of the error message.
   *
   * @type {MessageType}
   * @memberof ValidationMessage
   */
  type: MessageType;

  /**
   * Message code if any available
   */
  code?: FormValidationMessageCode;
  /**
   * The actual message
   *
   * @type {string}
   * @memberof ValidationMessage
   */
  message: string;
}

/**
 * Message field will indicate if the field has same sort of message triggered during the validation. If not, the value should be false
 */
export type MessageField = false | ValidationMessage;

/**
 * Set of message fields
 */
export type MessageFields<T> = MapType<T, MessageField>;

/**
 * Set of fields with a value filled by the user
 */
export type FilledFormFields<T> = Partial<BooleanMap<T>>;

export interface ValidatedForm<T> {
  /**
   * Form values after validation. These values can be altered by the preprocessing.
   */
  values: T;
  /**
   *
   */
  messages: MessageFields<T>;

  /**
   * True if form has no errors after validation.
   */
  isFormValid: boolean;

  /**
   * Message included into form level
   */
  formMessage?: MessageField;
}

export interface RequiredFieldValidationFields<T> {
  /**
   * The actual form values. If there are preprocessing defined in rules, all preprocessing
   * is already done to these values.
   */
  values: T;
  /**
   * Set of fields, where user has already set an value
   */
  filled: FilledFormFields<T>;
  /**
   * Tells if the form is valid after field validators
   */
  isFormValid: boolean;
}

/**
 * Rule definitions for form validation
 */
export interface FormValidationRules<T> {
  /**
   * Do validation
   */
  validateForm?: (
    form: RequiredFieldValidationFields<T>,
  ) => {
    isFormValid: boolean;
    messages: MessageFields<T>;
    formMessage?: ValidationMessage;
  };

  /**
   * Field specific validators
   */
  fields?: Partial<FieldValidatorMap<T>>;
}

/**
 * Options to control how the form validation flow will be executed.
 */
export interface ValidateFormOptions {
  /**
   * Disable preprocessor. Default value is true
   */
  usePreprocessor: boolean;
}

/**
 * Validate form input against a defined rules
 *
 * @export
 * @template T Type of form fields
 *
 * @param form The form info for controlling validation
 * @param options: Extra options to control validation process
 * @returns {ValidatedForm<T>}
 */
export function validateForm<T>(form: InputForm<T>, options: ValidateFormOptions = { usePreprocessor: true }): Form<T> {
  const { values, filled, rules } = form;

  const messages = {} as MessageFields<T>;
  let isFormValid = true;

  if (rules.fields) {
    for (const fieldKey in rules.fields) {
      const validator = rules.fields[fieldKey];
      if (validator) {
        const field = values[fieldKey];
        // Do preprocessing first
        const value = options.usePreprocessor ? preprocessFormValue(validator!, field) : field;
        values[fieldKey] = value;

        // Check if required field
        if (validator.required && (value === undefined || (typeof value === 'string' && value.length === 0))) {
          if (filled[fieldKey]) {
            messages[fieldKey] = {
              type: MessageType.ERROR,
              code: FormValidationMessageCode.FIELD_IS_REQUIRED,
              message: DEFAULT_ERRORMESSAGE_FIELD_IS_REQUIRED,
            };
          }
          isFormValid = false;
          continue;
        }

        // Custom validation
        if (validator.validate) {
          const validationResult = validator.validate(value);
          if (validationResult) {
            if (filled[fieldKey]) {
              messages[fieldKey] = validationResult;
            }
            if (isFormValid) {
              isFormValid = validationResult.type !== MessageType.ERROR;
            }
          }
        }
      }
    }
  }

  if (rules.validateForm) {
    // Erase possible old form message
    const formCopy = { ...form } as Form<T>;
    delete formCopy.formMessage;

    const result = rules.validateForm({ isFormValid, values, filled });

    if (result.formMessage && result.isFormValid) {
      result.isFormValid = result.formMessage.type !== MessageType.ERROR;
    }
    return { ...formCopy, ...result, values, messages: { ...messages, ...result.messages } };
  }
  return {
    ...form,
    values,
    messages,
    isFormValid,
  };
}

/**
 * Checks if form has specific type of messages included.
 *
 * @param response Form response object
 * @param type Message type type be checked
 */
export const formHaveMessagesOfType = (response: ValidatedForm<any>, type: MessageType): boolean => {
  if (response.messages) {
    for (const key in response.messages) {
      const field = response.messages[key];
      if (field && field.type === MessageType.ERROR) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Do proprocessing for the field value
 *
 * @param {(FieldValidator | undefined)} validator
 * @param {*} value
 * @returns Preprocessed value
 */
function preprocessFormValue(validator: FieldValidator, value: any) {
  if (!value) {
    return value;
  }
  if (validator.trim && typeof value === 'string') {
    value = value.trim();
  }
  if (validator.preprocess) {
    value = validator.preprocess(value);
  }
  return value;
}
