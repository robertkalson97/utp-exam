import { Injectable } from '@angular/core';

import { Restangular } from 'ngx-restangular';

import { OrderListBaseService } from '../classes/order-list-base.service';
import { PastOrderService } from '../../../core/services/index';

@Injectable()
export class AllOrdersListService extends OrderListBaseService {

  constructor(
    private restangular: Restangular,
    private pastOrderService: PastOrderService,
  ) {
    super(pastOrderService);
    this.pastOrderService.addCollectionStreamToEntittesStream(this.getCollectionRequest$);
  }

  getRequest() {
    return this.restangular.all('pos').customGET();
  }
}
