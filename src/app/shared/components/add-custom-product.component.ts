import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';

import * as _ from 'lodash';
import { InventorySearchResults } from '../../models/inventory.model';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { InventoryService } from '../../core/services/inventory.service';
import { HelpTextModal } from '../../dashboard/inventory/add-inventory/help-text-modal/help-text-modal-component';
import { ModalWindowService } from '../../core/services/modal-window.service';
import { Modal } from 'angular2-modal';

@Component({
  selector: 'app-add-custom-product',
  templateUrl: './add-custom-product.component.html',
  styleUrls: ['./add-custom-product.component.scss'],
})
@DestroySubscribers()
export class AddCustomProductComponent implements OnInit, OnDestroy {
  public subscribers: any = {};
  
  public autocompleteVendors$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public autocompleteVendors: any = [];
  public autocompleteOuterPackage$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public autocompleteOuterPackage: any = [];
  public autocompleteInnerPackage$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public autocompleteInnerPackage: any = [];
  public autocompleteConsPackage$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public vendorDirty: boolean = false;
  public vendorValid: boolean = false;
  public packDirty: boolean = false;
  
  @Input('editCustomProduct') public editCustomProduct:  boolean;
  @Input('newProductData') public newProductData: InventorySearchResults;
  @Input('items') public items: Array<{}> = [];
  @Input('innerPack') public innerPack: string = '';
  @Input('outerPack') public outerPack: string = '';
  @Input('packageType') public packageType: any = null;
  @Input('autocompleteConsPackage') public autocompleteConsPackage: any = [];
  @Output() cancelEvent = new EventEmitter();
  @Output() addEvent = new EventEmitter();
  
  constructor(
    public inventoryService: InventoryService,
    public modal: Modal,
    public modalWindowService: ModalWindowService,
  ) {
  
  }
  
  ngOnInit() {
    this.autocompleteOuterPackage$.next('');
    this.autocompleteInnerPackage$.next('');
    this.autocompleteConsPackage$.next('');

    this.newProductData.consumable_unit.properties.unit_type = (!this.editCustomProduct && !this.editCustomProduct && this.packageType && this.packageType.consumable_unit) ? this.packageType.consumable_unit.properties.unit_type : this.newProductData.consumable_unit.properties.unit_type;
  }
  
  addSubscribers() {
    this.subscribers.autocompleteVendorsSubscription = this.autocompleteVendors$
    .switchMap((key: string) => this.inventoryService.autocompleteSearchVendor(key)).publishReplay(1).refCount()
    .subscribe((vendors: any) => this.autocompleteVendors = vendors);
  
    this.subscribers.autocompleteOuterPackSubscription = this.autocompleteOuterPackage$
    .switchMap((key: string) => this.inventoryService.autocompleteSearchPackage(key)).publishReplay(1).refCount()
    .subscribe((pack: any) => this.autocompleteOuterPackage = _.sortBy(pack, ['unit_name']));
  
    this.subscribers.autocompleteInnerPackSubscription = this.autocompleteInnerPackage$
    .switchMap((key: string) => this.inventoryService.autocompleteSearchPackage(key)).publishReplay(1).refCount()
    .subscribe((pack: any) => this.autocompleteInnerPackage = _.sortBy(pack, ['plural_unit_name']));
  
    this.subscribers.autocompleteConsPackSubscription = this.autocompleteConsPackage$
    .switchMap((key: string) => this.inventoryService.autocompleteSearchPackage(key)).publishReplay(1).refCount()
    .subscribe((pack: any) => this.autocompleteConsPackage = pack);
  }
  
  ngOnDestroy() {
  
  }
  
  selectedAutocompledVendor(vendor) {
    if (!(this.newProductData.vendors.length && !vendor.vendor_id && this.newProductData.vendors[0].vendor_name === vendor)) {
      this.newProductData.vendors = (vendor.vendor_id) ? [vendor] : [{vendor_name: vendor, vendor_id: null}];
    }
  }
  onSearchVendor(event) {
    this.newProductData.vendors = [{vendor_name: event.target.value, vendor_id: null}];
    this.newProductData.vendor_name = 'Auto';
    this.newProductData.vendor_id = null;
    this.vendorDirty = true;
    this.vendorValid = !!(event.target.value);
    this.autocompleteVendors$.next(event.target.value);
  }
  observableSourceVendor(keyword: any) {
    return Observable.of(this.autocompleteVendors).take(1);
  }
  
  selectedAutocompledOuterPackage(outerPackage) {
    this.newProductData.package_type = outerPackage.unit_name;
  }
  onSearchOuterPackage(event) {
    this.autocompleteOuterPackage$.next(event.target.value);
  }
  observableSourceOuterPackage(keyword: any) {
    return Observable.of(this.autocompleteOuterPackage).take(1);
  }
  
  updateOuterPackege(event) {
    this.outerPack = (this.newProductData.package_type === event.target.value) ? this.newProductData.package_type : null;
    if (!this.outerPack) {
      this.autocompleteOuterPackage$.next('');
    }
  }
  
  selectedAutocompledInnerPackage(innerPackage) {
    this.newProductData.sub_package.properties.unit_type = innerPackage.plural_unit_name;
  }
  onSearchInnerPackage(event) {
    this.autocompleteInnerPackage$.next(event.target.value);
  }
  observableSourceInnerPackage(keyword: any) {
    return Observable.of(this.autocompleteInnerPackage).take(1);
  }
  updateInnerPackege(event) {
    this.innerPack = (this.newProductData.sub_package.properties.unit_type === event.target.value) ? this.newProductData.sub_package.properties.unit_type : null;
    if (!this.innerPack) {
      this.autocompleteInnerPackage$.next('');
    }
  }
  selectedAutocompledConsPackage(consPackage) {
    this.newProductData.consumable_unit.properties.unit_type = consPackage.unit_name ? consPackage.unit_name : consPackage;
  }
  onSearchConsPackage(event) {
    this.packDirty = true;
    this.newProductData.consumable_unit.properties.unit_type = event.target.value;
    this.autocompleteConsPackage$.next(event.target.value);
  }
  observableSourceConsPackage(keyword: any) {
    return Observable.of(this.autocompleteConsPackage).take(1);
  }
  
  addNewProduct() {
    this.addEvent.emit();
  }
  
  toggleCustomCancel() {
    this.cancelEvent.emit();
  }
  
  onUpcUpdated(upc) {
    this.newProductData.upc = upc;
  }
  
  changePrice(val) {
    const regex = /[\d\.]*/g;
    let m: any = regex.exec(val);
    regex.lastIndex++;
    let m1: any = regex.exec(val);
    if (m && m[0]) {
      val = parseFloat(m[0] ? m[0] : '0');
    } else if (m1 && m1[0]) {
      val = parseFloat(m1[0] ? m1[0] : '0');
    }
    if (!val) {
      val = 0;
    }
    return val;
  }
  
  onChangeListPrice(val) {
    let value = this.changePrice(val);
    this.newProductData.list_price = value;
    this.newProductData.formattedPrice = value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }
  
  onChangeForumPrice(val) {
    let value = this.changePrice(val);
    this.newProductData.negotiated_price = value;
    this.newProductData.formattedForumPrice = value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }
  
  onChangeClubPrice(val) {
    let value = this.changePrice(val);
    this.newProductData.club_price = value;
    this.newProductData.formattedClubPrice = value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }
  
  openHelperModal() {
    this.modal.open(HelpTextModal, this.modalWindowService
    .overlayConfigFactoryWithParams({"text": ''}, true, 'mid'))
  }
  
}
