import { Component } from '../base/Component.ts';
import { IEvents } from '../base/Events.ts';
import { ensureElement } from '../../utils/utils.ts';

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected closeButton: HTMLButtonElement;
  
  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.content = ensureElement<HTMLElement>('.modal__content', this.container);

    this.closeButton.addEventListener('click', () => {
      this.events.emit('modal:close');
    });
  }

  set content(content: HTMLElement) {
    this.content.replaceChildren(content);
  }
}