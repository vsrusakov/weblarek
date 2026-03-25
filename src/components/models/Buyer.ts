import { IBuyer, TPayment } from "../../types";
import { isPayment } from "../../utils/utils";

/**
 * Класс для хранения и валидации данных покупателя
 */
export class Buyer {
  private payment: TPayment = '';
  private address: string = '';
  private email: string = '';
  private phone: string = '';

  /**
   * Сохранение данных покупателя
   * @param data - объект, полями которого служат названия полей `IBuyer`, значения полей - введенные пользователем данные
   */
  saveData(data: Partial<Record<keyof IBuyer, string>>) {
    for (const [key, value] of Object.entries(data)) {
      switch (key) {
        case 'payment':
          if (isPayment(value)) this.payment = value;
          break;
        case 'address':
          this.address = value;
          break;
        case 'email':
          this.email = value;
          break;
        case 'phone':
          this.phone = value;
          break;
        default:
      }
    }
  }

  /**
   * Получить данные покупателя
   * @returns объект с данными покупателя
   */
  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone
    }
  }

  /**
   * Очистить данные покупателя
   */
  clearData() {
    this.payment = '';
    this.address = '';
    this.email = '';
    this.phone = '';
  }

  /**
   * Валидация данных пользователя. Поле является валидным, если оно не пустое. Если поле класса `Buyer` отсутствует в ответе, то оно валидно.
   * @returns объект, полем которого служит название поля класса `Buyer`, значением - текст ошибки
   */
  validateData(): Partial<Record<keyof IBuyer, string>> {
    let errors: Partial<Record<keyof IBuyer, string>> = {};

    if (this.payment.length === 0) errors.payment = 'Не выбран вид оплаты';
    
    if (this.address.length === 0) errors.address = 'Необходимо указать адрес';

    if (this.email.length === 0) errors.email = 'Укажите email';

    if (this.phone.length === 0) errors.phone = 'Укажите телефон';

    return errors;
  }
}
