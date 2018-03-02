import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { Component, OnInit } from '@angular/core';
import { CloseGuard, DialogRef } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { InventorySearchResults } from '../../../models/inventory.model';
import { ProductService } from '../../../core/services/product.service';
import { CustomProductModel } from '../../../models/custom-product.model';
import { ReplaySubject } from 'rxjs/ReplaySubject';


export class AddCustomProductModalContext extends BSModalContext {
  public text: any;
}

@Component({
  selector: 'app-add-custom-product-modal',
  templateUrl: './add-custom-product-modal.component.html',
  styleUrls: ['./add-custom-product-modal.component.scss']
})

@DestroySubscribers()
export class AddCustomProductModalComponent implements OnInit, CloseGuard {
  public subscribers: any = {};
  
  public addCustomProduct$: any = new ReplaySubject(1);
  public editCustomProduct:  boolean = false;
  public newProductData: any = new InventorySearchResults();
  
  constructor(
    public productService: ProductService,
    public dialog: DialogRef<AddCustomProductModalContext>,
  ) {
    dialog.setCloseGuard(this);
  }
  
  ngOnInit() {
    this.newProductData.custom_product = true;
  }
  
  addSubscribers() {
    this.subscribers.addCustomProductSubscription = this.addCustomProduct$
    .switchMap((data: CustomProductModel) => this.productService.addCustomProduct(data))
    .subscribe(res => this.closeModal(true));
  }
  
  dismissModal() {
    this.dialog.dismiss();
  }
  
  closeModal(data) {
    this.dialog.close(data);
  }
  
  addNewProduct() {
    this.newProductData.inventory_by = [
      {
        type: 'Package',
        label: this.newProductData.package_type,
        value: 'package',
        qty: (this.newProductData.sub_package.properties.unit_type) ? this.newProductData.consumableUnitQty*this.newProductData.sub_package.properties.qty : this.newProductData.consumableUnitQty,
      },
      {
        type: 'Sub Package',
        label: this.newProductData.sub_package.properties.unit_type,
        value: 'sub_package',
        qty: (this.newProductData.sub_package.properties.unit_type) ? this.newProductData.consumableUnitQty : null,
      },
      {
        type: 'Consumable Unit',
        label: this.newProductData.consumable_unit.properties.unit_type,
        value: 'consumable_unit',
        qty: 1,
      }
    ];
    
    this.newProductData.vendors = (this.newProductData.vendors[0].vendor_id) ? this.newProductData.vendors : [this.newProductData.vendors[0].vendor_name];
    
    const newCustomProduct = new CustomProductModel(this.newProductData);
    
    this.addCustomProduct$.next(newCustomProduct);
    
  }
  
}
