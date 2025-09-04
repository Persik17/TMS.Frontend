import {
  Component,
  ElementRef,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

type SearchResult = {
  type: 'task';
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
  filteredResults: SearchResult[] = [];
  showDropdown = false;
  isLoading = false;

  @Output() select = new EventEmitter<SearchResult>();

  private debounceTimer: number | undefined;

  constructor(private el: ElementRef, private http: HttpClient) {}

  onSearch() {
    if (this.debounceTimer) window.clearTimeout(this.debounceTimer);
    this.isLoading = true;
    this.showDropdown = !!this.query;
    this.debounceTimer = window.setTimeout(() => {
      this.doSearch();
    }, 600);
  }

  doSearch() {
    if (!this.query) {
      this.filteredResults = [];
      this.showDropdown = false;
      this.isLoading = false;
      return;
    }
    const userId = localStorage.getItem('userId');
    const companyId = localStorage.getItem('companyId');
    this.http
      .get<any[]>(`/api/companies/${companyId}/boards/search-tasks`, {
        params: {
          query: this.query,
          userId: userId || '',
        },
      })
      .subscribe({
        next: (data) => {
          this.filteredResults = data.map((item) => ({
            type: item.type,
            name: item.name,
            id: item.id,
          }));
          this.isLoading = false;
        },
        error: () => {
          this.filteredResults = [];
          this.isLoading = false;
        },
      });
  }

  selectResult(result: SearchResult) {
    if (!result.id) return;
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
