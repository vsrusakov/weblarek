import { Component } from '../base/Component.ts';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils.ts';

interface IOrderSuccessData {
  totalCost: number;
}

export class OrderSuccess extends Component<IOrderSuccessData> {
  protected descriptionElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    this.closeButton.addEventListener('click', () => {
      this.events.emit('orderSuccess:close');
    });
  }

  set totalCost(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}