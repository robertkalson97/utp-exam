import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { FileUploadService } from '../../../../../core/services/file-upload.service';
import { APP_DI_CONFIG } from '../../../../../../../env';
import { OrderService } from '../../../../../core/services/order.service';
import { Router } from '@angular/router';
import { PhoneMaskService } from '../../../../../core/services/phone-mask.service';
import { ToasterService } from '../../../../../core/services/toaster.service';

export class AttachmentUploadModel {
  file_name: string;
  s3_object: string;
  id: string;
  ts: string;
  uri: string;
  type: string;
}

export class EditEmailDataModalContext extends BSModalContext {
  public email_text: string;
  public po_number: string;
  public order_method: string;
  public user_email: string;
  public vendor_email: string;
  public order_id: string;
  public attachments: any[] = [];
  public preview_id: string;
  public from_fax_number: string;
  public rmFn: any;
}

@Component({
  selector: 'edit-email-data-modal',
  templateUrl: './edit-email-data-modal.component.html',
  styleUrls: ['./edit-email-data-modal.component.scss']
})
@DestroySubscribers()
export class EditEmailDataModal implements OnInit, AfterViewInit, ModalComponent<EditEmailDataModalContext> {
  public subscribers: any = {};
  context: EditEmailDataModalContext;

  fileIsOver: boolean = false;
  
  public file$: Observable<any>;
  public file;
  public loadFile$: Subject<any> = new Subject<any>();
  public addFileToFile$: Subject<any> = new Subject<any>();
  public deleteFromFile$: Subject<any> = new Subject<any>();
  public updateFile$: Subject<any> = new Subject<any>();
  
  public emailTo:string;
  public emailFrom:string;
  public emailSubject:string;
  public emailMessage:string;
  public faxNumber:string;
  public hasDocs: boolean;
  public hasFiles: boolean;
  public apiUrl:string;
  public faxCountry: any;
  public phoneMask = this.phoneMaskService.defaultTextMask;
  
  constructor(
      public dialog: DialogRef<EditEmailDataModalContext>,
      public fileUploadService: FileUploadService,
      public orderService: OrderService,
      public router: Router,
      public phoneMaskService: PhoneMaskService,
      public toasterService: ToasterService,
  ) {
    this.context = dialog.context;
    this.emailMessage = this.context.email_text;
    this.emailFrom = this.context.user_email;
    this.emailTo = this.context.vendor_email;
  
    this.faxNumber = this.phoneMaskService.getPhoneByIntlPhone(this.context.from_fax_number);
    this.faxCountry = this.phoneMaskService.getCountryArrayByIntlPhone(this.context.from_fax_number);

    this.emailSubject = "Purchase order #"+this.context.po_number;
    this.fileActions();
    this.apiUrl = APP_DI_CONFIG.apiEndpoint;
  }

  ngOnInit(){
    this.loadFile$.next(this.context.attachments || []);
  }

  ngAfterViewInit(){
  }

  // File add, delete actions
  fileActions(): any {
    let addFileToFile$ = this.addFileToFile$
    .switchMap((file:File)=>this.fileUploadService.uploadAttachment(this.context.order_id,file[0]))
    .map((res:any)=>res.data)
    .switchMap((res:AttachmentUploadModel) => {
      return this.file$.first()
      .map((file: any) => {
        file = file.concat(res);
        return file;
      });
    });
    
    let tmpFile;
    let deleteFromFile$ = this.deleteFromFile$
    .switchMap((attach: AttachmentUploadModel) => {
      tmpFile = attach;
      return this.fileUploadService.deleteAttachment(this.context.order_id, attach);
    })
    .filter((status:any)=>status)
    .switchMap(() => {
      this.file$.subscribe((res) => {
        console.log('Model Service delete from file ' + res);
      });
      return this.file$.first()
      .map((file: any) => {
        return file.filter((el: any) => {
          return el.id != tmpFile.id;
        });
      });
    });

    this.file$ = Observable.merge(
      this.loadFile$,
      this.updateFile$,
      addFileToFile$,
      deleteFromFile$
    ).publishReplay(1).refCount();
    this.file$.subscribe(res => {
      console.log('files',res);
      this.file = res;
      this.hasFiles = res.length > 0;
    });
  }

  dismissModal(){
    this.dialog.dismiss();
  }

  closeModal(data){
    this.dialog.close(data);
  }

  // upload by filedrop
  fileOver(fileIsOver: boolean): void {
    this.fileIsOver = fileIsOver;
  }

  onFileDrop(file: any): void {
    let myReader: any = new FileReader();
    myReader.fileName = file.name;
    this.addFile(file);
  }

  onFileUpload(event) {
    this.onFileDrop(event.target.files[0]);
  }

  addFile(file) {
    this.addFileToFile$.next([file]);
  }

  removeFile(file) {
    console.log(`remove ${file.file_name}`);
    this.deleteFromFile$.next(file);
  }

  getType(mime){
    return mime.split('/')[0];
  }

  sendPO(){
    this.orderService.sendOrderRequestFinal(this.context.order_id,{
      body:this.emailMessage,
      subject:this.emailSubject,
      vendor_email_address:this.emailTo,
      from_email_address:this.emailFrom,
      fax_number:this.faxCountry[2] + ' ' + this.faxNumber,
    })
    .subscribe((res: any) => {
      this.toasterService.pop('','Successfully sent');
      this.closeModal(true);
      if (this.context.rmFn) {
        this.context.rmFn();
      }
    });
  }
}
