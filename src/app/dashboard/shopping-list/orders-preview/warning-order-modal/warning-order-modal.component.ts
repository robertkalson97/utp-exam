import { Component, OnInit } from "@angular/core";
import { DestroySubscribers } from "ngx-destroy-subscribers";
import { ModalComponent, DialogRef } from "angular2-modal";
import { BSModalContext } from "angular2-modal/plugins/bootstrap";
import { HttpClient } from "app/core/services/http.service";
import { ResponseContentType } from "@angular/http";
import { APP_DI_CONFIG } from '../../../../../../env';
import { ToasterService } from "../../../../core/services/toaster.service";
import { SpinnerService } from "../../../../core/services";

export class WarningOrderModalContext extends BSModalContext {
  public order_id: string;
  public order_method: string;
  constructor(id: string, method: string) {
   super();
    this.order_id = id;
    this.order_method = method.toLowerCase();
  }
}

@Component({
  selector: 'app-warning-order-modal',
  templateUrl: './warning-order-modal.component.html',
  styleUrls: ['./warning-order-modal.component.scss']
})
@DestroySubscribers()
export class WarningOrderModalComponent implements OnInit, ModalComponent<WarningOrderModalContext> {
  context: WarningOrderModalContext;

  constructor(
    public dialog: DialogRef<WarningOrderModalContext>,
    public httpClient: HttpClient,
    public toasterService: ToasterService,
    public spinner: SpinnerService
  ) {
    this.context = dialog.context;
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
