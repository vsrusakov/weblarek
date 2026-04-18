import { Form, IFormChangeData } from './Form';
import { ensureAllElements, ensureElement, isPaymentChosen, isInputFilled } from '../../../utils/utils.ts';
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

    this.formElement.addEventListener('change', () => {
      const changeData: IFormChangeData = { 
        validateFunc: this.validateChange.bind(this),
        submitButton: this.submitButton,
        formView: this 
      }
      this.events.emit('form:change', changeData);
    });

    this.formElement.addEventListener('click', (event) => {
      if (event.target instanceof HTMLButtonElement && this.orderButtons.includes(event.target)) {
        const changeData: IFormChangeData = { 
          validateFunc: this.validateChange.bind(this),
          submitButton: this.submitButton,
          formView: this 
        }
        this.events.emit('form:change', changeData);
      }
    });

    this.formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit('orderForm:submit', { formElement: this.formElement, orderButtons: this.orderButtons });
    });
  }

  validateChange(): string | undefined {
      let errorMessage;

      if (!isPaymentChosen(this.orderButtons)) {
        errorMessage = 'Не выбран вид оплаты';
      } else if (!isInputFilled(this.addressInput)) {
        errorMessage = 'Необходимо указать адрес';
      }
      return errorMessage;
  }

  reset() {
    this.formElement.reset();
    this.orderButtons.forEach((btn) => btn.classList.remove('button_alt-active'));
    this.errors = '';
  }
}