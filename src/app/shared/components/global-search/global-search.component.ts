import {
  Component,
  ElementRef,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type SearchResult = {
  type: 'user' | 'board' | 'task';
  name: string;
  id: string;
};

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss'],
})
export class GlobalSearchComponent {
  query = '';
  results: SearchResult[] = [];
  filteredResults: SearchResult[] = [];
  showDropdown = false;
  isLoading = false;

  @Output() select = new EventEmitter<SearchResult>();

  private debounceTimer: number | undefined;

  constructor(private el: ElementRef) {}

  onSearch() {
    if (this.debounceTimer) window.clearTimeout(this.debounceTimer);
    this.isLoading = true;
    this.showDropdown = !!this.query;
    this.debounceTimer = window.setTimeout(() => {
      this.doSearch();
    }, 2000);
  }

  doSearch() {
    if (!this.query) {
      this.filteredResults = [];
      this.showDropdown = false;
      this.isLoading = false;
      return;
    }
    this.filteredResults = this.results.filter((item) =>
      item.name.toLowerCase().includes(this.query.toLowerCase())
    );
    this.isLoading = false;
  }

  selectResult(result: SearchResult) {
    this.select.emit(result);
    this.query = '';
    this.filteredResults = [];
    this.showDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }
}
