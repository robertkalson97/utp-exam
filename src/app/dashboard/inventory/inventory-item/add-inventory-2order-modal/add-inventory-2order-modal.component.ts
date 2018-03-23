import { Component, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { CartService } from '../../../../core/services/cart.service';
import { ToasterService } from '../../../../core/services/toaster.service';

export class AddInventory2OrderModalContext extends BSModalContext {
  public data: any;
}

@Component({
  selector: 'add-inventory-2order-modal',
  templateUrl: './add-inventory-2order-modal.component.html',
  styleUrls: ['./add-inventory-2order-modal.component.scss']
})

@DestroySubscribers()

export class AddInventory2OrderModal implements OnInit, OnDestroy, ModalComponent<AddInventory2OrderModalContext> {
  context: AddInventory2OrderModalContext;
  public subscribers: any = {};
  public inventory: any;
  public defaultProduct: any;

  constructor(
    public dialog: DialogRef<AddInventory2OrderModalContext>,
    public cartService: CartService,
    public toasterService: ToasterService,
  ) {
    this.context = dialog.context;
  }

  ngOnInit() {
    this.inventory = this.context.data.inventory;

    let isDefaulProduct = _.find(this.inventory.inventory_products, 'default_product');
    this.defaultProduct = (isDefaulProduct) ? isDefaulProduct : this.inventory.inventory_products[0];

    var location_id = this.context.data.location_id;
    let all_locations = this.context.data.locations;
    let selected_location = all_locations.filter(
      function(item){
        return item.id === location_id;
      }
    );

    location_id = (selected_location.length > 0 ? selected_location : all_locations)[0]['id'];

    // this must be done last so that if no location_id is passed we find the right location
    let inventory_location = this.inventory.inventory_item_locations.filter(
      function(item){
        return item.location_id === location_id;
      }
    );

    this.defaultProduct.location_id = location_id;

    if (inventory_location[0] && inventory_location[0].on_hand != null && inventory_location[0].fully_stocked != null) {
      this.defaultProduct.qty = Math.max(inventory_location[0].fully_stocked - inventory_location[0].on_hand, 1);
    } else {
      this.defaultProduct.qty = 1;
    }
  }

  ngOnDestroy() {
    console.log('for unsubscribing')
  }

  saveOrder() {
    let noVendorAutoSelect = !!(this.defaultProduct.vendor_id);
    let data = {
      "product_id": this.defaultProduct.product_id,
      "account_product_id": this.defaultProduct.account_product_id,
      "variants": [
        {
          "location_id": this.defaultProduct.location_id,
          "variant_id": this.defaultProduct.variant_id,
          "account_variant_id": this.defaultProduct.account_variant_id,
          "vendor_variant_id": null,
          "vendor_id": this.defaultProduct.vendor_id,
          "qty": this.defaultProduct.qty,
          "vendor_auto_select": !noVendorAutoSelect,
          "unit_type": this.inventory.inventory_by,
        }
      ]
    };

   this.subscribers.addToCartSubscription = this.cartService.addToCart(data)
    .subscribe(() => {
      this.toasterService.pop("", this.defaultProduct.name + " successfully added to the shopping list");
      this.dismissModal();
    }, (error) => console.log(error));
  }

  dismissModal() {
    this.dialog.dismiss();
  }

  closeModal(data) {
    this.dialog.close(data);
  }
}
