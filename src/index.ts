/**
 * # ts-form-validation
 *
 * A simple form validation library for typescript users.
 *
 * @author Ville Venäläinen / Mindhive Oy
 */
import deepmerge from 'deepmerge';

export const DEFAULT_ERRORMESSAGE_FIELD_IS_REQUIRED = 'This field is required';

/**
 * Validator definitions for a single form field.
 */
export interface FieldValidator<T, D = any> {
  /**
   * Is field required. Default is false.
   */
  required?: boolean;

  /**
   * Message text to be shown when field has no value but is required. If this field has no value,
   * the default value set on rules will be used or if that is not available the internal default
   * value will be shown.
   */
  requiredText?: string | MessageFunction;
  /**
   * Trim whitespaces from string's begining and end.
   */
  trim?: boolean;
  /**
   * Do custom preprocessing for the form value, before the validation.
   */
  preprocess?: (value?: T) => T;
  /**
   * Validate Fields given value. Return true if the field is valid. If there is an error the result
   * must be andd ValidationMessage object with a proper error message.
   *
   * @returns {true | ValidationMessage} Validate if the field should have some level of message.
   *   If no validation message is given, the method must return ´false´.
   */
  validate?: (value?: T, data?: D) => true | ValidationMessage;
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
  filled?: FilledFormFields<T>;
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

export type FieldValidatorMap<T, D> = Partial<{ [P in keyof T]: FieldValidator<T[P], D> }>;

export enum MessageType {
  /**
   * Field or form contains an error. If any validator, will return a message with this
   * code, the form will be treated as invalid.
   */
  ERROR = 'error',
  /**
   * Field or form contains a state for what user should be warned. Form can still to
   * be valid event if it contains warnings.
   */
  WARNING = 'warning',
  /**
   * Field or form contains a state for what user should be hinted. Form can be treaded valid
   * when containing this kind of messages.
   */
  HINT = 'hint',

  /**
   * Error message given, when validator callback fails with the exception. Exception error
   * message will be included into message.
   */
  VALIDATION_ERROR = 'validation_error',
}

export enum FormValidationMessageCode {
  NONE = 0,
  FIELD_IS_REQUIRED = 1,
  CUSTOM = 100,
  INTERNAL_FIELD_NOT_FOUND = 1000,
  INTERNAL_ERROR = 9999,
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

export type MessageFunction = () => string;
/**
 * Rule definitions for form validation
 */
export interface FormValidationRules<T, D = any> {
  /**
   * Do validation
   */
  validateForm?: (
    form: RequiredFieldValidationFields<T>,
    data?: D,
  ) => {
    isFormValid: boolean;
    /**
     * Field specific messages
     */
    messages: MessageFields<T>;
    /**
     * Message for the whole form
     */
    formMessage?: ValidationMessage;
  };

  /**
   * Field specific validators
   */
  fields?: FieldValidatorMap<T, D>;

  /**
   * Default message texts used on validation cases triggered
   * internally by the form validator
   */
  defaultMessages?: {
    /**
     * Message text shown when field is required, but has no value
     */
    requiredField?: string | MessageFunction;
  };
}

/**
 * Options to control how the form validation flow will be executed.
 *
 * @param T Type of custom data object
 * @param D Type of data object used to deliver custom data to form validation
 */
export interface ValidateFormOptions<T = any, D = any> {
  /**
   * Disable preprocessor. Default value is true
   */
  usePreprocessor?: boolean;

  /**
   * Set listed fields to be filled. Value can be a key of single field,
   * an array of keys or an object with key - boolean pairs. When set
   * with a key name or an array of key names, filled fields will be set to
   * true. With an object notation you can alse set filleds to false.
   */
  setFilled?: keyof T | Array<keyof T> | FilledFormFields<T>;

  /**
   * Set form values
   */
  setValues?: Partial<T>;

  /**
   * custom data to be delivered to form validation. If your form validation
   * requires a domain specific data and you want define the rules object outside of the
   * ui component, you can use this object to deliver required data to validation method.
   */
  data?: D;
}

/**
 * Helpper interface to include form on state object. Just extend the
 * State type with the interface.
 */
export interface WithForm<FormType> {
  form: Form<FormType>;
}

/**
 * Make a deep copy of an object. If there is no value an empty object will be created
 */
function deepcopy<T>(value: T | undefined): T {
  return value ? (deepmerge(value, {}) as T) : ({} as T);
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
// tslint:disable-next-line: cognitive-complexity
export function validateForm<T>(form: InputForm<T>, options: ValidateFormOptions = { usePreprocessor: true }): Form<T> {
  const formCopy: Form<T> = {
    filled: deepcopy(form.filled),
    values: deepcopy<T>(form.values),
    rules: form.rules,
    messages: {} as MessageFields<T>,
    isFormValid: false,
  };

  const { rules } = formCopy;
  let { values } = formCopy;
  // filled can not be undefined here because of deepcopy above but typescript doesn't notice that
  let filled = formCopy.filled as Partial<BooleanMap<T>>;

  if (options.setFilled) {
    if (Array.isArray(options.setFilled)) {
      for (const fieldKey of options.setFilled) {
        filled[fieldKey] = true;
      }
    } else {
      switch (typeof options.setFilled) {
        case 'string':
          filled[options.setFilled] = true;
          break;
        case 'object':
          formCopy.filled = filled = {
            ...filled,
            ...(options.setFilled as any),
          };
          break;
        default:
          throw new Error(
            'Unexped type for setFilled. Should be an array of strings or a single string pointing to value field.',
          );
      }
    }
  }

  if (options.setValues) {
    formCopy.values = values = {
      ...values,
      ...options.setValues,
    } as T;
  }

  // TODO refactor in to sub functions
  const messages = {} as MessageFields<T>;
  let isFormValid = true;

  if (rules.fields) {
    for (const fieldKey in rules.fields) {
      const key = fieldKey as keyof T;
      const validator = rules.fields[key];
      if (validator !== undefined) {
        const field = values[key];
        // Do preprocessing first
        // tslint:disable-next-line: no-useless-cast
        const value = options.usePreprocessor !== false ? preprocessFormValue(validator!, field) : field;

        values[key] = value;

        // Check if required field
        if (validator.required && (value === undefined || (typeof value === 'string' && value.length === 0))) {
          if (filled[key]) {
            messages[key] = getRequiredFieldErrorMessage(rules, key);
          }
          isFormValid = false;
          continue;
        }

        // Custom validation
        if (validator.validate) {
          const validationResult = validator.validate(value, options.data);

          switch (typeof validationResult) {
            case 'boolean':
              if ((validationResult as any) === false) {
                console.warn(
                  `validate method's notation have been changed to true | ValidationMessage since 2.0. Please refactor the validation methods to new notation.`,
                );
              }
              break;

            case 'object':
              if (filled[fieldKey]) {
                messages[fieldKey] = validationResult;
              }
              if (isFormValid) {
                isFormValid = validationResult.type !== MessageType.ERROR;
              }
              break;

            default:
              throw new Error(`Unexpected return type from ${fieldKey} -validator: ${typeof validationResult}`);
          }
        }
      }
    }
  }

  if (rules.validateForm) {
    // Erase possible old form message
    delete formCopy.formMessage;

    const result = rules.validateForm({ isFormValid, values, filled }, options.data);

    if (result.formMessage && result.isFormValid) {
      result.isFormValid = result.formMessage.type !== MessageType.ERROR;
    }
    return {
      ...formCopy,
      ...result,
      filled,
      values,
      messages: { ...messages, ...result.messages },
    };
  }
  return {
    ...formCopy,
    values,
    filled,
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

function getRequiredFieldErrorMessage<T>(rules: FormValidationRules<T>, fieldKey: keyof T): MessageField {
  try {
    const fields = rules.fields || ({} as T);
    const field = fields[fieldKey] as FieldValidator<T>;
    if (!field) {
      return {
        type: MessageType.VALIDATION_ERROR,
        code: FormValidationMessageCode.INTERNAL_FIELD_NOT_FOUND,
        message: '',
      };
    }

    let message =
      field.requiredText ||
      (rules.defaultMessages && rules.defaultMessages.requiredField) ||
      DEFAULT_ERRORMESSAGE_FIELD_IS_REQUIRED;

    if (typeof message === 'function') {
      message = message();
    }
    return {
      type: MessageType.ERROR,
      code: FormValidationMessageCode.FIELD_IS_REQUIRED,
      message,
    };
  } catch (error) {
    return {
      type: MessageType.VALIDATION_ERROR,
      code: FormValidationMessageCode.INTERNAL_ERROR,
      message: error,
    };
  }
}

/**
 * Do proprocessing for the field value
 *
 * @param {(FieldValidator | undefined)} validator
 * @param {*} value
 * @returns Preprocessed value
 */
function preprocessFormValue<T>(validator: FieldValidator<T>, value: any) {
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
