import { Form, IFormChangeData } from './Form';
import { ensureElement, isInputFilled } from '../../../utils/utils.ts';
import { IEvents } from '../../base/Events.ts';

export class ContactsForm extends Form {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

    this.formElement.addEventListener('change', () => {
      const changeData: IFormChangeData = { 
        validateFunc: this.validateChange.bind(this),
        submitButton: this.submitButton,
        formView: this 
      }
      this.events.emit('form:change', changeData);
    });

    this.formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit('contactsForm:submit', this.formElement);
    });
  }

  validateChange(): string | undefined {
      let errorMessage;

      if (!isInputFilled(this.emailInput)) {
        errorMessage = 'Укажите email';
      } else if (!isInputFilled(this.phoneInput)) {
        errorMessage = 'Укажите телефон';
      }
      return errorMessage;
  }

  reset() {
    this.formElement.reset();
    this.errors = '';
  }
}