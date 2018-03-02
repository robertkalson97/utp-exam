import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import * as _ from 'lodash';

// import { ViewProductModal } from './view-product-modal/view-product-modal.component';
// import { EditProductModal } from './edit-product-modal/edit-product-modal.component';
import { UserService, AccountService } from '../../core/services/index';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
  public searchKey$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public sortBy: string;
  public sortBy$: BehaviorSubject<any> = new BehaviorSubject(null);
  public total: number;
  public products$: Observable<any>;

  constructor(
      public modal: Modal,
      // public vendorService: VendorService
  ) {
  }

  ngOnInit() {
    this.products$ = Observable.of([
      { name: 'First', vendor_name: 'vendor1'},
      { name: 'Second', vendor_name: 'vendor2'},
    ])
    // this.vendors$ = Observable
    //     .combineLatest(
    //         // this.vendorService.combinedVendors$,
    //         this.sortBy$,
    //         this.searchKey$
    //     )
    //     .map(([vendors, sortBy, searchKey]) => {
    //       this.total = vendors.length;
    //       let filteredVendors = vendors;
    //       if (searchKey && searchKey!='') {
    //         filteredVendors = _.reject(filteredVendors, (vendor: any) =>{
    //           let key = new RegExp(searchKey, 'i');
    //           return !key.test(vendor.name);
    //         });
    //       }
    //       let order = 'desc';
    //       if (sortBy == 'A-Z') {
    //         sortBy = 'name';
    //         order = 'asc';
    //       }
    //       if (sortBy == 'Z-A') {
    //         sortBy = 'name';
    //       }
    //
    //       let sortedVendors = _.orderBy(filteredVendors, [sortBy], [order]);
    //       return sortedVendors;
    //     });
  }

  viewProductModal(product){
    // this.modal
    //     .open(ViewProductModal,  overlayConfigFactory({ product: product }, BSModalContext))
    //     .then((resultPromise)=>{
    //       resultPromise.result.then(
    //           (res) => {
    //             this.editProductModal(res);
    //           },
    //           (err)=>{}
    //       );
    //     });
  }

  editProductModal(product = null){
    // this.modal.open(EditProductModal,  overlayConfigFactory({ product: product }, BSModalContext));
  }

  searchFilter(event){
    // replace forbidden characters
    let value = event.target.value.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    this.searchKey$.next(value);
  }

  itemsSort(event) {
    let value = event.target.value;
    this.sortBy$.next(value);
  }
}
