import { Form } from './Form';
import { ensureAllElements, ensureElement } from '../../../utils/utils.ts';
import { IEvents } from '../../base/Events.ts';
import { TPayment } from '../../../types/index.ts';

export class OrderForm extends Form {
  protected orderButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.orderButtons = ensureAllElements<HTMLButtonElement>('.order__buttons .button', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

    this.orderButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const payment = button.classList.contains('button_alt-active') ? '' : button.name;
        this.events.emit('form:changed', { payment: payment });
      });
    });

    this.addressInput.addEventListener('input', () => {
      this.events.emit('form:changed', { address: this.addressInput.value });
    });

    this.formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit('orderForm:submit');
    });
  }

  setActivePaymentButton(payment: TPayment) {
    this.orderButtons.forEach(btn => {
      btn.classList.toggle('button_alt-active', btn.name === payment)
    })
  }

  reset() {
    super.reset();
    this.orderButtons.forEach((btn) => btn.classList.remove('button_alt-active'));
  }
}