import { Component } from "../../base/Component.ts";
import { IProduct } from "../../../types/index.ts";
import { ensureElement } from '../../../utils/utils.ts';
import { TPriceless } from '../../../types/index.ts';

type TCard = Pick<IProduct, "title" | "price">;

const pricelessValue: TPriceless = 'Бесценно';

export interface IRenderData {
  index?: number;
  buttonText?: string;
}

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export abstract class Card<
  T extends Partial<Pick<IProduct, "image" | "category" | "description">> | IRenderData,
> extends Component<TCard & T> {
  protected titleElement = ensureElement<HTMLElement>('.card__title', this.container);
  protected priceElement = ensureElement<HTMLElement>('.card__price', this.container);

  set title(title: string) {
    this.titleElement.textContent = title;
  }

  set price(price: number | null) {
    this.priceElement.textContent = price === null ? pricelessValue : `${price} синапсов`;
  }
}
