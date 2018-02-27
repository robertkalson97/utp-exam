import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-filter-header',
  templateUrl: './search-filter-header.component.html',
  styleUrls: ['./search-filter-header.component.scss'],
})

export class SearchFilterHeaderComponent {
  
  @Input() public title:  string;
  @Input() public searchKey: string;
  @Output() searchEvent = new EventEmitter();
  @Output() resetEvent = new EventEmitter();
  @Output() openModalEvent = new EventEmitter();

  constructor(

  ) {
  
  }

  searchFilter(event) {
    this.searchEvent.emit(event.data);
  }

  showFiltersModal() {
    this.openModalEvent.emit();
  }

  resetFilters() {
    this.resetEvent.emit();
  }

}
