import { Component } from '../base/Component.ts';
import { IEvents } from '../base/Events.ts';
import { ensureElement } from '../../utils/utils.ts';

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;
  
  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);

    this.container.addEventListener('click', (event: MouseEvent) => {
      event.stopPropagation();
      if (event.target instanceof HTMLElement && event.target.classList.contains('modal') 
        || event.target === this.closeButton) {
        this.events.emit('modal:close');
      }
    });
  }

  open() {
    this.container.classList.add('modal_active');
  }

  hide() {
    this.container.classList.remove('modal_active');
  }

  set content(content: HTMLElement) {
    this.contentElement.replaceChildren(content);
  }
}