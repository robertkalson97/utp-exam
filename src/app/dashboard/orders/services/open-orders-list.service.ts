import { Injectable } from '@angular/core';

import { Restangular } from 'ngx-restangular';

import { PastOrderService } from '../../../core/services/index';
import { OrderListBaseService } from '../classes/order-list-base.service';

@Injectable()
export class OpenOrdersListService extends OrderListBaseService {

  constructor(
    private restangular: Restangular,
    private pastOrderService: PastOrderService,
  ) {
    super(pastOrderService);
    this.pastOrderService.addCollectionStreamToEntittesStream(this.getCollectionRequest$);
  }

  getRequest() {
    return this.restangular.one('pos', '5').customGET();

  }
}
