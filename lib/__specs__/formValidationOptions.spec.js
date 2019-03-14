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
import { validateForm } from '..';
describe('Form Validation Options', function () {
    describe('Preprocessing', function () {
        it('If turned off, no preprocessing will be done', function () {
            var input = {
                values: {
                    a: '  123',
                    b: '234',
                },
                filled: {
                    a: true,
                    b: true,
                },
                rules: {},
            };
            expect(validateForm(input, {
                usePreprocessor: false,
            })).toEqual(__assign({}, input, { messages: {}, isFormValid: true }));
        });
    });
});
//# sourceMappingURL=formValidationOptions.spec.js.map