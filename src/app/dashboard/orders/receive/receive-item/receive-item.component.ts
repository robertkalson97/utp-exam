import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import * as _ from 'lodash';

import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Modal } from 'angular2-modal';
import { ModalWindowService } from '../../../../core/services/modal-window.service';
import { ToasterService } from '../../../../core/services/toaster.service';
import { InventoryService } from '../../../../core/services/inventory.service';
import { AddInventoryModal } from '../../../inventory/add-inventory/add-inventory-modal.component';
import { StatusModel } from '../../../../models/receive-products.model';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ReceivedOrderService } from '../../../../core/services/received-order.service';

@Component({
  selector: 'app-receive-item',
  templateUrl: './receive-item.component.html',
})
@DestroySubscribers()

export class ReceiveItemComponent implements OnInit, OnDestroy {
  public subscribers: any = {};
  public inventoryGroupValid: boolean = true;
  public statusList: any = this.receivedOrderService.statusList;

  public newInventory$: ReplaySubject<any> = new ReplaySubject(1);
  public getReceiveProducts$: ReplaySubject<any> = new ReplaySubject(1);

  private pendingQty: number;
  private alreadyReceived: number;

  @Input() public product: any = {};
  @Input() public item: any = {};
  @Output() createInventoryEvent = new EventEmitter();

  constructor(
    public inventoryService: InventoryService,
    public toasterService: ToasterService,
    public modalWindowService: ModalWindowService,
    public modal: Modal,
    public receivedOrderService: ReceivedOrderService,
  ) {

  }

  ngOnInit() {
    this.countPendingQty();
    this.product.status[0].qty = this.pendingQty;
  }

  ngOnDestroy() {
    console.log('for unsubscribing');
  }

  addSubscribers() {
    this.subscribers.getProductFieldSubscription =
      this.newInventory$
      .switchMap((product: any) => {
        return this.receivedOrderService.getProductFields(product.variant_id)
        .map(res => {
          this.modal
          .open(AddInventoryModal, this.modalWindowService.overlayConfigFactoryWithParams({'selectedProduct': res, 'inventoryItems':[]}))
          .then((resultPromise) => {
            resultPromise.result.then(
              (res) => {
                this.createInventoryEvent.emit('success');
              },
              (err) => {}
            );
          });
        });
      })
      .subscribe();
  }

  countPendingQty(changeQty = 0) {

    this.alreadyReceived = (this.product.status_line_items) ?
      this.product.status_line_items.reduce((sum, currentStatus) => {
        return +sum + Number(currentStatus.qty);
      }, 0) : 0;

    this.pendingQty = this.product.quantity - this.alreadyReceived + changeQty;
    console.log(this.pendingQty, 11111111);
  }

  openAddInventoryModal(product) {
    this.newInventory$.next(product);
  }

  editQuantityToggle(product) {
    product.edit = !product.edit;
  }

  removePreviouslyReceivedToggle(statusLine) {
    statusLine.removed = !statusLine.removed;
  }

  onChangeProductQuantity(product) {
    product.updatedQuantity;
  }

  changeStatus(setStatus, product, curStatus) {
    curStatus.showStatusSelect = false;
    if (setStatus !== curStatus.type) {
      const filteredStatus = _.find(product.status, {'type': setStatus});
      const findReceiveStatus = _.find(product.status, {'type': 'receive'});
      let quantityStatus: boolean = false;
      let receiveStatus: boolean = false;

      if (findReceiveStatus && setStatus === 'partial receive' && curStatus.type !== 'receive'){
        this.toasterService.pop('error', `You can set either receive or partial receive status`);
        receiveStatus = true;
      }

      if (curStatus.type === 'pending' && (!filteredStatus || filteredStatus.type === 'partial receive') && !quantityStatus && !receiveStatus) {
        product.status.push(new StatusModel({
          type: 'pending',
          qty: '0',
          location_id: product.location_id,
          tmp_id: 'tmp' + Math.floor(Math.random() * 1000000)
        }));
        curStatus.type = setStatus;
      } else if (filteredStatus && (filteredStatus.type !== 'partial receive') && !quantityStatus && !receiveStatus) {
        this.toasterService.pop('error', `Status ${setStatus} exists for this product`);
      } else if ((!filteredStatus || filteredStatus.type === 'partial receive') && !quantityStatus && !receiveStatus) {
        curStatus.type = setStatus;
      }

    }
    // used setTimeout because materialize-select doesn't change the text
    setTimeout(() => { curStatus.showStatusSelect = true; }, 0.1);
    console.log(product.status);
    this.onchangeStatusQty(product, curStatus, curStatus.qty);
  }

  onchangeStatusQty(product, status, newValue) {
    status.qty = newValue;

    // const alreadyReceived = product.status_line_items.reduce((sum, currentStatus) => {
    //   return +sum + Number(currentStatus.qty);
    // }, 0);

    const pendingSum  = product.status.reduce((sum, currentStatus) => {
      if (currentStatus.type === 'pending') {
        return +sum;
      } else {
        return +sum + Number(currentStatus.qty);
      }
    }, 0);

    product.status.map(currentStatus => {

      if (currentStatus.type === 'pending') {
        currentStatus.qty = product.quantity - +pendingSum - this.alreadyReceived;
        if (currentStatus.qty < 0) {
          this.toasterService.pop('error', `The full amount should not be more than ${product.quantity}`);
          status.qty = Number(status.qty) + Number(currentStatus.qty);
          currentStatus.qty = 0;
        }
      }

      if (currentStatus.type === 'receive' && Number(currentStatus.qty) < Number(product.quantity)) {
        currentStatus.type = 'partial receive';
      }

      if (currentStatus.type === 'partial receive'
        && Number(currentStatus.qty) === Number(pendingSum)
        && Number(currentStatus.qty) === Number(product.quantity)) {
        currentStatus.type = 'receive';
        _.remove(product.status, {'type': 'partial receive'});
        product.status[product.status.length-1].qty = 0;
      }

      const filterPartReceiveStatus:any[] = _.filter(product.status, {'type': 'partial receive'});
      if (filterPartReceiveStatus.length && currentStatus.type === 'partial receive' && currentStatus.tmp_id === filterPartReceiveStatus[0].tmp_id) {
        currentStatus.inventoryHide = true;
      } else if (filterPartReceiveStatus.length && currentStatus.type === 'partial receive' && currentStatus.tmp_id !== filterPartReceiveStatus[0].tmp_id) {
        currentStatus.inventoryHide = false;
      }

      return currentStatus;
    });
  }

  changeLocation(location, status) {
    status.storage_location_id = location.id;
    status.location_id = location.location_id;
  }

  transformStorageLocations(item) {
    let locations = item.inventory_group.locations.reduce((acc: any[], location) => {

      const array = location.storage_locations.map(storage_location => ({
        location_id: location.location_id,
        location_name: location.name,
        ...storage_location
      }));

      return [...acc, array];
    }, []);
    item.locations = _.flatten(locations);
  }

  remove(product, status) {
    let removedStatus = _.remove(product.status, status);
    this.onchangeStatusQty(product, status, status.qty);
  }

  selectedAutocompledInventoryGroup(item, product) {
    this.inventoryGroupValid = true;
    if(item.id) {
      if (item.id === 'routerLink') {
        this.openAddInventoryModal(product);
      } else {
        product.inventory_group = item;
        product.inventory_group_id = product.inventory_group.id;
        this.transformStorageLocations(product);
      }
    }
  }

}
