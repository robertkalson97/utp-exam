import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { OrderTableResetService } from './order-table-reset.service';
import { Subscription } from 'rxjs/Subscription';


@Injectable()
export class OrderTableSortService {
  
  static ASC = 'asc';
  static DESC = 'desc';
  
  public sort$: Observable<any>;
  
  private alias$ = new BehaviorSubject(null);
  private orederBy$ = new BehaviorSubject(OrderTableSortService.ASC);
  private isNewAlias$: Observable<boolean>;
  private isToggleSort$: Observable<boolean>;
  private resetSubscription: Subscription;
  
  constructor(
    private orderTableResetService: OrderTableResetService,
  ) {
    
    this.isNewAlias$ = this.alias$
    .pairwise()
    .map(([previous, current]) => {
      return previous !== current;
    });
    
    this.isToggleSort$ = this.isNewAlias$
    .map(isNewAlias => {
      return !isNewAlias;
    });
    
    this.sort$ = this.alias$
    .withLatestFrom(this.orederBy$, this.isNewAlias$, this.isToggleSort$)
    .map(([alias, order, isNewAlias, isToggleSort]) => {
      if (isNewAlias) {
        return {alias, order: OrderTableSortService.ASC};
      }
      
      if (isToggleSort) {
        return {
          alias,
          order: order === OrderTableSortService.ASC ? OrderTableSortService.DESC : OrderTableSortService.ASC
        };
      }
      return {alias, order};
    })
    .do(res => {
      this.orederBy$.next(res.order);
    });
  
    this.resetSubscription = this.orderTableResetService.resetFilters$
    .subscribe(res => this.alias$.next(null));
  }
  
  sortByAlias(alias) {
    this.alias$.next(alias);
  }
  
  destroySubscription() {
    if (this.resetSubscription && this.resetSubscription.unsubscribe) {
      this.resetSubscription.unsubscribe();
    }
  }
  
}
