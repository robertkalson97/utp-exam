import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { Observable } from 'rxjs/Rx';
import { VendorModel } from '../../models';
import { UserService, AccountService } from '../../core/services';
import * as _ from 'lodash';


export class DashboardFilterModalContext extends BSModalContext {
  public product: any;
}

@Component({
  selector: 'dashboard-filter-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './dashboard-filter-modal.component.html',
  styleUrls: ['./dashboard-filter-modal.component.scss']
})
@DestroySubscribers()
export class DashboardFilterModal implements OnInit, ModalComponent<DashboardFilterModalContext> {
  public context: DashboardFilterModalContext;
  public subscribers: any = {};
  public searchText: string = '';
  public modalState: number = 0;
  public location: string = '';
  public productVariant: string = '';
  public groups: Array<any> = [];
  public selectedGroup: any;

  public stockMini: number = 30;
  public stockMiniLimit: number = 30;
  public stockShelf: number = 133;
  public stockShelfLimit: number = 133;
  public stockSterlization: number = 2;
  public stockSterlizationLimit: number = 2;

  constructor(
    public dialog: DialogRef<DashboardFilterModalContext>,
    public userService: UserService,
    public accountService: AccountService,
  ) {
    this.context = dialog.context;
    this.groups.push({
      name: 'Gloves Tender Touch Nitrile',
      info: 'Gloves Tender Touch Nitrile Sempercare PF 200/box',
      counts: 13,
      min: 5,
      max: 30,
      on_hand: 15,
      critical_level: 10,
      overstock_level: 25,
    });
  }

  ngOnInit() {}

  goBackToFirst() {
    this.modalState = 0;
  }

  locationSort(event) {
    this.stockMini = Math.round(100 * Math.random());
    this.stockMiniLimit = this.stockMini;
    this.stockShelf = Math.round(100 * Math.random());
    this.stockShelfLimit = this.stockShelf;
    this.stockSterlization = Math.round(100 * Math.random());
    this.stockSterlizationLimit = this.stockSterlization;
  }

  productSort(event) {
    this.stockMini = Math.round(100 * Math.random());
    this.stockMiniLimit = this.stockMini;
    this.stockShelf = Math.round(100 * Math.random());
    this.stockShelfLimit = this.stockShelf;
    this.stockSterlization = Math.round(100 * Math.random());
    this.stockSterlizationLimit = this.stockSterlization;
  }

  searchProducts(event) {}

  stockMiniClick(value) {
    if (value === this.stockMini && value > this.stockMiniLimit) {
      setTimeout(() => {
        this.stockMini = this.stockMiniLimit;
      })
    } else if (value !== this.stockMini) {
      this.stockMini += value;
    }
  }

  stockShelfClick(value) {
    if (value === this.stockShelf && value > this.stockShelfLimit) {
      setTimeout(() => {
        this.stockShelf = this.stockShelfLimit;
      })
    } else if (value !== this.stockShelf) {
      this.stockShelf += value;
    }
  }

  stockSterlizationClick(value) {
    if (value === this.stockSterlization && value > this.stockSterlizationLimit) {
      setTimeout(() => {
        this.stockSterlization = this.stockSterlizationLimit;
      })
    } else if (value !== this.stockSterlization) {
      this.stockSterlization += value;
    }
  }

  toBackInitial() {
    this.modalState = 0;
    this.searchText = '';
  }

  toGoModal(state, index) {
    this.modalState = state;
    if (index !== undefined) {
      this.selectedGroup = this.groups[index];
    }
  }

  // sets the style of the range-field thumb;
  calcQuantityMargin(product) {
    let valueArr: number[] = [product.on_hand, product.critical_level, product.overstock_level];

    product.max = Math.max(...valueArr);
    product.min = Math.min(...valueArr);

    let quantityMargin = ((product.on_hand - product.critical_level) * 100 / (product.overstock_level - product.critical_level)).toString();
    let thumbColor = this.calcThumbColor(product.on_hand / product.overstock_level );

    let defaultLeft = {'left': '0', 'right': 'inherit'};
    let defaultRight = {'left': 'inherit', 'right': '0'};

    if (product.critical_level == null || product.overstock_level == null) {
      return { 'left': 'calc(50% - 10px)', 'background-color' : thumbColor };
    } else if (product.on_hand < product.critical_level) {
      let criticalMargin = ((product.critical_level - product.on_hand) * 100 / (product.overstock_level - product.on_hand)).toString();
      product.criticalLevel = this.checkOverlaps(criticalMargin, product);
      product.overstockLevel = defaultRight;
      return { 'left': '-18px', 'background-color' : 'red' };
    } else if (product.on_hand === product.critical_level) {
      product.criticalLevel = defaultLeft;
      product.overstockLevel = defaultRight;
      return { 'left': '-15px', 'background-color' : 'red' };
    } else if (product.on_hand > product.overstock_level) {
      let overStockMargin = ((product.overstock_level - product.critical_level) * 100 / (product.on_hand - product.critical_level)).toString();
      product.overstockLevel = this.checkOverlaps(overStockMargin, product);
      product.criticalLevel = defaultLeft;
      return { 'right': '-15px', 'background-color' : thumbColor };
    } else {
      product.criticalLevel = defaultLeft;
      product.overstockLevel = defaultRight;
      return this.checkOverlaps(quantityMargin, product, thumbColor);
    }
  }

  private calcThumbColor(number: number) {
    let value = Math.min(Math.max(0, number), 1) * 510;
    let redValue;
    let greenValue;
    if (value < 255) {
      redValue = 255;
      greenValue = Math.sqrt(value) * 16;
      greenValue = Math.round(greenValue);
    } else {
      greenValue = 255;
      value = value - 255;
      redValue = 255 - (value * value / 255);
      redValue = Math.round(redValue);
    }
    return this.rgb2hex(redValue*.9,greenValue*.9,0);
  }

  private checkOverlaps(margin, product, thumbColor = '#fff') {
    if (Number(margin) < 12 && product.on_hand < product.critical_level) {
      return { 'left': 'calc(12% - 5px)', 'background-color' : thumbColor, 'right': 'inherit' };
    } else if (Number(margin) > 88 && product.on_hand > product.overstock_level) {
      return { 'left': 'calc(88% - 25px)', 'background-color' : thumbColor, 'right': 'inherit' };
    } else if (Number(margin) > 88 && product.on_hand !== product.overstock_level) {
      return { 'left': 'calc(88% - 18px)', 'background-color' : thumbColor, 'right': 'inherit' };
    } else if (Number(margin) < 12) {
      return { 'left': 'calc(12% - 15px)', 'background-color' : thumbColor, 'right': 'inherit' };
    } else {
      return { 'left': `calc(${margin}% - 10px)`, 'background-color' : thumbColor, 'right': 'inherit' };
    }
  }

  private rgb2hex(red, green, blue) {
    let rgb = blue | (green << 8) | (red << 16);
    return '#' + (0x1000000 + rgb).toString(16).slice(1)
  }

  dismissModal() {
    this.dialog.dismiss();
  }

  closeModal(data) {
    this.dialog.close(data);
  }
}
