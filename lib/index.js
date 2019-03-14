/**
 * # ts-form-validation
 *
 * A simple form validation library for typescript users.
 *
 * @author Ville Venäläinen / Mindhive Oy
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
export var DEFAULT_ERRORMESSAGE_FIELD_IS_REQUIRED = 'This field is required';
/**
 * Initialize form with default set
 */
export var initForm = function (values, rules) { return ({
    values: values,
    filled: {},
    messages: {},
    rules: rules,
    isFormValid: false,
}); };
export var MessageType;
(function (MessageType) {
    /**
     * Field or form contains an error. If any validator, will return a message with this
     * code, the form will be treated as invalid.
     */
    MessageType["ERROR"] = "error";
    /**
     * Field or form contains a state for what user should be warned. Form can still be
     * be valid event if it contains warnings.
     */
    MessageType["WARNING"] = "warning";
    /**
     * Field or form contains a state for what user should be hinted. Form can be treaded valid
     * when containing this kind of messages.
     */
    MessageType["HINT"] = "hint";
    /**
     * Error message given, when validator callback fails with the exception. Exception error
     * message will be included into message.
     */
    MessageType["VALIDATION_ERROR"] = "validation_error";
})(MessageType || (MessageType = {}));
export var FormValidationMessageCode;
(function (FormValidationMessageCode) {
    FormValidationMessageCode[FormValidationMessageCode["NONE"] = 0] = "NONE";
    FormValidationMessageCode[FormValidationMessageCode["FIELD_IS_REQUIRED"] = 1] = "FIELD_IS_REQUIRED";
    FormValidationMessageCode[FormValidationMessageCode["CUSTOM"] = 100] = "CUSTOM";
    FormValidationMessageCode[FormValidationMessageCode["INTERNAL_FIELD_NOT_FOUND"] = 1000] = "INTERNAL_FIELD_NOT_FOUND";
    FormValidationMessageCode[FormValidationMessageCode["INTERNAL_ERROR"] = 9999] = "INTERNAL_ERROR";
})(FormValidationMessageCode || (FormValidationMessageCode = {}));
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
export function validateForm(form, options) {
    if (options === void 0) { options = { usePreprocessor: true }; }
    var values = form.values, filled = form.filled, rules = form.rules;
    var messages = {};
    var isFormValid = true;
    if (rules.fields) {
        for (var fieldKey in rules.fields) {
            var validator = rules.fields[fieldKey];
            if (validator) {
                var field = values[fieldKey];
                // Do preprocessing first
                var value = options.usePreprocessor
                    ? preprocessFormValue(validator, field)
                    : field;
                values[fieldKey] = value;
                // Check if required field
                if (validator.required &&
                    (value === undefined ||
                        (typeof value === 'string' && value.length === 0))) {
                    if (filled[fieldKey]) {
                        messages[fieldKey] = getRequiredFieldErrorMessage(rules, fieldKey);
                    }
                    isFormValid = false;
                    continue;
                }
                // Custom validation
                if (validator.validate) {
                    var validationResult = validator.validate(value);
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
        var formCopy = __assign({}, form);
        delete formCopy.formMessage;
        var result = rules.validateForm({ isFormValid: isFormValid, values: values, filled: filled });
        if (result.formMessage && result.isFormValid) {
            result.isFormValid = result.formMessage.type !== MessageType.ERROR;
        }
        return __assign({}, formCopy, result, { values: values, messages: __assign({}, messages, result.messages) });
    }
    return __assign({}, form, { values: values,
        messages: messages,
        isFormValid: isFormValid });
}
/**
 * Checks if form has specific type of messages included.
 *
 * @param response Form response object
 * @param type Message type type be checked
 */
export var formHaveMessagesOfType = function (response, type) {
    if (response.messages) {
        for (var key in response.messages) {
            var field = response.messages[key];
            if (field && field.type === MessageType.ERROR) {
                return true;
            }
        }
    }
    return false;
};
function getRequiredFieldErrorMessage(rules, fieldKey) {
    try {
        var fields = rules.fields || {};
        var field = fields[fieldKey];
        if (!field) {
            return {
                type: MessageType.VALIDATION_ERROR,
                code: FormValidationMessageCode.INTERNAL_FIELD_NOT_FOUND,
                message: '',
            };
        }
        var message = field.requiredText ||
            (rules.defaultMessages && rules.defaultMessages.requiredField) ||
            DEFAULT_ERRORMESSAGE_FIELD_IS_REQUIRED;
        if (typeof message === 'function') {
            message = message();
        }
        return {
            type: MessageType.ERROR,
            code: FormValidationMessageCode.FIELD_IS_REQUIRED,
            message: message,
        };
    }
    catch (error) {
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
function preprocessFormValue(validator, value) {
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
//# sourceMappingURL=index.js.map