/**
 * # ts-form-validation
 *
 * A simple form validation library for typescript users.
 *
 * @author Ville Venäläinen / Mindhive Oy
 */
export declare const DEFAULT_ERRORMESSAGE_FIELD_IS_REQUIRED = "This field is required";
/**
 * Validator definitions for a single form field.
 */
export interface FieldValidator {
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
    preprocess?: (value: any) => any;
    /**
     * Validate Fields given value.
     *
     * @returns {false | ValidationMessage} Validate if the field should have some level of message. If no validation message is given, the method must return ´false´.
     */
    validate?: (value: any) => false | ValidationMessage;
}
/**
 * Initialize form with default set
 */
export declare const initForm: <T>(values: T, rules: FormValidationRules<T>) => Form<T>;
export interface Form<T> extends InputForm<T>, ValidatedForm<T> {
}
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
declare type BooleanMap<T> = {
    [P in keyof T]?: boolean;
};
declare type MapType<T, U> = {
    [P in keyof T]?: U;
};
export declare type FieldValidatorMap<T> = Partial<{
    [P in keyof T]: FieldValidator;
}>;
export declare enum MessageType {
    /**
     * Field or form contains an error. If any validator, will return a message with this
     * code, the form will be treated as invalid.
     */
    ERROR = "error",
    /**
     * Field or form contains a state for what user should be warned. Form can still be
     * be valid event if it contains warnings.
     */
    WARNING = "warning",
    /**
     * Field or form contains a state for what user should be hinted. Form can be treaded valid
     * when containing this kind of messages.
     */
    HINT = "hint",
    /**
     * Error message given, when validator callback fails with the exception. Exception error
     * message will be included into message.
     */
    VALIDATION_ERROR = "validation_error"
}
export declare enum FormValidationMessageCode {
    NONE = 0,
    FIELD_IS_REQUIRED = 1,
    CUSTOM = 100,
    INTERNAL_FIELD_NOT_FOUND = 1000,
    INTERNAL_ERROR = 9999
}
/**
 * Set of message types triggered in validatio
 */
export declare type MessageTypeSet = {
    [P in keyof MessageType]: true;
};
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
export declare type MessageField = false | ValidationMessage;
/**
 * Set of message fields
 */
export declare type MessageFields<T> = MapType<T, MessageField>;
/**
 * Set of fields with a value filled by the user
 */
export declare type FilledFormFields<T> = Partial<BooleanMap<T>>;
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
export declare type MessageFunction = () => string;
/**
 * Rule definitions for form validation
 */
export interface FormValidationRules<T> {
    /**
     * Do validation
     */
    validateForm?: (form: RequiredFieldValidationFields<T>) => {
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
    fields?: Partial<FieldValidatorMap<T>>;
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
export declare function validateForm<T>(form: InputForm<T>, options?: ValidateFormOptions): Form<T>;
/**
 * Checks if form has specific type of messages included.
 *
 * @param response Form response object
 * @param type Message type type be checked
 */
export declare const formHaveMessagesOfType: (response: ValidatedForm<any>, type: MessageType) => boolean;
export {};
