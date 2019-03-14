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
import { validateForm } from '../';
describe('Form preprocessing', function () {
    it('If trim is set, whitespaces will be removed from start and end of the field value', function () {
        var input = {
            values: {
                a: '  cat  ',
            },
            filled: {
                a: true,
            },
            rules: {
                fields: {
                    a: {
                        trim: true,
                    },
                },
            },
        };
        expect(validateForm(input)).toEqual(__assign({}, input, { values: {
                a: 'cat',
            }, messages: {}, isFormValid: true }));
    });
    it('Will call preprocessor method if it defined for the field', function () {
        var input = {
            values: {
                a: 'cat',
            },
            filled: {
                a: true,
            },
            rules: {
                fields: {
                    a: {
                        preprocess: function (value) { return value + "fish"; },
                    },
                },
            },
        };
        expect(validateForm(input)).toEqual(__assign({}, input, { values: {
                a: 'catfish',
            }, messages: {}, isFormValid: true }));
    });
});
//# sourceMappingURL=formPreprocessing.spec.js.map