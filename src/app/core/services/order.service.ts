import { ModelService } from "../../overrides/model.service";
import { Injectable, Injector } from "@angular/core";
import { Subscribers } from "../../decorators/subscribers.decorator";
import { Restangular } from "ngx-restangular";
import { APP_CONFIG, AppConfig } from "../../app.config";
import { Observable, BehaviorSubject } from "rxjs";
import * as _ from 'lodash';
import { UserService } from "./user.service";
import { AccountService } from "./account.service";

export class ConvertData {
  vendor_id: string[];
  location_id: string;
}


export class OrderAddress {
  _id: string;
  street_1: string;
  street_2: string;
  city: string;
  postal_code: string;
  state: string;
  country: string;
  formattedAddress: string;
  updated_at: string;
  created_at: string
}
export class OrderOrder {
  account_id: string;
  created_at: string;
  created_by: string;
  created_by_name: string;
  currency: string;
  destination_location: any;
  discount: any;
  from_address: OrderAddress;
  from_co_name: string;
  from_email_address: string;
  from_fax_number: string;
  from_phone_number: string;
  order_date: string;
  order_method: string;
  order_sent_ts: string;
  ordered_by: string;
  ordered_by_name: string;
  origin_location: string;
  payment_method: string;
  po_link: string;
  primary_tax: number;
  recurring: boolean;
  recurring_start_date: string;
  secondary_tax: number;
  ship_to_address: OrderAddress;
  ship_to_co_name: string;
  ship_to_email_address: string;
  ship_to_fax_number: string;
  ship_to_location_id: string;
  ship_to_location_name: string;
  ship_to_phone_number: string;
  po_number: string;
  shipping_handling: number;
  shipping_method:string;
  status: number;
  sub_total: number;
  sub_total_no_discount: string;
  total: number;
  transfer: boolean;
  updated_at: string;
  vendor_account_number: string;
  vendor_address: OrderAddress;
  vendor_email_address: string;
  vendor_fax_number: string;
  vendor_id: string;
  vendor_name: string;
  vendor_phone_number: string;
  vendor_rep_name: string;
  id: string
}
export class OrderItems {
  account_id: string;
  approval_user: string;
  approved_date: string;
  catalog_number: string;
  created_at: string;
  denied_date: string;
  discounted: string;
  item_description: string;
  item_name: string;
  line_item_type: string;
  location_id: string;
  order_id: string;
  price: string;
  price_nf: number;
  product_id: string;
  quantity: number;
  received_date: string;
  recieved_quantity: number;
  reconciled_date: string;
  reconciled_price: string;
  reconciled_quantity: string;
  reconciled_user: string;
  requires_approval: string;
  status: string;
  unit_price: string;
  package_price: string;
  sub_total: string;
  updated_at: string;
  variant_id: string;
  vendor_id: string;
  vendor_variant_id: string;
  id: string
}
export class OrderDiscount {
    account_id: string;
    created_at: string;
    discount_amount: string;
    discount_bogo_discounted: number;
    discount_bogo_full_price: number;
    discount_bogo_type: string;
    discount_reward_points: number;
    discount_type: string;
    item_description: string;
    item_name: string;
    line_item_type: string;
    location_id: string;
    order_id: string;
    product_id: string;
    product_line_item_id: string;
    status: number;
    updated_at: string;
    variant_id: string;
    vendor_id: string;
    vendor_variant_id: string;
    id: string
}
export class OrderAmountsFormatted {
  line_items: string;
  discounts: string;
  primary_tax: string;
  shipping_handling: string;
  total: string
}
export class ConvertedOrder {
  order: OrderOrder;
  order_items: OrderItems[];
  discount_items: OrderDiscount[];
  amounts_formatted: OrderAmountsFormatted;
}

export class OrderOptions {
  primary_tax: number;
  secondary_tax: number;
  shipping_handling: number;
  ship_to: string;
  order_method: string;
}

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class OrderService extends ModelService {
  public appConfig: AppConfig;
  public convertData: ConvertData | null;
  public itemsVisibility: boolean[];
  public pastOrders$: BehaviorSubject<any> = new BehaviorSubject([]);
  
  constructor(
    public injector: Injector,
    public restangular: Restangular,
    public userService: UserService,
    public accountService: AccountService
  ) {
    super(restangular);
    this.appConfig = injector.get(APP_CONFIG);
   
  }
  
  getOrder(orderId: string) {
    return this.restangular.one('orders', orderId).all('preview').customGET('')
    .map((res: any) => {

      return res.data.map((item: any) => {
        item.primary_tax_nf /= 100;
        item.secondary_tax_nf /= 100;
        item.shipping_handling_nf /= 100;
        item.sub_total_nf /= 100;
        item.total_nf /= 100;
        return item;
      });
    })
    .do((res: any) => {
      this.updateCollection$.next(res);
    });
  }
  
  updateOrder(orderId: string, data: OrderOptions) {
    return this.restangular.one('orders', orderId).all('preview').customPUT(data)
    .map((res: any) => {
      return res.data.map((item: any) => {
        item.primary_tax_nf /= 100;
        item.secondary_tax_nf /= 100;
        item.shipping_handling_nf /= 100;
        item.sub_total_nf /= 100;
        item.total_nf /= 100;
        return item;
      });
    })
    //update order data
  }
  
  convertOrders(orderId: string, data: ConvertData) {
    return this.restangular.one('orders', orderId).all('convert').customPOST(data)
  }

  sendOrderRequest(orderId){
    return this.restangular.one('po', orderId).all('send').customGET()
      .map((res:any)=>res.data);
  }
  
  sendOrderRequestFinal(orderId, data:any){
    //POST /po/{order_id}/send
    return this.restangular.one('po', orderId).all('send').customPOST(data)
      .map((res:any)=>res.data);
  }
  
}
