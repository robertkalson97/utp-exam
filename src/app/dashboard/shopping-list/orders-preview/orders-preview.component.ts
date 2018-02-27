import {
  Component, OnInit
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { Location }                 from '@angular/common';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import * as _ from 'lodash';
import { ModalWindowService } from "../../../core/services/modal-window.service";
import { UserService } from '../../../core/services/user.service';
import { AccountService } from '../../../core/services/account.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OrderOptions, OrderService } from '../../../core/services/order.service';
import { ToasterService } from '../../../core/services/toaster.service';


@Component({
  selector: 'app-orders-preview',
  templateUrl: './orders-preview.component.html',
  styleUrls: ['./orders-preview.component.scss']
})
@DestroySubscribers()
export class OrdersPreviewComponent implements OnInit {
  
  public orderId: string = '';
  public orders$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public location_id: string;
  private first_order: any;
  
  constructor(
    public modal: Modal,
    public modalWindowService: ModalWindowService,
    public userService: UserService,
    public windowLocation: Location,
    public accountService: AccountService,
    public route: ActivatedRoute,
    public orderService: OrderService,
    public toasterService: ToasterService,
    public router:Router,
  ) {
  
  }
  
  ngOnInit() {
    
    this.route.params
    .switchMap((p: Params) => {
      this.orderId = p['id'];
      return this.orderService.getOrder(p['id']);
    })
    .subscribe((items: any) => {
      return this.calcTT(items);
    });
    
  }
  
  calcTT(items) {
    let tt = 0;
    _.each(items, (i: any) => {
      tt += i.total_nf;
    });
    items.total_total = tt;
    return this.orders$.next(items);
  }
  
  saveOrder(orderId: string, key: string, val, vendorId: string) {
    if (key != "ship_to" && key != "order_method") {
      const regex = /[\d\.]*/g;
      let m: any = regex.exec(val);
      regex.lastIndex++;
      let m1: any = regex.exec(val);
      if (m && m[0]) {
        val = parseFloat(m[0] ? m[0] : '0');
      } else if (m1 && m1[0]) {
        val = parseFloat(m1[0] ? m1[0] : '0');
      }
      if (!val) {
        val = 0;
      }
      
    }
    let data: any = {};
    data[key] = val;
    data['vendor_id'] = vendorId;
    this.orderService.updateOrder(orderId, data).subscribe((res: any) => {
        this.toasterService.pop('', 'Data updated');
        this.calcTT(res);
      },
      (res: any) => {
        this.toasterService.pop('error', res.statusText);
        console.error(res);
      })
  }
  
  
  goBack(): void {
    this.windowLocation.back();
  }
  
  prefillDataForConvertion(order: any) {
      this.orderService.convertData = {
        vendor_id: [order[0].vendor_id],
        location_id: order[0].ship_to.location_id ? order[0].ship_to.location_id : order[0].ship_to_options[0].location_id
      };
      let data = new OrderOptions();
      data.ship_to = order[0].ship_to.location_id ? order[0].ship_to.location_id : order[0].ship_to_options[0].location_id;
      data.order_method = order[0].order_method;
      data['vendor_id'] = order[0].vendor_id;
      this.orderService.updateOrder(this.orderId, data).subscribe((res: any) => {
          this.calcTT(res);
          this.route.params.subscribe((p:Params)=>{
            this.router.navigate(['/shoppinglist','purchase',p['id']]);
          });
        },
        (res: any) => {
          this.toasterService.pop('error', res.statusText);
          console.error(res);
        });
    }

  prefillAll(){
    this.orders$
    .map((orders:any)=>{
      this.first_order = orders[0];
      return orders.map((order:any)=>order.vendor_id)
    })
    .subscribe((order_ids:string[])=>{
      this.orderService.convertData = {
        vendor_id: order_ids,
        location_id: this.location_id
      };
      this.route.params.subscribe((p:Params)=>{
        this.router.navigate(['/shoppinglist','purchase',p['id']]);
      });
    });
  }
}