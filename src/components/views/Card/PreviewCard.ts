import { Card, ICardActions } from './Card'
import { ensureElement } from '../../../utils/utils.ts';
import { categoryMap } from '../../../utils/constants.ts';
import { IProduct } from '../../../types/index.ts';

type TPreviewCard = Pick<IProduct, "image" | "category" | "description">;

export class PreviewCard extends Card<TPreviewCard> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buyButton: HTMLButtonElement;

  constructor(protected container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.buyButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if (actions?.onClick) {
      this.buyButton.addEventListener('click', actions.onClick);
    }
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
}