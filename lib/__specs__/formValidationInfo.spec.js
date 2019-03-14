import { MessageType } from '..';
import { formHaveMessagesOfType } from '../index';
describe('Form State Info', function () {
    describe('Form info helper functions', function () {
        it('Tells if form has errors', function () {
            expect(formHaveMessagesOfType({
                values: {},
                messages: {
                    hint: {
                        type: MessageType.HINT,
                        message: 'hint',
                    },
                    warning: {
                        type: MessageType.WARNING,
                        message: 'warning',
                    },
                    error: {
                        type: MessageType.ERROR,
                        message: 'error',
                    },
                },
                isFormValid: false,
            }, MessageType.ERROR)).toBe(true);
        });
        it('Tells if form has no warnings', function () {
            expect(formHaveMessagesOfType({
                values: {},
                messages: {
                    hint: {
                        type: MessageType.HINT,
                        message: 'hint',
                    },
                    error: {
                        type: MessageType.HINT,
                        message: 'hint 2',
                    },
                },
                isFormValid: false,
            }, MessageType.WARNING)).toBe(false);
        });
    });
});
//# sourceMappingURL=formValidationInfo.spec.js.map