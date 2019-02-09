/**
 * # td-form-validation
 *
 * A simple form validation library for typescript users.
 *
 * @author Ville Venäläinen / Mindhive Oy
 */

export const DEFAULT_ERRORMESSAGE_FIELD_IS_REQUIRED = 'This field is required';

export interface FieldValidator {
  /**
   * Is field required. Default is false.
   */
  required?: boolean;
  trim?: boolean;
  preprocess?: (value: any) => any;
  validate?: (value: any) => MessageField;
}

/**
 * Definition of the form to be validated
 */
export interface Form<T> {
  /**
   * Current form values to be validated
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
   * Error code if any available
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

export interface FormValidationFields<T> {
  values: T;
  messages: MessageFields<T>;
  isFormValid: boolean;
}

export interface RequiredFieldValidationFields<T> {
  values: T;
  filled: FilledFormFields<T>;
  isFormValid: boolean;
}

export interface FormValidationRules<T> {
  validateForm?: (
    form: RequiredFieldValidationFields<T>,
  ) => {
    isFormValid: boolean;
    messages: MessageFields<T>;
    formMessage?: ValidationMessage;
  };

  fields?: Partial<FieldValidatorMap<T>>;
}

/**
 * Validate form input against the rules defined
 *
 * @export
 * @template T Type of form fields
 *
 * @returns {FormValidationFields<T>}
 */
export function validateFormFields<T>(form: Form<T>): FormValidationFields<T> {
  const { values, filled, rules } = form;

  let messages = {} as MessageFields<T>;
  let isFormValid = !rules.fields || areRequiredFieldsFilled(values, filled, rules.fields);

  if (rules.fields) {
    for (const fieldKey in rules.fields) {
      const validator = rules.fields[fieldKey];
      if (validator) {
        if (!filled[fieldKey]) {
          continue;
        }
        const field = values[fieldKey];
        // Check if required field
        if (validator.required && (field === undefined || (typeof field === 'string' && field.length === 0))) {
          messages[fieldKey] = {
            type: MessageType.ERROR,
            code: FormValidationMessageCode.FIELD_IS_REQUIRED,
            message: DEFAULT_ERRORMESSAGE_FIELD_IS_REQUIRED,
          };
          isFormValid = false;
          continue;
        }
        // Do preprocessing first
        const value = preprocessFormValue(validator!, field);
        values[fieldKey] = value;

        // Custom validtion
        if (validator.validate) {
          const validation = validator.validate(value);
          if (validation) {
            messages[fieldKey] = validation;
            isFormValid = false;
          }
        }
      }
    }
  }

  if (rules.validateForm) {
    const result = rules.validateForm({ isFormValid, values, filled });
    if (!result.isFormValid) {
      result.messages = { ...messages, ...result.messages };
      result.isFormValid = false;
    }
    return { values, ...result };
  }
  return {
    values,
    messages,
    isFormValid,
  };
}

/**
 * De proprocessing for the field value
 *
 * @param {(FieldValidator | undefined)} validator
 * @param {*} value
 * @returns
 */
function preprocessFormValue(validator: FieldValidator, value: any) {
  if (!value) {
    return undefined;
  }
  if (validator.trim && typeof value === 'string') {
    value = value.trim();
  }
  if (validator.preprocess) {
    value = validator.preprocess(value);
  }
  return value;
}

/**
 * Check if the fields that are marked as required have an input.
 *
 * @export
 * @template T
 * @param {T} values
 * @param {FilledFormFields<T>} filled
 * @param {Partial<FieldValidatorMap<T>>} validatorMap
 * @returns {boolean}
 */
export function areRequiredFieldsFilled<T>(
  values: T,
  filled: FilledFormFields<T>,
  validatorMap: Partial<FieldValidatorMap<T>>,
): boolean {
  for (const key in validatorMap) {
    if (key) {
      const validator = validatorMap[key];
      if (validator && validator.required) {
        if (!filled[key]) {
          return false;
        }
        const value = values[key];
        const fieldFilled = value && (typeof value === 'string' ? value.trim().length > 0 : true);
        if (!fieldFilled) {
          return false;
        }
      }
    }
  }
  return true;
}
