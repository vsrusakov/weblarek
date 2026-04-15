import { Component } from '../base/Component.ts';
import { ensureElement } from '../../utils/utils.ts';

interface IGalleryData {
  catalog: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
  protected catalogElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.catalogElement = ensureElement<HTMLElement>('.gallery', this.container);
  }

  set catalog(items: HTMLElement[]) {
    this.catalogElement.replaceChildren(...items);
  }
}