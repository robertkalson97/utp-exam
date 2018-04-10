import { Component, EventEmitter, Input, Output } from '@angular/core';

export type SearchFilterHeaderType = 'keyword' | 'chips' | 'multiple';

export const SearchType: {[key: string]: SearchFilterHeaderType} = {
  KEYWORD: 'keyword',
  CHIPS: 'chips',
  MULTIPLE: 'multiple',
};

@Component({
  selector: 'app-search-filter-header',
  templateUrl: './search-filter-header.component.html',
  styleUrls: ['./search-filter-header.component.scss'],
})
export class SearchFilterHeaderComponent {

  @Input() public title:  string;
  @Input() public className:  string = '';
  @Input() public searchKey: string;
  @Input() public searchType: SearchFilterHeaderType = SearchType.KEYWORD;
  @Input() chips = [];
  @Output() chipsChange = new EventEmitter();
  @Output() searchEvent = new EventEmitter();
  @Output() resetEvent = new EventEmitter();
  @Output() openModalEvent = new EventEmitter();

  get isChips() {
    return this.searchType === SearchType.CHIPS;
  }

  get isKeyword() {
    return this.searchType === SearchType.KEYWORD;
  }

  get isMultiple() {
    return this.searchType === SearchType.MULTIPLE;
  }

  searchFilter(event) {
    this.searchKey = event;
    this.searchEvent.emit(event);
  }

  showFiltersModal() {
    this.openModalEvent.emit();
  }

  resetFilters() {
    this.resetEvent.emit();
  }

}
