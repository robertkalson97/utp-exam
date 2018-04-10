import { Component, OnInit } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs/Rx';
import { Location }                 from '@angular/common';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import * as _ from 'lodash';
import { ModalWindowService } from "../../../core/services/modal-window.service";
import { UserService } from '../../../core/services/user.service';
import { AccountService } from '../../../core/services/account.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {OrderOptions, OrderService, ConvertedOrder} from '../../../core/services/order.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { APP_DI_CONFIG } from '../../../../../env';
import { HttpClient } from '../../../core/services/http.service';
import { ResponseContentType } from '@angular/http';
import { EditFaxDataModal } from './edit-fax-data-modal/edit-fax-data-modal.component';
import { WarningOrderModalComponent } from './warning-order-modal/warning-order-modal.component';
import { OnlineOrderModalComponent } from './online-order-modal/online-order-modal.component';
import {SpinnerService} from "../../../core/services/spinner.service";
import {EditEmailDataModal} from "./purchase-order/edit-email-data-modal/edit-email-data-modal.component";


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
  public apiUrl: string;
  private first_order: any;
  private subscribers: any = {};

  constructor(
    public modal: Modal,
    public modalWindowService: ModalWindowService,
    public userService: UserService,
    public windowLocation: Location,
    public accountService: AccountService,
    public route: ActivatedRoute,
    public orderService: OrderService,
    public toasterService: ToasterService,
    public router: Router,
    public httpClient: HttpClient,
    public spinner: SpinnerService
  ) {
    this.apiUrl = APP_DI_CONFIG.apiEndpoint;
  }

  ngOnInit() {

    this.subscribers.paramsSubscribtion = this.route.params
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
    return data;
  }

  makeOrder(order: any) {

    const data = this.prefillDataForConvertion(order);
    /*let ua = navigator.userAgent.toLowerCase();
    let isSafari = ua.indexOf('safari') != -1;
    let w: Window;
    if (order[0].order_method === 'Mail' && isSafari) {
      w = window.open();
    }*/

    this.orderService.updateOrder(this.orderId, data).subscribe((res: any) => {
        this.calcTT(res);
        //TODO: need to define, why order_method == null
        order[0].order_method = order[0].order_method == null ? 'Email' : order[0].order_method;
        switch (order[0].order_method) {
          case 'Email':
            this.convertOrder()
              .subscribe((order: any) => this.orderService.sendOrderRequest(order.id)
                .take(1)
                .subscribe((status: any) => {
                  this.showEmailDataEditModal({
                    order_method:order['order_method'],
                    attachments: order['attachments'],
                    email_text: status.email_text.replace('(vendor name)', order['vendor_name']),
                    po_number: order['po_number'],
                    preview_id: order['preview_id'],
                    order_id: order['id'],
                    vendor_email: order['vendor_email_address'],
                    user_email: this.userService.selfData.email_address,
                    from_fax_number: order['from_fax_number'] || '1 11111111111',
                    rmFn:  null
                  });
            }));
            break;
          case 'Fax':
            this.convertOrder()
              .subscribe(order => {
                this.orderService.sendOrderRequest(order.id)
                .subscribe(status => {
                  this.modal.open(
                    EditFaxDataModal,
                    this.modalWindowService.overlayConfigFactoryWithParams({
                      order_method: order['order_method'],
                      attachments: order['attachments'],
                      fax_text: status.email_text.replace('(vendor name)', order['vendor_name']),
                      po_number: order['po_number'],
                      preview_id: order['preview_id'],
                      order_id: order['id'],
                      vendor_name: order['vendor_name'],
                      user_name: this.userService.selfData.name,
                      from_fax_number: order['from_fax_number'] || '1 11111111111',
                      rmFn: null
                    }, true, 'oldschool')
                  )
                });
              });
            break;
          case 'Online':
            this.modal.open(
              OnlineOrderModalComponent,
              this.modalWindowService.overlayConfigFactoryWithParams({
                order_id: this.orderId,
                vendor_id: order[0].vendor_id
              }, true, 'oldschool')
            );
            break;
          case 'Phone':
            this.convertOrder()
              .subscribe(order => {
                this.orderService.sendOrderRequestFinal(order.id, {})
                  .subscribe(() => {
                    this.openWarningOrderModal(order);
                  })
              });

            break;
          case 'Mail':
            this.convertOrder()
              .subscribe(order => {
                this.orderService.sendOrderRequestFinal(order.id, {})
                  .subscribe(() => {
                    this.openWarningOrderModal(order);
                  })
              });
            break;
          default:
            break;
        }

      },
      (res: any) => {
        this.toasterService.pop('error', res.statusText);
        console.error(res);
      });
    }

    getButtonText(order: any) {
      switch (order.order_method) {
        case 'Email':
          return 'Send';
        case 'Fax':
          return 'Fax';
        case 'Online':
          return 'Finalize';
        case 'Phone':
          return 'Finalize';
        case 'Mail':
          return 'Finalize';
        default:
          return 'Send';
      }
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

  onViewPoClick(order: any) {
    this.prefillDataForConvertion(order);
    this.route.params.subscribe((p:Params)=>{
      this.router.navigate(['/shoppinglist','purchase',p['id']]);
    });
  }

  onPrintPoClick(order: any) {
    this.prefillDataForConvertion(order);
    this.spinner.show();
    let ua = navigator.userAgent.toLowerCase();
    let isSafari = ua.indexOf('safari') != -1;
    let w: Window;
    if (isSafari) {
      w = window.open();
    }

    this.orderService.convertOrders(this.orderId, this.orderService.convertData)
      .map(res => res.data.order)
      .switchMap(order => {
          return this.httpClient.get(APP_DI_CONFIG.apiEndpoint + '/po/' + order.id + '/download', {
            responseType: ResponseContentType.ArrayBuffer
          });
      })
      .subscribe((res) => {
        let file = new Blob([res.arrayBuffer()], {type: 'application/pdf'});
        let pdfUrl = window.URL.createObjectURL(file);

        if (isSafari) {
          setTimeout(() => {
            w.print();
          }, 500);
          w.location.assign(pdfUrl);
        } else {
          w = window.open(pdfUrl);
          w.print();
        }
        this.spinner.hide();
      })
  }

  convertOrder(): Observable<any> {
    return this.orderService.convertOrders(this.orderId, this.orderService.convertData)
      .map(res => res.data.order)
  }

  openWarningOrderModal(order) {
    this.modal.open(
      WarningOrderModalComponent,
      this.modalWindowService.overlayConfigFactoryWithParams({
        order_id: order.id,
        order_method: order.order_method
      }, true, 'oldschool')
    );
  }

  showEmailDataEditModal(data) {
    if (!data.email_text) {
      data.email_text = "Email text"
    }
    if (!data.po_number) {
      data.po_number = "1234567890"
    }
    this.modal.open(EditEmailDataModal, this.modalWindowService.overlayConfigFactoryWithParams(data, true, "oldschool"));
  }

}
