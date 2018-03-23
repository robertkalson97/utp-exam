import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss'],
})

export class SearchFilterComponent {
  searchKey: string;
  @Output() searchEvent = new EventEmitter();
  @Output() openModalEvent = new EventEmitter();

  constructor() {}

  searchFilter(event) {
    this.searchEvent.emit(this.searchKey);
  }

  showFiltersModal() {
    this.openModalEvent.emit();
  }
}
