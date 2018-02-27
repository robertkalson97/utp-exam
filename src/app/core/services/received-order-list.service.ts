import { Injectable, Injector } from '@angular/core';

import { ModelService } from '../../overrides/model.service';
import { Restangular } from 'ngx-restangular';
import { Router } from '@angular/router';

@Injectable()

export class ReceivedOrderListService extends ModelService {
  
  constructor(
    public injector: Injector,
    public restangular: Restangular,
    public router: Router,
  ) {
    super(restangular);
  }
  
  getReceivedProducts() {
    return this.restangular.one('pos', '6').customGET()
    .map((res: any) => res.data);
  }
  
}
