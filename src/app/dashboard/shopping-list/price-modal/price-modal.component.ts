import { Component, OnInit } from '@angular/core';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import * as _ from 'lodash';

import { UserService, AccountService } from '../../../core/services/index';
import { CartService, PriceInfoData, PriceInfoDiscounts } from '../../../core/services/cart.service';

export class PriceModalContext extends BSModalContext {
  public product: any;
}


@Component({
  selector: 'app-price-modal',
  templateUrl: './price-modal.component.html',
  styleUrls: ['./price-modal.component.scss']
})
@DestroySubscribers()
export class PriceModal implements OnInit, ModalComponent<PriceModalContext> {
  public subscribers: any = {};
  context: PriceModalContext;
  public filter: any = {'department': '', 'vendor': '', 'onlymy': false};
  public discounts = [];
  public selectedVendor: any = {};
  public selectedPrice: number = 0;
  public totalPrice: number = 0;
  public selectedPriceType: string;
  
  constructor(
    public dialog: DialogRef<PriceModalContext>,
    public userService: UserService,
    public accountService: AccountService,
    public cartService: CartService,
  ) {
    this.context = dialog.context;
  }
  
  ngOnInit() {
    this.selectedVendor = this.context.product.vendors.find(
      (v) => {
        return (v.vendor_variant_id == this.context.product.selected_vendor.vendor_variant_id);
      });
    if (this.context.product.price) {
      this.selectedPrice = this.context.product.price;
    } else {
      let prices:number[] =
        [this.selectedVendor.book_price,this.selectedVendor.your_price,this.selectedVendor.club_price]
        .filter((p:number)=>p);
        this.selectedPrice = Math.min(...prices);
    }
      switch (this.selectedPrice) {
        case this.selectedVendor.book_price:
          this.selectedPriceType = "book";
          break;
        case this.selectedVendor.your_price:
          this.selectedPriceType = "your";
          break;
        case this.selectedVendor.club_price:
          this.selectedPriceType = "club";
          break;
      }
    if (!_.isEmpty(this.context.product.discounts)){
      this.discounts = this.context.product.discounts.map((d:any)=>new PriceInfoDiscounts(d) );
    }
    this.calcDiscount();
  
  }
  
  setPrice(price, type) {
    if (price) {
      this.selectedPrice = price;
      this.selectedPriceType = type;
      this.calcDiscount();
    }
  }
  
  calcDiscount() {
    this.totalPrice = this.selectedPrice;
    _.each(this.discounts, (dis: PriceInfoDiscounts) => {

      switch (dis.type){
        case "bogo"       : break;
        case "percentage" : dis.total = dis.amount * this.selectedPrice / 100; break;
        default /*fixed*/ : dis.total = dis.amount;
      }

      this.totalPrice = this.totalPrice - dis.total;
    });
  }

  
  dismissModal() {
    this.dialog.dismiss();
  }
  
  closeModal(data) {
    this.dialog.close(data);
  }
  
  addDiscount() {
    this.discounts.push(new PriceInfoDiscounts());
    this.calcDiscount();
  }
  
  removeDiscount() {
    let a = this.discounts.splice(this.discounts.length - 1);
  }
  
  savePriceInfo() {
    let data:PriceInfoData = {
      price_type:this.selectedPriceType,
      price:this.selectedPrice,
      variant_id:this.context.product.variant_id,
      discounts:[]

    };
    data.discounts =_.map(this.discounts,(d:any)=>new PriceInfoDiscounts(d));
    this.cartService.updatePriceInfo(data,this.context.product.location_id)
    .subscribe(
      (r:any) => {
        this.cartService.updateCollection(r.data.items);
        this.dismissModal();
      },
      (er:any) => {
      }
    );
  }
}
