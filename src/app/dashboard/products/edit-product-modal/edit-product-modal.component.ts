import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import * as _ from 'lodash';

import { AccountService, UserService } from '../../../core/services/index';
import { AccountVendorModel } from '../../../models/index';

export class EditProductModalContext extends BSModalContext {
  public product: any;
}

@Component({
  selector: 'app-edit-product-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './edit-product-modal.component.html',
  styleUrls: ['./edit-product-modal.component.scss']
})
@DestroySubscribers()
export class EditProductModal implements OnInit, AfterViewInit, ModalComponent<EditProductModalContext> {
  public subscribers: any = {};
  public context: EditProductModalContext;
  public product: AccountVendorModel;

  constructor(
      public dialog: DialogRef<EditProductModalContext>,
      public userService: UserService,
      public accountService: AccountService
  ) {
    this.context = dialog.context;
  }

  ngOnInit(){
    this.product = this.context.product;
  }

  ngAfterViewInit(){
  }

  dismissModal(){
    this.dialog.dismiss();
  }

  closeModal(data){
    this.dialog.close(data);
  }

  onSubmit(){}
}
