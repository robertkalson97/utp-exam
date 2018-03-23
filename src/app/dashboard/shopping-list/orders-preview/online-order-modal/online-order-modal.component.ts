import { Component, OnInit } from "@angular/core";
import { DestroySubscribers } from "ngx-destroy-subscribers";
import { ModalComponent, DialogRef } from "angular2-modal";
import { BSModalContext } from "angular2-modal/plugins/bootstrap";
import { HttpClient } from "app/core/services/http.service";
import { ResponseContentType } from "@angular/http";
import { APP_DI_CONFIG } from '../../../../../../env';
import { SpinnerService, OrderService, VendorService } from "../../../../core/services";
import { ActivatedRoute, Router, Params } from "@angular/router";

export class OnlineOrderModalContext extends BSModalContext {
  public order_id: string;
  public vendor_id: string;
  constructor(o: string, v: string) {
   super();
    this.order_id = o;
    this.vendor_id = v;
  }
}

@Component({
  selector: 'app-online-order-modal',
  templateUrl: './online-order-modal.component.html',
  styleUrls: ['./online-order-modal.component.scss']
})
@DestroySubscribers()
export class OnlineOrderModalComponent implements OnInit, ModalComponent<OnlineOrderModalContext> {
  context: OnlineOrderModalContext;
  action: "Go to website" | "Email" | "Print" = "Email";
  website: string;

  constructor(
    public dialog: DialogRef<OnlineOrderModalContext>,
    public httpClient: HttpClient,
    public spinner: SpinnerService,
    public orderService: OrderService,
    public vendorService: VendorService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    this.context = dialog.context;
  }
  
  ngOnInit() {
    this.vendorService.getVendor(this.context.vendor_id).subscribe(vendor => {
      this.website = vendor.website;
    });
  }
  
  
  closeModal() {
    switch (this.action) {
      case "Go to website":
        if (this.website) {
          window.open(this.website);
        }
        this.dialog.close();
        break;
      case "Email": 
        this.route.params.subscribe((p: Params)=>{
          this.router.navigate(['/shoppinglist','purchase', this.context.order_id]);
          this.dialog.close();
        });
        break;
      case "Print":
        this.spinner.show();
        let ua = navigator.userAgent.toLowerCase(); 
        let isSafari = ua.indexOf('safari') != -1;
        let w: Window;
        if (isSafari) {
          w = window.open();
        }

        this.orderService.convertOrders(this.context.order_id, this.orderService.convertData)
        .map(res => res.data.order)
        .switchMap(order => {
          return this.orderService.sendOrderRequest(order.id)
          .switchMap(res => {
            return this.httpClient.get(APP_DI_CONFIG.apiEndpoint + '/po/' + order.id + '/download', {
              responseType: ResponseContentType.ArrayBuffer
            });
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
          this.dialog.close();
        }, (res: any) => { })
        break;
      default:
        break;
    }
    
  }
  
}