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

  constructor(protected container: HTMLElement) {
    super(container);

    this.formElement = this.container as HTMLFormElement;
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

    this.submitButton.disabled = false;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}
