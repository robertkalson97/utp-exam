import { Component, OnInit } from "@angular/core";
import { DestroySubscribers } from "ngx-destroy-subscribers";
import { CloseGuard, ModalComponent, DialogRef } from "angular2-modal";
import { BSModalContext } from "angular2-modal/plugins/bootstrap";
import { HttpClient } from "app/core/services/http.service";
import { ResponseContentType } from "@angular/http";
import { APP_DI_CONFIG } from '../../../../../../env';
import { ToasterService } from "../../../../core/services/toaster.service";
import { SpinnerService } from "../../../../core/services";

export class PhoneOrderModalContext extends BSModalContext {
  public order_id: string;
  constructor(id: string) {
   super();
    this.order_id = id;
  }
}

@Component({
  selector: 'app-phone-order-modal',
  templateUrl: './phone-order-modal.component.html',
  styleUrls: ['./phone-order-modal.component.scss']
})
@DestroySubscribers()
export class PhoneOrderModalComponent implements OnInit, CloseGuard, ModalComponent<PhoneOrderModalContext> {
  context: PhoneOrderModalContext;

  constructor(
    public dialog: DialogRef<PhoneOrderModalContext>,
    public httpClient: HttpClient,
    public toasterService: ToasterService,
    public spinner: SpinnerService
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }
  
  ngOnInit() {
  }
  
  dismissModal() {
    this.toasterService.pop('', 'Order processed. Pending receiving');
    this.dialog.dismiss();
  }
  
  closeModal() {
    let ua = navigator.userAgent.toLowerCase(); 
    let isSafari = ua.indexOf('safari') != -1;
    let w: Window;
    if (isSafari) {
      w = window.open();
    }
    
    this.spinner.show();
    return this.httpClient.get(APP_DI_CONFIG.apiEndpoint + '/po/' + this.context.order_id + '/download', {
      responseType: ResponseContentType.ArrayBuffer
    })
    .subscribe(res => {
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
    });
  }
  
}