import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import * as _ from 'lodash';

import { OrderItem } from '../models/order-item';
import { PastOrderService } from '../../../core/services';

export enum IdsActions {
  add,
  remove,
  set,
}

export abstract class OrderListBaseService {

  public getCollectionRequest$: Observable<any>;
  public getCollection$: Subject<any> = new Subject();
  public collection$: Observable<OrderItem[]>;
  public ids$: ConnectableObservable<string[]>;


  constructor(
    pastOrderService: PastOrderService
  ) {
    this.getCollectionRequest$ = Observable.merge(
      this.getCollection$,
      pastOrderService.filterQueryParams$
    )
    .switchMap((params) =>
      this.getRequest(params)
      .map((res: any) => res.data)
      .catch((error) => Observable.never())
    )
    .share();

    this.ids$ = Observable.merge(
      this.getCollectionRequest$
      .map((items) => _.map(items, 'id'))
      .let(this.getSetAction),
      pastOrderService.removeIds$
      .let(this.getRemoveAction),
    )
    .scan(
      this.reducer
      , []
    )
    .publishBehavior([]);
    this.ids$.connect();

    this.collection$ = Observable.combineLatest(
      pastOrderService.entities$,
      this.ids$,
    )
    .map(([entities, ids]) => ids.map((id) => entities[id]));
  }

  getCollection() {
    this.getCollection$.next(null);
    return this.getCollectionRequest$;
  }

  protected abstract getRequest(params): Observable<any>;

  protected reducer(state, {type, items}: {type: IdsActions, items: string[]}): string[] {
      switch (type) {
        case IdsActions.set: {
          return items;
        }
        case IdsActions.remove: {
          return _.without(state, ...items);
        }
        case IdsActions.add: {
          return _.union(state, items);
        }
        default: {
          return state;
        }
      }
    }

    protected getRemoveAction(obs: Observable<string[]>) {
      return obs.map((items) =>
        ({
          type: IdsActions.remove,
          items,
        })
      );
    }

    protected getSetAction(obs: Observable<string[]>) {
      return obs.map((items) =>
        ({
          type: IdsActions.set,
          items,
        })
      );
    }

    protected getAddAction(obs: Observable<string[]>) {
      return obs.map((items) =>
        ({
          type: IdsActions.add,
          items,
        })
      );
    }
}
