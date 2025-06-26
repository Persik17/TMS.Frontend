import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'phoneFormat' })
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    let cleaned = value.replace(/\D/g, '');

    if (
      cleaned.length === 11 &&
      (cleaned.startsWith('7') || cleaned.startsWith('8'))
    ) {
      const code = cleaned.slice(1, 4);
      const part1 = cleaned.slice(4, 7);
      const part2 = cleaned.slice(7, 9);
      const part3 = cleaned.slice(9, 11);
      return `+7 (${code}) ${part1}-${part2}-${part3}`;
    }

    if (cleaned.length > 10 && value.startsWith('+')) {
      return value;
    }

    return value;
  }
}
