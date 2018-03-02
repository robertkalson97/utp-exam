import { Injectable } from '@angular/core';

import { Restangular } from 'ngx-restangular';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import * as _ from 'lodash';

import { PastOrderService } from '../../../core/services/index';
import { OrderListBaseService } from '../classes/order-list-base.service';

@Injectable()
export class FavoritedListService extends OrderListBaseService {

  private postItemRequest$: Observable<any>;
  private postItem$: Subject<any> = new Subject();

  constructor(
    private restangular: Restangular,
    private pastOrderService: PastOrderService,
  ) {
    super(pastOrderService);


    this.postItemRequest$ = this.postItem$
    .switchMap((item) =>
      this.restangular.one('pos', item.order_id).one('favorite', item.id).customPUT({'favorite': !item.favorite})
      .map((res: any) => res.data)
      .catch((error) => Observable.never())
    )
    .share();

    this.pastOrderService.addCollectionStreamToEntittesStream(this.getCollectionRequest$);
    this.pastOrderService.addCollectionStreamToEntittesStream(this.postItemRequest$.map(item => [item]));

    const collectionIdsGetRequest$ = this.getCollectionRequest$
    .map((items) => _.map(items, 'id'))
    .let(this.getSetAction);

    const collectionAddIds$ = this.postItemRequest$
    .filter((item) => item.favorite)
    .map((item) => [item.id])
    .let(this.getAddAction);

    const collectionRemoveIds$ = this.postItemRequest$
    .filter((item) => !item.favorite)
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
    return this.restangular.one('pos', 'favorites').customGET();
  }

  postItem(item) {
    this.postItem$.next(item);
    return this.postItemRequest$;
  }
}
