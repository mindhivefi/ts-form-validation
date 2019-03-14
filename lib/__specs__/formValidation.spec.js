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
import { DEFAULT_ERRORMESSAGE_FIELD_IS_REQUIRED, FormValidationMessageCode, MessageType, validateForm, } from '../';
describe('Handling form validation', function () {
    it('Will not validate, if field is not set to filled', function () {
        var input = {
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
        expect(validateForm(input)).toEqual(__assign({}, input, { messages: {}, isFormValid: false }));
    });
    describe('Required fields', function () {
        it('Will fail if required field is not filled', function () {
            var input = {
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
            expect(validateForm(input)).toEqual(__assign({}, input, { messages: {
                    a: {
                        type: MessageType.ERROR,
                        code: FormValidationMessageCode.FIELD_IS_REQUIRED,
                        message: DEFAULT_ERRORMESSAGE_FIELD_IS_REQUIRED,
                    },
                }, isFormValid: false }));
        });
        it('Will fail if required field is empty', function () {
            var input = {
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
            expect(validateForm(input)).toEqual(__assign({}, input, { messages: {
                    a: {
                        type: MessageType.ERROR,
                        code: FormValidationMessageCode.FIELD_IS_REQUIRED,
                        message: DEFAULT_ERRORMESSAGE_FIELD_IS_REQUIRED,
                    },
                }, isFormValid: false }));
        });
        it('Will show user defined error message defined in the fields rule ', function () {
            var input = {
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
            expect(validateForm(input)).toEqual(__assign({}, input, { messages: {
                    a: {
                        type: MessageType.ERROR,
                        code: FormValidationMessageCode.FIELD_IS_REQUIRED,
                        message: 'Not good',
                    },
                }, isFormValid: false }));
        });
        it('Will show default error message for required field when it is defined in rules default messages.', function () {
            var input = {
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
                        requiredField: 'Default not good',
                    },
                },
            };
            expect(validateForm(input)).toEqual(__assign({}, input, { messages: {
                    a: {
                        type: MessageType.ERROR,
                        code: FormValidationMessageCode.FIELD_IS_REQUIRED,
                        message: 'Default not good',
                    },
                }, isFormValid: false }));
        });
        it('Will show user defined error function content defined in the fields rule ', function () {
            var input = {
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
                            requiredText: function () { return 'Not good'; },
                        },
                    },
                },
            };
            expect(validateForm(input)).toEqual(__assign({}, input, { messages: {
                    a: {
                        type: MessageType.ERROR,
                        code: FormValidationMessageCode.FIELD_IS_REQUIRED,
                        message: 'Not good',
                    },
                }, isFormValid: false }));
        });
        it('Will show default error function content for required field when it is defined in rules default messages.', function () {
            var input = {
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
                        requiredField: function () { return 'Default not good'; },
                    },
                },
            };
            expect(validateForm(input)).toEqual(__assign({}, input, { messages: {
                    a: {
                        type: MessageType.ERROR,
                        code: FormValidationMessageCode.FIELD_IS_REQUIRED,
                        message: 'Default not good',
                    },
                }, isFormValid: false }));
        });
    });
    describe('Custom validation function', function () {
        it('Custom Validation Function will match', function () {
            var input = {
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
                            validate: function (value) {
                                return value && value === '123'
                                    ? false
                                    : { type: MessageType.ERROR, message: 'Douh!' };
                            },
                        },
                    },
                },
            };
            expect(validateForm(input)).toEqual(__assign({}, input, { messages: {}, isFormValid: true }));
        });
        it('Custom Validation Function will fail', function () {
            var input = {
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
                            validate: function (value) {
                                return value && value === 'wrong'
                                    ? false
                                    : { type: MessageType.ERROR, message: 'Douh!' };
                            },
                        },
                    },
                },
            };
            expect(validateForm(input)).toEqual(__assign({}, input, { messages: {
                    a: {
                        type: MessageType.ERROR,
                        message: 'Douh!',
                    },
                }, isFormValid: false }));
        });
    });
    describe('Form Validation Function', function () {
        it('will handle succeed validation', function () {
            var input = {
                values: {
                    a: '123',
                    b: '123',
                },
                filled: {
                    a: true,
                    b: true,
                },
                rules: {
                    validateForm: function () {
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
            expect(validateForm(input)).toEqual(__assign({}, input, { messages: {}, isFormValid: true }));
        });
        it('will handle failed validation', function () {
            var input = {
                values: {
                    a: '123',
                    b: '234',
                },
                filled: {
                    a: true,
                    b: true,
                },
                rules: {
                    validateForm: function (form) {
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
            expect(validateForm(input)).toEqual(__assign({}, input, { messages: {
                    a: {
                        type: MessageType.WARNING,
                        message: 'Values do not match',
                    },
                }, formMessage: {
                    type: MessageType.WARNING,
                    message: 'a and b must match',
                }, isFormValid: false }));
        });
        it('will handle form as invalid, if validateForm will return error message event if isFormValid = true', function () {
            var input = {
                values: {
                    a: '123',
                    b: '234',
                },
                filled: {
                    a: true,
                    b: true,
                },
                rules: {
                    validateForm: function (form) {
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
            expect(validateForm(input)).toEqual(__assign({}, input, { formMessage: {
                    type: MessageType.ERROR,
                    message: 'error',
                }, messages: {}, isFormValid: false }));
        });
    });
    describe('Form Valid State Checks', function () {
        it('will treat form valid, if all fields are valid event if they are not marked filled', function () {
            var input = {
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
            expect(validateForm(input)).toEqual(__assign({}, input, { messages: {}, isFormValid: true }));
        });
    });
    it('will treat form as invalid, if some of fields are not even if they are not marked filled', function () {
        var input = {
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
        expect(validateForm(input)).toEqual(__assign({}, input, { messages: {}, isFormValid: false }));
    });
    it('will treat form as valid, if all field validators give valid result event if the fields are not marked as filled', function () {
        var input = {
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
        expect(validateForm(input)).toEqual(__assign({}, input, { messages: {}, isFormValid: true }));
    });
    it('will treat form valid, if it only have other messages than errors', function () {
        var input = {
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
                        validate: function (value) { return ({
                            type: MessageType.WARNING,
                            message: 'be careful',
                        }); },
                    },
                    b: {
                        validate: function (value) { return ({
                            type: MessageType.HINT,
                            message: 'look into mirror',
                        }); },
                    },
                },
            },
        };
        expect(validateForm(input)).toEqual(__assign({}, input, { messages: {
                a: {
                    message: 'be careful',
                    type: 'warning',
                },
                b: {
                    message: 'look into mirror',
                    type: 'hint',
                },
            }, isFormValid: true }));
    });
});
//# sourceMappingURL=formValidation.spec.js.map