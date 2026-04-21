import { Card, IRenderData } from './Card'
import { ensureElement, isPriceless } from '../../../utils/utils.ts';
import { categoryMap } from '../../../utils/constants.ts';
import { IProduct } from '../../../types/index.ts';
import { IEvents } from '../../base/Events.ts';

type TPreviewCard = Pick<IProduct, "image" | "category" | "description"> & IRenderData;
type TButtonText = 'buy' | 'remove';

export class PreviewCard extends Card<TPreviewCard> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buyButton: HTMLButtonElement;

  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.buyButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.buyButton.addEventListener('click', () => {
      this.events.emit('previewCard:buy');
    });

  }

  set image(src: string) {
    this.setImage(this.imageElement, src);
  }

  set category(category: string) {
    this.categoryElement.textContent = category;

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as keyof typeof categoryMap],
        key === category
      );
    }
  }

  set description(description: string) {
    this.descriptionElement.textContent = description;
  }

  set buttonText(text: TButtonText) {
    this.buyButton.textContent = text === 'buy' ? 'Купить' : 'Удалить из корзины';
  }

  render(data?: Partial<TPreviewCard>): HTMLElement {
    super.render(data);

    if (isPriceless(this.priceElement.textContent)) {
      this.buyButton.textContent = 'Недоступно';
      this.buyButton.disabled = true;
    }
    return this.container;
  }
}