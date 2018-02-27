import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
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
  selector: 'app-view-product-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './view-product-modal.component.html',
  styleUrls: ['./view-product-modal.component.scss']
})
@DestroySubscribers()
export class ViewProductModal implements OnInit, AfterViewInit, CloseGuard, ModalComponent<ViewProductModalContext> {
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
    dialog.setCloseGuard(this);
  }

  ngOnInit() {
    this.product = this.context.product;
    this.product.hazardous_string = this.product.hazardous ? 'Yes' : 'No';
    this.product.trackable_string = this.product.trackable ? 'Yes' : 'No';
    this.product.tax_exempt_string = this.product.tax_exempt ? 'Yes' : 'No';
    this.product.comments = [];
    // this.subscribers.getProductCommentsSubscription = this.productService.getProductComments(this.context.product.id)
    //   .filter(res=>res.data)
    //   .subscribe(res => {
    //     this.product.comments = res.data.comments || [];
    //     this.product.comments.map(item => {
    //       item.body = item.body.replace(/(?:\r\n|\r|\n)/g, "<br />");
    //       return item;
    //     })
    // });
    let addToComments$ = this.addToComments$.switchMap((item: any) => {
      return this.comments$.first().map(collection => {
        collection.unshift(item);
        return collection;
      })
    });

    this.filteredComments$ = Observable.merge(
      this.comments$,
      addToComments$
    ).map(comments => {
      let filteredComments = _.map(comments, (item: any) => {

        let regKey = new RegExp('\n,\r,\r\n','g');
        item.body = item.body.replace(regKey, "<br />"); // adding many lines comment

        let date = new Date(item.created_at);
        item.created_at = date.toDateString();

        return item;
      });
      return _.orderBy(filteredComments, (item: any) => { return new Date(item.created_at)},['desc'])
    });

    this.filteredVariants$ = Observable.combineLatest(
      this.variants$,
      this.filterSelectOption$,
      this.filterName$,
      this.filterPrice$
    )
      .map(([variants,filterSelectOption,filterName,filterPrice]) => {

        if(filterPrice && filterPrice != "") {
          variants = _.reject(variants, (variant: any) =>{
            let key = new RegExp(filterPrice, 'i');
            return !key.test(variant.name);
          });
        }
        if(filterName && filterName != "") {
          variants = _.reject(variants, (variant: any) =>{
            let key = new RegExp(filterName, 'i');
            return !key.test(variant.name);
          });
        }
        variants = _.filter(variants,filterSelectOption);
        return variants;
    });


    this.subscribers.getProductSubscription = this.productService.getProduct(this.product.id)
      .filter(res => res.data)
      .map(res => res.data)
      .subscribe(data => {
        
        this.variants = data.variants;

        this.variants$.next(data.variants); // update variants
        this.comments$.next(data.comments); // update comments


        _.each(this.variants, (variant: any)=> {
          _.forEach(this.variationArrs, (value,key) => {
            this.variationArrs[key].push(this.variationArrs[key].indexOf(variant[key]) >= 0 ? null : variant[key]);
          })
        });
        _.forEach(this.variationArrs, (value,key) => {
          this.variationArrs[key] = _.filter(this.variationArrs[key], res => res);
        });


        this.product.comments = data.comments || [];
        this.product.comments.map((item: any) => {
          let regKey = new RegExp('\n,\r,\r\n','g');
          item.body = item.body.replace(regKey, "<br />");
          return item;
        });
        this.product.comments = _.orderBy(this.product.comments, (item: any) => { return new Date(item.created_at)},['desc'])

      })
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

  checkFilterValue(event) {
    if(event.target.value.length) {
      return event.target.value;
    }
  }

  changeName(event) {
    this.filterName$.next(event.target.value.trim())
  }

  changePrice(event) {
    this.filterPrice$.next(event.target.value.trim())
  }

  changePkg(event){
    if (this.checkFilterValue(event)) {
      this.variation.package_type = event.target.value;
    }
    else {
      delete this.variation.package_type
    }
    this.filterSelectOption$.next(this.variation)
  }

  changeUnit(event){
    if (this.checkFilterValue(event)) {
      this.variation.unit_type = event.target.value;
    }
    else {
      delete this.variation.unit_type
    }
    this.filterSelectOption$.next(this.variation)
  }

  changeUnitsPkg(event){
    if (this.checkFilterValue(event)) {
      this.variation.units_per_package = parseInt(event.target.value);
    }
    else {
      delete this.variation.units_per_package
    }
    this.filterSelectOption$.next(this.variation)
  }

  changeSize(event){
    if (this.checkFilterValue(event)) {
      this.variation.size = event.target.value;
    }
    else {
      delete this.variation.size
    }
    this.filterSelectOption$.next(this.variation)
  }

  changeMaterial(event){
    if (this.checkFilterValue(event)) {
      this.variation.material = event.target.value;
    }
    else {
      delete this.variation.material
    }
    this.filterSelectOption$.next(this.variation)
  }

  sendComment() {
    Object.assign(this.comment,
      {
        "user_id": this.userService.selfData.id,
        "object_type": "products",
        "object_id": this.product.id
      }
      );
    this.subscribers.addProductSubscriber = this.productService.addProductComment(this.comment).subscribe(res => {
      this.comment.body = null;
      this.addToComments$.next(res.data)
      // this.product.comments.unshift(res.data)
    });
  }

  deleteComment(comment) {
    this.modalWindowService.confirmModal('Delete Comment?', {text: 'Are you sure you want to delete this comment?', btn: 'Delete'}, this.deleteCommentFunc.bind(this, comment.id));

  }

  deleteCommentFunc(id) {
    this.subscribers.deleteProductSubscriber = this.productService.deleteProductComment(id).subscribe(res => {
    
    })
  }

  // editVendor(vendor = null){
  //   if (this.currentLocation) {
  //     this.accountService.dashboardLocation$.next(this.currentLocation);
  //   }
  //   this.closeModal(vendor);
  // }

  // chooseTabLocation(location = null){
  //   if (location && location != this.primaryLocation) {
  //     this.sateliteLocationActive = true;
  //     this.secondaryLocation = location;
  //   } else {
  //     this.sateliteLocationActive = false;
  //   }
  //   this.currentLocation = location;
  //
  //   // fill vendor info for modal view vendor
  //   this.vendor = new VendorModel(this.context.vendor);
  //   if (location){
  //     let locationAccountVendor = _.find(this.accountVendors, {'location_id': this.currentLocation.id});
  //     _.each(locationAccountVendor, (value, key) => {
  //       if (value)
  //           this.vendor[key] = value;
  //     });
  //   }
  // }
}
