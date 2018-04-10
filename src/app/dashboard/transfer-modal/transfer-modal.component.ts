import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { Observable } from 'rxjs/Rx';
import { VendorModel } from '../../models';
import { UserService, AccountService } from '../../core/services';
import * as _ from 'lodash';


export class TransferModalContext extends BSModalContext {
  public product: any;
}

@Component({
  selector: 'transfer-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './transfer-modal.component.html',
  styleUrls: ['./transfer-modal.component.scss']
})
@DestroySubscribers()
export class TransferModal implements OnInit, ModalComponent<TransferModalContext> {
  public context: TransferModalContext;
  public subscribers: any = {};
  public searchText: string = '';
  public modalState: number = 0;
  public location: string = '';
  public unit: string = 'Boxes';
  public groups: Array<any> = [];
  public selectedGroup: any;
  public inventories: Array<any> = [];
  public activeInventory: any = {};
  public totalMove: number = 0;

  constructor(
    public dialog: DialogRef<TransferModalContext>,
    public userService: UserService,
    public accountService: AccountService,
  ) {
    this.context = dialog.context;
    this.groups = [{
      name: 'Gloves Tender Touch Nitrile',
      info: 'Gloves Tender Touch Nitrile Sempercare PF 200/box',
      counts: 13,
      min: 5,
      max: 30,
      on_hand: 15,
      critical_level: 10,
      overstock_level: 25,
    }];
    this.inventories = [{
      stockName: 'Room A',
      stockQTY: 30,
      stockMove: null,
      stockDisabled: false,
      floorName: 'Front Desk',
      floorQTY: 2,
      floorQTYTemp: 2,
      floorLimit: 2,
      floorVisible: false,
    }, {
      stockName: 'Room B',
      stockQTY: 133,
      stockMove: null,
      stockDisabled: false,
      floorName: 'Ex. Room 1',
      floorQTY: 0,
      floorQTYTemp: 0,
      floorLimit: 0,
      floorVisible: false,
    }, {
      stockName: 'Room C',
      stockQTY: 2,
      stockMove: null,
      stockDisabled: false,
      floorName: 'Ex. Room 2',
      floorQTY: 10,
      floorQTYTemp: 10,
      floorLimit: 10,
      floorVisible: false,
    }];
  }

  ngOnInit() {}

  goBackToFirst() {
    this.modalState = 0;
  }

  locationSort(event) {
    this.inventories.forEach((inventory) => {
      inventory.stockQTY = Math.round(100 * Math.random());
    });
  }

  transferSort(event) {
    this.inventories.forEach((inventory) => {
      inventory.floorQTY = Math.round(100 * Math.random());
      inventory.floorQTYTemp = inventory.floorQTY;
      inventory.floorLimit = inventory.floorQTY;
    });
  }

  searchProducts(event) {}

  floorClick(event, index) {
    if (this.activeInventory.stockQTY - event > -1) {
      this.activeInventory.stockQTY -= event;
      this.inventories[index].floorQTY += event;
      this.inventories[index].floorQTYTemp = this.inventories[index].floorQTY;
    }
  }

  floorChange(event, index) {
    if (event - this.inventories[index].floorQTYTemp > this.activeInventory.stockQTY) {
      setTimeout(() => {
        this.inventories[index].floorQTY = this.inventories[index].floorQTYTemp;
      })
    } else {
      this.inventories[index].floorQTY = event;
      this.activeInventory.stockQTY -= (event - this.inventories[index].floorQTYTemp);
      this.inventories[index].floorQTYTemp = event;
    }
  }

  stockClick(index) {
    this.inventories.forEach((inventory, idx) => {
      if (index == idx) {
        inventory.stockDisabled = false;
      } else {
        inventory.stockDisabled = true;
      }
      inventory.floorVisible = true;
    })
    this.activeInventory = this.inventories[index];
  }

  stockMoveChanges(event) {
    if (event.stockMove > event.stockQTY) {
      setTimeout(() => {
        event.stockMove = event.stockQTY;
        this.totalMove = 0;
        this.inventories.forEach(inventory => {
          this.totalMove += inventory.stockMove;
        })
      })
    } else {
      this.totalMove = 0;
      this.inventories.forEach(inventory => {
        this.totalMove += inventory.stockMove;
      })
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

  dismissModal() {
    this.dialog.dismiss();
  }

  closeModal(data) {
    this.dialog.close(data);
  }
}
