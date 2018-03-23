import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';
import * as _ from 'lodash';

import { ProductModel } from '../../../models/index';
import { UserService, AccountService } from '../../../core/services/index';
import { ProductService } from "../../../core/services/product.service";
import { ModalWindowService } from "../../../core/services/modal-window.service";

export class ViewProductModalContext extends BSModalContext {
  public product: any;
}

@Component({
  selector: 'app-add-product-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './add-product-modal.component.html',
  styleUrls: ['./add-product-modal.component.scss']
})
@DestroySubscribers()
export class AddProductModal implements OnInit, AfterViewInit, ModalComponent<ViewProductModalContext> {
  public subscribers: any = {};
  context: ViewProductModalContext;
  public product: any;
  public variation: any = {};
  public variationArrs = {
    package_type: [],
    unit_type: [],
    units_per_package: [],
    size: [],
    material: [],
    price_range: []
  };
  public comment: any = {};

  public variants = [];
  public variants$: BehaviorSubject<any> = new BehaviorSubject([]);
  public filterSelectOption$: BehaviorSubject<any> = new BehaviorSubject({});
  public filterName$: BehaviorSubject<any> = new BehaviorSubject(null);
  public filterPrice$ = new BehaviorSubject(null);
  public filteredVariants$;
  public comments$ = new BehaviorSubject([]);
  public addToComments$ = new Subject();
  public filteredComments$;

  // @ViewChild('secondary') secondaryLocationLink: ElementRef;

  constructor(
      public dialog: DialogRef<ViewProductModalContext>,
      public userService: UserService,
      public accountService: AccountService,
      public productService: ProductService,
      public modalWindowService: ModalWindowService
  ) {
    this.context = dialog.context;
  }

  ngOnInit(){
    // this.product = this.context.product;
    // this.product.hazardous_string = this.product.hazardous ? 'Yes' : 'No';
    // this.product.trackable_string = this.product.trackable ? 'Yes' : 'No';
    // this.product.tax_exempt_string = this.product.tax_exempt ? 'Yes' : 'No';
    // this.product.comments = [];
    // // this.subscribers.getProductCommentsSubscription = this.productService.getProductComments(this.context.product.id)
    // //   .filter(res=>res.data)
    // //   .subscribe(res => {
    // //     this.product.comments = res.data.comments || [];
    // //     this.product.comments.map(item => {
    // //       item.body = item.body.replace(/(?:\r\n|\r|\n)/g, "<br />");
    // //       return item;
    // //     })
    // // });
    // let addToComments$ = this.addToComments$.switchMap((item: any) => {
    //   return this.comments$.first().map(collection => {
    //     collection.unshift(item);
    //     return collection;
    //   })
    // });
    this.variants$.next([{},{},{}])

    this.filteredVariants$ = Observable.combineLatest(
      this.variants$,
      this.filterName$
    )
      .map(([variants,filterName]) => {

        if(filterName && filterName != "") {
          variants = _.reject(variants, (variant: any) =>{
            let key = new RegExp(filterName, 'i');
            return !key.test(variant.name);
          });
        }
        return variants;
    });
  }

  ngAfterViewInit(){
    // this.subscribers.dashboardLocationSubscription = this.accountService.dashboardLocation$.subscribe((res: any) => {
    //   this.chooseTabLocation(res);
    //   if (res && res.id != this.primaryLocation.id){
    //     this.secondaryLocationLink.nativeElement.click();
    //   }
    // });
  }

  dismissModal(){
    this.dialog.dismiss();
  }

  closeModal(data){
    this.dialog.close(data);
  }

  changeName(event) {
    this.filterName$.next(event.target.value.trim())
  }


}
