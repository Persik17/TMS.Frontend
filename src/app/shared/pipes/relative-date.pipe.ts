import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'relativeDate' })
export class RelativeDatePipe implements PipeTransform {
  transform(value: Date | string | number): string {
    if (!value) return '';
    const date = new Date(value);
    const now = new Date();
    const diff = +now - +date;
    const sec = Math.floor(diff / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);

    if (sec < 60) return 'только что';
    if (min < 60) return `${min} мин назад`;
    if (hr < 24) return `${hr} ч назад`;
    if (day === 1) return 'вчера';
    if (day < 7) return `${day} дн назад`;

    // Возвращаем дату в формате ДД.ММ.ГГГГ
    return date.toLocaleDateString('ru-RU');
  }
}
