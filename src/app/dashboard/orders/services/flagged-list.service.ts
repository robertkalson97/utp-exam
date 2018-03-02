import { Injectable } from '@angular/core';

import { Restangular } from 'ngx-restangular';

import { PastOrderService } from '../../../core/services/index';
import { OrderListBaseService } from '../classes/order-list-base.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';

@Injectable()
export class FlaggedListService extends OrderListBaseService {

  private putItemRequest$: Observable<any>;
  private putItem$: Subject<any> = new Subject();

  constructor(
    private restangular: Restangular,
    private pastOrderService: PastOrderService,
  ) {
    super(pastOrderService);

    this.putItemRequest$ = this.putItem$
    .switchMap((item) => {
      const data = {
        'flagged': !item.flagged,
        'flagged_comment': !item.flagged ? item.flagged_comment : '',
      };
      return this.restangular.one('pos', item.order_id).one('flag', item.id).customPUT(data)
      .map((res: any) => res.data)
      .catch((error) => Observable.never());
    })
    .share();

    this.pastOrderService.addCollectionStreamToEntittesStream(this.getCollectionRequest$);
    this.pastOrderService.addCollectionStreamToEntittesStream(this.putItemRequest$.map(item => [item]));

    const collectionIdsGetRequest$ = this.getCollectionRequest$
    .map((items) => _.map(items, 'id'))
    .let(this.getSetAction);

    const collectionAddIds$ = this.putItemRequest$
    .filter((item) => item.flagged)
    .map((item) => [item.id])
    .let(this.getAddAction);

    const collectionRemoveIds$ = this.putItemRequest$
    .filter((item) => !item.flagged)
    .map((item) => [item.id])
    .let(this.getRemoveAction);

    const collectionVoidedIds$ = this.pastOrderService.removeIds$
    .let(this.getRemoveAction);

    this.ids$ = Observable.merge(
      collectionIdsGetRequest$,
      collectionAddIds$,
      collectionRemoveIds$,
      collectionVoidedIds$,
    )
    .scan(this.reducer, [])
    .publish();
    this.ids$.connect();

    this.collection$ = Observable.combineLatest(
      this.pastOrderService.entities$,
      this.ids$,
    )
    .map(([entities, ids]) =>
      ids.map((id) => entities[id])
    );
  }

  getRequest() {
    return this.restangular.one('pos', 'flagged').customGET();
  }

  putItem(item) {
    this.putItem$.next(item);
    return this.putItemRequest$;
  }
}
