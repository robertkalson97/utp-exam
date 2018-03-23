import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import * as _ from 'lodash';

import { AccountService, UserService } from '../../../core/services/index';
import { AccountVendorModel } from '../../../models/index';
import { ProductService } from '../../../core/services/product.service';

export class BulkEditModalContext extends BSModalContext {
  public products: any;
}

@Component({
  selector: 'app-edit-product-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './bulk-edit-modal.component.html',
  styleUrls: ['./bulk-edit-modal.component.scss']
})
@DestroySubscribers()
export class BulkEditModal implements OnInit, AfterViewInit, ModalComponent<BulkEditModalContext> {
  public subscribers: any = {};
  
  public departmentCollection$: Observable<any> = new Observable<any>();
  public productAccountingCollection$: Observable<any> = new Observable<any>();
  public productCategoriesCollection$: Observable<any> = new Observable<any>();
  public workingStockCollection$: Observable<any> = new Observable<any>();
  public backStockCollection$: Observable<any> = new Observable<any>();
  public vendorCollection$: any = new BehaviorSubject(false);
  public selectInfoReady$: Observable<any> = new Observable<any>();
  public additionalInfo$: Observable<any> = new Observable<any>();
  public dataObj: any = {};
  public data: any = [];
  
  public dropdowns: any = [];
  public context: BulkEditModalContext;
  public selectedProducts: any;
  public bulk: any = {
    department: null, //
    working_stock_name: "No Change",
    working_stock: null,
    working_stock_location: null,
    back_stock_name: "No Change",
    back_stock: null,
    back_stock_location: null,
    category: null, //
    account_category: null, //
    vendor: null,
    hazardous: null, //
    perpetual_inventory: null,
    trackable: null, //
    status: null, //
    tax_exempt: null, //
    reset_msds: null, //
  };
  
  
  constructor(
    public dialog: DialogRef<BulkEditModalContext>,
    public userService: UserService,
    public accountService: AccountService,
    public productService: ProductService,
  ) {
    this.context = dialog.context;
  }

  ngOnInit() {
    this.selectedProducts = this.context.products;
    console.log(this.selectedProducts);

    this.dataObj.product_ids = [];
    _.map(this.selectedProducts, (prod: any) => {
      this.dataObj.product_ids.push(prod['id']);
    });

    this.additionalInfo$ = this.productService.getBulkEditAdditionalInfo(this.dataObj.product_ids)
    .take(1)
    .map(resp => {
      this.vendorCollection$.next(resp.data.vendors);
      return resp.data;
    });
    this.departmentCollection$ = this.accountService.getDepartments().take(1);
    this.productAccountingCollection$ = this.accountService.getProductAccounting().take(1);
    this.productCategoriesCollection$ = this.accountService.getProductCategories().take(1);
    //TODO
    this.workingStockCollection$ = this.accountService.getDepartments().take(1);
    this.backStockCollection$ = this.accountService.getDepartments().take(1);

    this.selectInfoReady$ = Observable.combineLatest(
      this.departmentCollection$,
      this.productAccountingCollection$,
      this.productCategoriesCollection$,
      this.additionalInfo$
    )
    .filter(([a, b, c, d]) => (a.length > -1 && b.length > -1 && c.length > -1 && d.vendors.length > -1 ))
    .map(([a, b, c, d]) => {
      this.dropdowns = [a, b, c, d.locations, d.locations, d.vendors]; // make a snapshot of the streams because of f'kn materialize
      return true;
    });

    this.vendorCollection$.subscribe(r => console.log('vendors', r));
  }

  ngAfterViewInit() {
  }

  dismissModal() {
    this.dialog.dismiss();
  }

  closeModal(data) {
    this.dialog.close(data);
  }

  onSubmit() {}

  checkboxChange(event, value) {
    if (!event.target.state || event.target.state == 3) {
      event.target.state = 1;
    }
    else {
      event.target.state++;
    }
    switch (event.target.state) {
      case 1:
        event.target.checked = true;
        event.target.indeterminate = false;
        value = true;
        break;
      case 2:
        event.target.checked = false;
        event.target.indeterminate = false;
        value = false;
        break;
      case 3:
        event.target.checked = false;
        event.target.indeterminate = true;
        value = null;
        break;
    }
  }

  saveBulkEdit() {
    let data = _.cloneDeep(this.bulk);
    data['back_stock_name'] = null;
    data['working_stock_name'] = null;
    _.forIn(data, (value, key) => {
      if (value !== null) {
        this.dataObj[key] = value;
      }
    });
    if (this.dataObj.working_stock_location && this.dataObj.working_stock) {
      this.dataObj['working_stock_locations'] = [{
        location_id: this.dataObj.working_stock_location,
        storage_location_id: this.dataObj.working_stock
      }];
      delete this.dataObj.working_stock_location;
      delete this.dataObj.working_stock;
    }
    if (this.dataObj.back_stock_location && this.dataObj.back_stock) {
      this.dataObj['back_stock_locations'] = [{
        location_id: this.dataObj.back_stock_location,
        storage_location_id: this.dataObj.back_stock
      }];
      delete this.dataObj.back_stock_location;
      delete this.dataObj.back_stock;
    }
    this.subscribers.updateBulkProducts$ = this.productService.bulkUpdateProducts(this.dataObj);
    this.dismissModal();
  }

  updWorkingStock(item, location = null) {
    if (item == '') {
      this.bulk.working_stock_name = "No Change";
      this.bulk.working_stock = null;
    } else {
      this.bulk.working_stock_name = item.name;
      this.bulk.working_stock = item.id;
      this.bulk.working_stock_location = location.id;
    }
  }

  updBackStock(item, location = null) {
    if (!item) {
      this.bulk.back_stock_name = "No Change";
      this.bulk.back_stock = null;
    } else {
      this.bulk.back_stock_name = item.name;
      this.bulk.back_stock = item.id;
      this.bulk.back_stock_location = location.id;
    }
  }
}
