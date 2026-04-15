import { Component } from "../../base/Component.ts";
import { IProduct } from "../../../types/index.ts";
import { ensureElement } from '../../../utils/utils.ts';

type TCard = Pick<IProduct, "title" | "price">; //& Partial<Pick<IProduct, 'image' | 'category' | 'description'>>;

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export abstract class Card<
  T extends Partial<Pick<IProduct, "image" | "category" | "description">>,
> extends Component<TCard & T> {
  protected titleElement = ensureElement<HTMLElement>('.card__title', this.container);
  protected priceElement = ensureElement<HTMLElement>('.card__price', this.container);

  set title(title: string) {
    this.titleElement.textContent = title;
  }

  set price(price: string) {
    this.priceElement.textContent = price;
  }
}
