# ts-form-validation

This is a simple framework to do form validation using Typescript's magnificent strong typing features. Framework focuses only to validation of values and informing the state of the form. It is totally ui-implementation independent.

## Installation

All you need to do is to:

```bash
yarn add --dev ts-form-validation
```

or

```bash
npm install -D ts-form-validation
```

## Using validator

The whole validation is based on a type interface defined by you, whick will contain all the fields that are used in your form. This might be easier to explain with an example. Lets build a registration form:

### 1. Define the type for the form

Define a interface which will contain all fields that are in your form:

```typescript
interface RegisterForm {
  displayName: string;
  email: string;
  photoURL?: string;
  password1: string;
  password2: string;
}
```

### 2. Define rules for your fields

Rules are defined with an object that is based on your interface created before:

```typescript
const rules: FormValidationRules<RegisterForm> {
  fields: {
    displayName: {
      required: true,
      trim: true,
    },
    email: {
      required: true,
      trim: true,
      validate: (value: any) => isValidEmail(value)
    },
    password1: {
      required: true,
      validate: (value: any) => isValidPassword(value)
    },
    password2: {
      required: true,
      validate: (value: any) => isValidPassword(value)
    },
  }
};
```

Now you have the basic checking for form fields. All fields exept the photoURL -fields are required. Notice that `isValidEmail` and `isValidPassword` -functions are here imaginary, you can use some library or do your own implementation to handle the actual type checking. This framework only helps you with the structyre and strong typing.

### 3. Validation rule to check interdependant rules on form

On registration form, it is important that the user will write the same password twice. This requires the code to match values between to different fields. This can be fone with `validateForm` -event handler. So we will add a handler for that to rules object:

```typescript
const rules: FormValidationRules<RegisterForm> {
  validateForm: form => {
    const { filled, values, isFormValid } = form;

      // If user has not yet given the input for fields, we will do no validation
      if (!(filled.password1 && filled.password2)) {
        return false;
      }

      // Do the actual check if password match
      if (values.password1 === values.password2) {
        return false;
      }

      return {
        isFormValid: false,
        messages: {
          password1: 'Please check the password',
          password2: 'Please check the password',
        }
        formMessage: {
          type: MessageType.ERROR,
          message: 'Passwords do not match',
        }
      }
    },
  // Field definitions continue here
  fields: {
    displayName: {
      required: true,
      trim: true,
    },
    ...
  }
};
```

The `validateForm` -handler will be called after all field validators have been triggered. The method must return `false`, when form validation will not find anything to notice. When there are some messages that we must inform to user, we can set a message for specific field on messages -object with the same key that the field has. In this example we will set an error message for both password -fields. There is also `formMessage` -field, where you can locale a general message that is targeted for the whole form.

The message interface supports three kind of messages:

```typescript
export interface ValidationMessage {
  /**
   * Type of the error message.
   */
  type: MessageType;

  /**
   * Message code if any available
   */
  code?: FormValidationMessageCode;
  /**
   * The actual message
   */
  message: string;
}
```

Currently supported message types are INFO, WARNING and ERROR. It up to you how you use them in the user interface.

### 4. Adding preprocessing for form fields

It is possible to do basic trimming for input or add your own pre processor events for fields. A common case that is needed for form input is to trim white spaces away from start and the end of the text. This can be done simply adding a `trim: true`-field for a field that must be trimmed. We already used this feature in the example above like this:

```typescript
  email: {
    required: true,
    trim: true,
    validate: (value: any) => isValidEmail(value)
  },
```

To add a custom preprocessor, just add event `preprocess`-event handler to field like this:

```typescript
  currency: {
    required: true,
    trim: true,
    preprocess: (value: string) => value.toUppercase(),
  },
You can use trim and custom event handler together. When you use trim also, the value that your custom event handler will receive will already be trimmed.
```

### 5. Filled - letting the user to finnish writing before validating

So that we will not make the user irritated, we must be able the define when a field is ready to be validated. For that reason, this framwwork has a `filled` -set on form definition. When you know that the user has given an input that is ready to be validated, you just set a form field's key to true in this set. After that the validation will be executed for that fields on each call. Normally this will be set to true, in form field's `onBlur`-event handled which will happend when user will leave the field.

## Example using validation with React and Material-ui

With react, its natural to make an own component for the form. Let's make a component to support the register form that we created above:

```typescript
interface State {
  form: Form<RegisterForm>; // We use the form interface defined before
}

export default class RegisterScreen extends React.Component<any, State> {
  public static = {
    form: {
      // Let's define the initial values for the form fields
      values: {
        displayName: '',
        email: '',
        password1: '',
        password2: '',
        photoURL: '',
      },
      // Initally no field is filled by the user
      filled: {},
      // we will use the rules defined before
      rules,
    },
  };

  public render() {
    const {
      form: { values, filled, messages },
    } = this.state;

    return (
      <>
        <input onChange={this.handleChange('displayName')} value={values.displayName} />
        {this.renderMessage(displayName)}
      </>
    );
  }
}
```

Please check [fully functional demo](https://github.com/mindhivefi/ts-form-validation-demo.) for this example in its own repo.
