import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { OrderTableResetService } from './order-table-reset.service';

@Injectable()
export class OrderTableFilterByService {

  filterByObject$: Observable<{[listname: string]: {[key: string]: any}}>;

  private filterBy$ = new ReplaySubject<{listName: string, value: {[key: string]: any}}>(1);

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
      const value = item.value;
      const listName = item.listName;
      const filter = value ? {...acc[listName], ...value} : {};
      return { ...acc, [listName]: filter};
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
      value: {[headerCol.alias]: value }
    });
  }
}
