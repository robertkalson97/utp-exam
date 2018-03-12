import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { OrderTableResetService } from './order-table-reset.service';

export interface FilterBy {
  listName: string;
  value: {[key: string]: any};
  type: 'update' | 'set';
}

@Injectable()
export class OrderTableFilterByService {

  filterByObject$: Observable<{[listname: string]: {[key: string]: any}}>;

  private filterBy$ = new ReplaySubject<FilterBy>(1);

  constructor(
    private orderTableResetService: OrderTableResetService
  ) {
    this.filterByObject$ = Observable.merge(
      this.filterBy$,
      this.orderTableResetService.resetFilters$.mapTo(null),
    )
    .scan((acc, item) => {
      if (!item) {
        return {} as {[listname: string]: {[key: string]: any}};
      }
      switch (item.type) {
        case 'update': {
          const value = item.value;
          const listName = item.listName;
          const filter = value ? {...acc[listName], ...value} : {};
          return { ...acc, [listName]: filter};
        }
        case 'set': {
          return {...acc, [item.listName]: item.value};
        }
      }

    }, {} as {listName: string, value: {[key: string]: any}})
    .startWith({})
    .shareReplay(1);
  }

  getFilterByListName(listName): Observable<{[key: string]: any}> {
    return this.filterByObject$.map((entities) => entities[listName]);
  }

  onFilterByAlias(value, headerCol, listName: string) {
    this.filterBy$.next({
      listName,
      type: 'update',
      value: {[headerCol.alias]: value }
    });
  }

  setFilterBy(value, listName: string) {
    this.filterBy$.next({
      type: 'set',
      listName,
      value,
    });
  }
}
