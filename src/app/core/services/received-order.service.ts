import { ModelService } from "../../overrides/model.service";
import { Injectable, Injector } from "@angular/core";
import { Subscribers } from "../../decorators/subscribers.decorator";
import { Restangular } from "ngx-restangular";
import { APP_CONFIG, AppConfig } from "../../app.config";
import * as _ from 'lodash';
import { UserService } from "./user.service";
import { AccountService } from "./account.service";
import { Router } from '@angular/router';

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class ReceivedOrderService extends ModelService {
  public appConfig: AppConfig;
  public statusList: any[] = [];
  
  constructor(
    public injector: Injector,
    public restangular: Restangular,
    public userService: UserService,
    public router: Router,
    public accountService: AccountService,
  ) {
    super(restangular);
    this.appConfig = injector.get(APP_CONFIG);
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
    
  }
  
  getStatusList() {
    return this.restangular.one('config', 'order_receiving_status').customGET('')
    .map(res => this.statusList = res.data);
  }
  
  onReceiveProducts(productsToReceive) {
    return this.restangular.all('receive').customPOST(productsToReceive);
  }
  
  getProductFields(variantId) {
    return this.restangular.one('inventory', 'search').customGET('', {'variant_id' : variantId})
    .map(res => res.data.results[0]);
  }
  
}
