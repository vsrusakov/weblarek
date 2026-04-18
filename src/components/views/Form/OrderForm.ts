import { Form } from './Form';
import { ensureAllElements, ensureElement } from '../../../utils/utils.ts';
import { IEvents } from '../../base/Events.ts';

export class OrderForm extends Form {
  protected orderButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.orderButtons = ensureAllElements<HTMLButtonElement>('.order__buttons .button', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

    this.orderButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        button.classList.toggle('button_alt-active');
        this.orderButtons.forEach((btn) => {
          if (btn !== button) {
            btn.classList.remove('button_alt-active');
          }
        });
      });
    });

    this.formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit('orderForm:submit', { formElement: this.formElement, orderButtons: this.orderButtons });
    });
  }

  reset() {
    this.formElement.reset();
    this.orderButtons.forEach((btn) => btn.classList.remove('button_alt-active'));
    this.errors = '';
  }
}