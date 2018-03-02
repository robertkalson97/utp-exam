import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { Restangular } from 'ngx-restangular';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { ModelService } from '../../overrides/model.service';
import { APP_CONFIG, AppConfig } from '../../app.config';

import { UserService } from './user.service';
import { AccountService } from './account.service';
import { OrderReceivingStatus } from '../../dashboard/orders/receive/models/order-item-status-form.model';

@Injectable()
export class ReceivedOrderService extends ModelService {
  public appConfig: AppConfig;
  public statusList: OrderReceivingStatus[] = [];
  public statusList$: Observable<OrderReceivingStatus[]>;
  public getStatusList$: Subject<any> = new Subject<any>();

  constructor(
    public injector: Injector,
    public restangular: Restangular,
    public userService: UserService,
    public router: Router,
    public accountService: AccountService,
  ) {
    super(restangular);
    this.appConfig = injector.get(APP_CONFIG);

    this.statusList$ = this.getStatusList$
    .switchMap(() =>
      this.restangular.one('config', 'order_receiving_status').customGET('')
    )
    .map((response: any) => response.data)
    .shareReplay(1);

    this.statusList$.subscribe((statusList) => this.statusList = statusList);
  }


  getReceiveProduct(queryParams) {
    let params: any[] = queryParams.split('&');
    let orderIds = params[0];
    let itemsIds = params[1];

    if(itemsIds) {
      return this.restangular.all('receive').customGET('', {'order_ids': orderIds, 'items_ids' : itemsIds})
      .map(res => res.data);
    } else {
      return this.restangular.all('receive').customGET('', { 'item_ids' : queryParams })
      .map(res => res.data);
    }
    // return Observable.of(testData);
  }

  getStatusList() {
    this.getStatusList$.next(null);
    return this.statusList$;
  }

  onReceiveProducts(productsToReceive) {
    return this.restangular.all('receive').customPOST(productsToReceive);
  }

  getProductFields(variantId) {
    return this.restangular.one('inventory', 'search').customGET('', {'variant_id' : variantId})
    .map(res => res.data.results[0]);
  }

}
