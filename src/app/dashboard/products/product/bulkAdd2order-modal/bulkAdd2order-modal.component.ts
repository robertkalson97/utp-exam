import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash';

import { DialogRef, ModalComponent, CloseGuard, Modal } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { CartService } from '../../../../core/services/cart.service';
import { ToasterService } from '../../../../core/services/toaster.service';
import { AddToOrderData } from '../product.component';

export class BulkAdd2OrderModalContext extends BSModalContext {
  public data: AddToOrderData[];
}

@Component({
  selector: 'app-change-password-user-modal',
  // TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './bulkAdd2order-modal.component.html',
  styleUrls: ['./bulkAdd2order-modal.component.scss']
})
@DestroySubscribers()
export class BulkAdd2OrderModal implements OnInit, CloseGuard, ModalComponent<BulkAdd2OrderModalContext> {
  context: BulkAdd2OrderModalContext;
  public quantity: string = '1';
  public vendor: any = {id: "", vendor_id: ""};
  public location: string = '';
  public valid: boolean = false;
  public isAuto: boolean = true;
  public unit_type: string = null;
  public items: AddToOrderData[];
  
  constructor(
    public dialog: DialogRef<BulkAdd2OrderModalContext>,
    public cartService: CartService,
    public toasterService: ToasterService,
  ) {
    this.items = dialog.context.data;
    
    dialog.setCloseGuard(this);
  }
  
  ngOnInit() {
    // TODO
    
    console.log('CONTEXT', this.items);
  }
  
  dismissModal() {
    this.dialog.dismiss();
  }
  
  closeModal(data) {
    this.dialog.close(data);
  }
  
  validateFields() {
    // there's nothing to check now
    this.valid = true;
    return this.valid;
  }
  
  parseInt(a) {
    return parseInt(a)
  }
  
  changeUnitType() {
    this.items.map((item: AddToOrderData) => {
      if (!item.selected_unit_type) {
        item.selected_unit_type = 'unit';
      }
      let perPackage = item.units_per_package ? item.units_per_package : 1;
      let perSleeve = item.sub_unit_per_package ? item.sub_unit_per_package : 1;
      switch (item.last_unit_type) {
        case 'subunit':
          switch (this.unit_type) {
            case 'unit':
              this.quantity = Math.round(parseInt(this.quantity) / perSleeve).toString();
              break;
            case 'package':
              this.quantity = Math.round(parseInt(this.quantity) / perPackage / perSleeve).toString();
              break;
          }
          break;
        case 'unit':
          switch (item.selected_unit_type) {
            case 'subunit':
              this.quantity = Math.round(parseInt(this.quantity) * perSleeve).toString();
              break;
            case 'package':
              this.quantity = Math.round(parseInt(this.quantity) / perPackage).toString();
              break;
          }
          break;
        case 'package':
          switch (item.selected_unit_type) {
            case 'subunit':
              this.quantity = Math.round(parseInt(this.quantity) * perPackage * perSleeve).toString();
              break;
            case 'unit':
              this.quantity = Math.round(parseInt(this.quantity) * perPackage).toString();
              break;
          }
          break;
      }
      item.last_unit_type = item.selected_unit_type;
    })
    
  }
  
  vendorChange($event, item, vendors) {
    item.vendor = vendors.find((item: any) => {
      return ($event.target.value == item.vendor_id);
    });
    if ($event.target.value == '') {
      item.isAuto = true;
    } else {
      item.isAuto = false;
    }
  }
  
  saveOrder() {
    let data = {
      "location_id": null,
      "product_id": this.items[0].productId,
      "variants": this.items.map((item: AddToOrderData) => {
        return {
          "location_id": item.location_id ? item.location_id : this.items[0].locationArr[0].id,
          "vendor_id": item.isAuto ? null : item.vendor.vendor_id,
          "variant_id": item.vendor.variant_id,
          "vendor_variant_id": item.isAuto ? null :  item.vendor.variant_id,
          "qty": item.quantity,
          "unit_type": item.selected_unit_type,
          "vendor_auto_select": item.isAuto,
        }
      })
    };
    
    this.cartService.addToCart(data)
    .subscribe(() => {
      this.toasterService.pop("",  "Some products had been successfully added to the shopping list");
      this.dismissModal();
    }, (e) => console.log(e));
  }
  
}
