import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';

import { VendorModel } from '../../../models/index';
import { UserService, AccountService } from '../../../core/services/index';

export class ProductFilterModalContext extends BSModalContext {
  public product: any;
}

@Component({
  selector: 'app-product-filter-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './product-filter-modal.component.html',
  styleUrls: ['./product-filter-modal.component.scss']
})
@DestroySubscribers()
export class ProductFilterModal implements OnInit, CloseGuard, ModalComponent<ProductFilterModalContext> {
  public subscribers: any = {};
  context: ProductFilterModalContext;

  constructor(
      public dialog: DialogRef<ProductFilterModalContext>,
      public userService: UserService,
      public accountService: AccountService
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit(){
    // this.vendor = new VendorModel(this.context.product);
    // this.locations$ = this.accountService.locations$.map((res: any) => {
    //   this.primaryLocation = _.find(res, {'location_type': 'Primary'}) || res[0];
    //   let secondaryLocations = _.filter(res, (loc) => {
    //     return this.primaryLocation != loc;
    //   });
    //   return secondaryLocations;
    // });
  }

  dismissModal(){
    this.dialog.dismiss();
  }

  closeModal(data){
    this.dialog.close(data);
  }
}
