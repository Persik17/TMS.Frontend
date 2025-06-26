import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform<T extends object>(items: T[], search: string, prop?: keyof T): T[] {
    if (!items || !search) return items;
    search = search.toLowerCase();
    return items.filter((item) => {
      if (prop) {
        const val = (item[prop] as unknown as string) || '';
        return val.toLowerCase().includes(search);
      }
      return Object.values(item).some((val) =>
        String(val).toLowerCase().includes(search)
      );
    });
  }
}
