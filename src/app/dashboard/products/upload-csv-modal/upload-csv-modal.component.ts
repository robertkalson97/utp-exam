import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';

import { UserService, AccountService } from '../../../core/services/index';

export class UploadCsvModalContext extends BSModalContext {
  public product: any;
}


@Component({
  selector: 'app-price-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  templateUrl: './upload-csv-modal.component.html',
  styleUrls: ['./upload-csv-modal.component.scss']
})
@DestroySubscribers()
export class UploadCsvModal implements OnInit, CloseGuard, ModalComponent<UploadCsvModalContext> {
  public subscribers: any = {};
  context: UploadCsvModalContext;
  public filter:any = {'department':'', 'vendor':'', 'onlymy':false};
  public discounts = [];
  public selectedVendor = {};
  public selectedPrice:number = 0;
  public totalPrice:number = 0;
  public fileIsOver: boolean;
  public file:File;
  public options = {
    readAs: 'DataURL'
  };
  
  constructor(
      public dialog: DialogRef<UploadCsvModalContext>,
      public userService: UserService,
      public accountService: AccountService
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  
  }

  ngOnInit(){
    console.log(this.context);
    this.selectedVendor = this.context.product.vendors.find(
      (v) => {
        return (v.vendor_variant_id == this.context.product.selected_vendor.id);
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
    if (fileIsOver){console.log('file_over')}
  }
  
  onFileUpload(event) {
    this.onFileDrop(event.target.files[0]);
  }
  
  
  onFileDrop(file: any): void {
    let myReader: any = new FileReader();
    myReader.fileName = file.name;
    this.addFile(file);
    
  }
  addFile(file) {
    try {
      this.file = file;
      console.log(this.file);
    } catch(e) {
      console.error(e);
    }
  }
  
}
