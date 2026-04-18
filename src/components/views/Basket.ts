import { Component } from '../base/Component.ts';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils.ts';

interface IBasketData {
  items: HTMLLIElement[];
  totalPrice: number;
}

export class Basket extends Component<IBasketData> {
  protected itemsListElement: HTMLUListElement;
  protected makeOrderButton: HTMLButtonElement;
  protected totalPriceElement: HTMLUListElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.itemsListElement = ensureElement<HTMLUListElement>('.basket__list', this.container);
    this.makeOrderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.totalPriceElement = ensureElement<HTMLUListElement>('.basket__price', this.container);

    this.makeOrderButton.addEventListener('click', () => {
      this.events.emit('basket:makeOrder');
    });
  }

  set items(items: HTMLLIElement[]) {
    this.itemsListElement.replaceChildren(...items);
  }

  set totalPrice(price: string) {
    this.totalPriceElement.textContent = `${price} синапсов`;
  }

  render(data?: Partial<IBasketData>): HTMLElement {
    super.render(data);
    this.makeOrderButton.disabled = this.itemsListElement.children.length === 0;
    return this.container;
  }
}