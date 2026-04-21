import { Form } from './Form';
import { ensureElement } from '../../../utils/utils.ts';
import { IEvents } from '../../base/Events.ts';

export class ContactsForm extends Form {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

    this.formElement.addEventListener('input', () => {
      this.events.emit('form:changed', { 
        email: this.emailInput.value,
        phone: this.phoneInput.value
      });
    });

    this.formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit('contactsForm:submit');
    });
  }
}