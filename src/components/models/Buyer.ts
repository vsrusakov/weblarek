import { IBuyer, TPayment, isPayment } from "../../types";

/**
 * Класс для хранения и валидации данных покупателя
 */
export class Buyer implements IBuyer {
  public payment: TPayment = '';
  public address: string = '';
  public email: string = '';
  public phone: string = '';

  /**
   * Сохранение данных покупателя
   * @param data - объект, полями которого служат названия полей `IBuyer`, значения полей - введенные пользователем данные
   */
  saveData(data: Record<string, string | TPayment>) {
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
  validateData(): Record<string, string> {
    const errors = new Map<string, string>;

    if (this.payment.length === 0) errors.set('payment', 'Не выбран вид оплаты');
    
    if (this.address.length === 0) errors.set('address', 'Необходимо указать адрес');

    if (this.email.length === 0) errors.set('email', 'Укажите email');

    if (this.phone.length === 0) errors.set('phone', 'Укажите телефон');

    return Object.fromEntries(errors);
  }
}
