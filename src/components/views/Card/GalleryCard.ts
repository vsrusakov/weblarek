import { Card, ICardActions } from './Card'
// import { IEvents } from '../../base/Events';
import { ensureElement } from '../../../utils/utils.ts';
import { categoryMap } from '../../../utils/constants.ts';
import { IProduct } from '../../../types/index.ts';

type TGalleryCard = Pick<IProduct, "image" | "category">;

export class GalleryCard extends Card<TGalleryCard> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(protected container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);

    if (actions) {
      this.container.addEventListener('click', actions.onClick);
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
}