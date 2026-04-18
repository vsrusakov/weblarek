import { Card, ICardActions, IRenderData } from './Card'
import { ensureElement } from '../../../utils/utils.ts';


export class BasketCard extends Card<IRenderData> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
    
    if (actions?.onClick) {
      this.deleteButton.addEventListener('click', actions.onClick);
    }
  }

  set index(index: number) {
    this.indexElement.textContent = index.toString();
  }
}