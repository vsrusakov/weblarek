import { Component } from '../../base/Component.ts';
import { ensureElement } from '../../../utils/utils.ts';

interface IFormData {
  errors?: string;
}

export interface IFormActions {
  submit: (event: SubmitEvent) => void;
}

export abstract class Form extends Component<IFormData> {
  protected formElement: HTMLFormElement;
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(protected container: HTMLElement, actions: IFormActions) {
    super(container);

    this.formElement = ensureElement<HTMLFormElement>('form', this.container);
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

    if (actions.submit) {
      this.formElement.addEventListener('submit', actions.submit);
    }
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}
