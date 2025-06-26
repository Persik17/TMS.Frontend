import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
  transform(text: string, search: string): string {
    if (!search) return text;
    const pattern = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    return text.replace(
      new RegExp(pattern, 'gi'),
      (match) => `<span class="search-highlight">${match}</span>`
    );
  }
}
