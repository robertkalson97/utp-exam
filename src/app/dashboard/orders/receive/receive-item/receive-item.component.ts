import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { Modal } from 'angular2-modal';
import * as _ from 'lodash';

import { ModalWindowService } from '../../../../core/services/modal-window.service';
import { ToasterService } from '../../../../core/services/toaster.service';
import { InventoryService } from '../../../../core/services/inventory.service';
import { ReceivedOrderService } from '../../../../core/services/received-order.service';
import {
  OrderItemStatusFormGroup, OrderItemStatusFormModel,
  OrderReceivingStatus
} from '../models/order-item-status-form.model';
import { ReceiveService } from '../receive.service';
import { Observable } from 'rxjs/Observable';
import { OrderItemFormGroup, ReceiveOrderItemModel } from '../models/order-item-form.model';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { OrderStatusValues } from '../../models/order-status';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-receive-item',
  templateUrl: './receive-item.component.html',
  styleUrls: ['./receive-item.component.scss'],
})
@DestroySubscribers()

export class ReceiveItemComponent implements OnInit, OnDestroy {

  public minItemQuantity: number;
  public itemTotal: number;

  public statusList: OrderReceivingStatus[] = this.receivedOrderService.statusList;
  public statusList$: Observable<OrderReceivingStatus[]> = this.receivedOrderService.statusList$;

  public order$: Observable<any>;
  public item$: Observable<ReceiveOrderItemModel>;
  public itemQuantity$: Observable<number>;
  public statusLineTotal$: Observable<number>;
  public statusTotal$: Observable<number>;
  public pendingQty$: ConnectableObservable<number>;
  public statusLineItems$: Observable<OrderItemStatusFormModel[]>;
  public statusItems$: Observable<OrderItemStatusFormModel[]>;
  public inventoryGroupIds$: Observable<any[]>;
  public itemProductVariantId$: Observable<any>;
  public statusItemStatuses$: Observable<OrderReceivingStatus[]>;
  public statusLineQtyItems$: Observable<OrderItemStatusFormModel[]>;

  public formSubmitted$: Observable<boolean>;

  @Input() orderItemForm: OrderItemFormGroup;
  @Input() orderId: string;
  @Input() itemId: string;

  @Output() createInventoryEvent = new EventEmitter();

  private pendingQty: number;
  private subscribers: any = {};

  constructor(
    public inventoryService: InventoryService,
    public toasterService: ToasterService,
    public modalWindowService: ModalWindowService,
    public modal: Modal,
    public receivedOrderService: ReceivedOrderService,
    public receiveService: ReceiveService,
    private route: ActivatedRoute,
  ) {

  }

  get statusControl() {
    return this.orderItemForm.get('status') as FormArray;
  }

  get statusLineItemsControl() {
    return this.orderItemForm.get('status_line_items') as FormArray;
  }

  get inventoryGroupIdControl() {
    return this.orderItemForm.get('inventory_group_id');
  }

  get quantityControl() {
    return this.orderItemForm.get('quantity');
  }

  get noteControl() {
    return this.orderItemForm.get('note');
  }

  get editQty() {
    return this.noteControl.enabled && this.quantityControl.enabled;
  }

  ngOnInit() {

    this.formSubmitted$ = this.receiveService.formSubmitted$;

    this.order$ = this.receiveService.getOrder(this.orderId);

    this.item$ = this.receiveService.getItem(this.itemId);

    this.itemQuantity$ = this.getFormQuantity();

    this.statusLineQtyItems$ = this.getFormStatusLineQtyItems();

    this.statusLineItems$ = this.getFormStatusLineItems();

    this.statusLineTotal$ = this.statusLineItems$
    .map(this.getOrderStatusTotal);

    this.statusItems$ = this.getFormStatusItems();

    this.statusTotal$ = this.statusItems$
    .map(this.getOrderStatusTotal);


    this.statusItemStatuses$ = Observable.combineLatest(
      this.statusItems$,
      this.statusList$
    )
    .map(([statusLineItems, statusList]) => {
      const statusLineItemsStatus = statusLineItems.map((item) => ({value: item.type}));
      return _.intersectionBy(statusList, statusLineItemsStatus, 'value');
    });

    this.pendingQty$ = Observable.combineLatest(
      this.itemQuantity$,
      this.statusLineTotal$,
      this.statusTotal$,
    )
    .map(([orderTotal, statusLineTotal, statusTotal]) =>
      orderTotal - statusLineTotal - statusTotal
    )
    .distinctUntilChanged()
    .publishReplay(1);
    this.pendingQty$.connect();

    this.inventoryGroupIds$ = this.item$
    .filter((r) => !!r)
    .map((item) => _.map(item.inventory_groups, 'id'));

    this.itemProductVariantId$ = this.item$
    .filter((r) => !!r)
    .map((item) => item.variant_id);

    // Adding Quantity validators
    this.orderItemForm.setValidators([this.getItemQuantityMinValueValidator(), this.statusMaxValueValidator()]);

  }

  addSubscribers() {
    const statusType$ = this.route.queryParams
    .pluck('type')
    .map((type) => _.find(this.statusList, ['value', type]))
    .map((type) => type && type.value);

    this.subscribers.pendingQtySubscription = this.pendingQty$
    .take(1)
    .withLatestFrom(statusType$)
    .filter(([qty, type]: [number, string]) => !!type)
    .subscribe(([qty, type]: [number, string]) => {
      const data: OrderItemStatusFormModel = {
        primary_status: type === 'receive',
        location_id: null,
        storage_location_id: null,
        type,
        qty,
      };

      this.addStatusControl(data);
    });

    this.subscribers.minQtySubscriber = Observable.combineLatest(
      this.statusItems$,
      this.statusLineItems$.map((items) => items.filter((item: any) => !item.delete)),
      (statusItems, statusLineItems) => {
        const receiveList = [...statusItems, ...statusLineItems].filter((item) =>
          item.type === OrderStatusValues.receive
        );
        return receiveList.reduce((sum, item) => sum + item.qty, 0);
      }
    )
    .subscribe(qty => {
      this.minItemQuantity = qty;
    });

    this.subscribers.itemTotalSubscribtion = this.item$
    .filter((r) => !!r)
    .map((item) => item.quantity)
    .subscribe((total) => {
      this.itemTotal = total;
    });

    this.subscribers.pendingQtySubscribtion = this.pendingQty$
    .subscribe((qty) => {
      this.pendingQty = qty;
    });
  }

  ngOnDestroy() {
    console.log('for unsubscribing');
  }

  editQtyToggle() {
    if (this.editQty) {
      this.quantityControl.disable();
      this.noteControl.disable();
      this.quantityControl.reset(this.itemTotal);
    } else {
      this.quantityControl.enable();
      this.noteControl.enable();
    }
  }

  removeStatus(index) {
    this.statusControl.removeAt(index);
  }

  onStatusAdd({type, qty}) {
    this.addStatusControl({
      type,
      qty,
      primary_status: type === OrderStatusValues.receive,
      location_id: null,
      storage_location_id: null,
    });
  }

  private getFormStatusLineQtyItems() {
    return this.item$
    .map((item) =>
      item.status_line_items && item.status_line_items.filter((statusItem) => statusItem.qty_change)
    );
  }

  private getFormStatusLineItems() {
    return this.statusLineItemsControl.valueChanges
    .startWith(this.statusLineItemsControl.value)
    .shareReplay(1);
  }

  private getFormStatusItems() {
    return this.statusControl.valueChanges
    .startWith(this.statusControl.value)
    .distinctUntilChanged(_.isEqual)
    .shareReplay(1);
  }

  private getFormQuantity() {
    return this.quantityControl.valueChanges
    .startWith(this.quantityControl.value)
    .shareReplay(1);
  }

  private getOrderStatusTotal(statusLineItems: OrderItemStatusFormModel[]) {
    if (!_.isArray(statusLineItems)) {
      return 0;
    }
    return statusLineItems
    .filter((status: any) => !status.delete)
    .reduce((sum, status) => sum + status.qty, 0);
  }

  private addStatusControl(data) {
    this.statusControl.push(new OrderItemStatusFormGroup(data));
  }

  private statusMaxValueValidator() {
    return (ctrl: FormGroup) =>
      this.pendingQty >= 0 ? null : {maxItemsQty: true};
  };

  private getItemQuantityMinValueValidator() {
    return (ctrl: FormControl) => {
      const quantityCtrl = ctrl.get('quantity');
      const noteCtrl = ctrl.get('note');
      if (quantityCtrl.enabled && noteCtrl.enabled) {
        return quantityCtrl.value >= this.minItemQuantity ? null : {minItemQty: true};
      }
      return null;
    };
  }

  createNewInventoryEvent(e) {
    this.createInventoryEvent.emit(e);
  }

  // addSubscribers() {
  //   this.subscribers.getProductFieldSubscription =
  //     this.newInventory$
  //     .switchMap((product: any) => {
  //       return this.receivedOrderService.getProductFields(product.variant_id)
  //       .map(res => {
  //         this.modal
  //         .open(AddInventoryModal, this.modalWindowService.overlayConfigFactoryWithParams({'selectedProduct': res, 'inventoryItems':[]}))
  //         .then((resultPromise) => {
  //           resultPromise.result.then(
  //             (res) => {
  //               this.createInventoryEvent.emit('success');
  //             },
  //             (err) => {}
  //           );
  //         });
  //       });
  //     })
  //     .subscribe();
  // }

  // countPendingQty(changeQty = 0) {
  //
  //   this.alreadyReceived = (this.product.status_line_items) ?
  //     this.product.status_line_items.reduce((sum, currentStatus) => {
  //       return +sum + Number(currentStatus.qty);
  //     }, 0) : 0;
  //
  //   this.pendingQty = this.product.quantity - this.alreadyReceived + changeQty;
  //   console.log(this.pendingQty, 11111111);
  // }

  // openAddInventoryModal(product) {
  //   this.newInventory$.next(product);
  // }

  // editQuantityToggle(product) {
  //   product.edit = !product.edit;
  // }
  //
  // removePreviouslyReceivedToggle(statusLine) {
  //   statusLine.removed = !statusLine.removed;
  // }
  //
  // onChangeProductQuantity(product) {
  //   product.updatedQuantity;
  // }

  // changeStatus(setStatus, product, curStatus) {
  //   curStatus.showStatusSelect = false;
  //   if (setStatus !== curStatus.type) {
  //     const filteredStatus = _.find(product.status, {'type': setStatus});
  //     const findReceiveStatus = _.find(product.status, {'type': 'receive'});
  //     let quantityStatus: boolean = false;
  //     let receiveStatus: boolean = false;
  //
  //     if (findReceiveStatus && setStatus === 'partial receive' && curStatus.type !== 'receive'){
  //       this.toasterService.pop('error', `You can set either receive or partial receive status`);
  //       receiveStatus = true;
  //     }
  //
  //     if (curStatus.type === 'pending' && (!filteredStatus || filteredStatus.type === 'partial receive') && !quantityStatus && !receiveStatus) {
  //       product.status.push(new StatusModel({
  //         type: 'pending',
  //         qty: '0',
  //         location_id: product.location_id,
  //         tmp_id: 'tmp' + Math.floor(Math.random() * 1000000)
  //       }));
  //       curStatus.type = setStatus;
  //     } else if (filteredStatus && (filteredStatus.type !== 'partial receive') && !quantityStatus && !receiveStatus) {
  //       this.toasterService.pop('error', `Status ${setStatus} exists for this product`);
  //     } else if ((!filteredStatus || filteredStatus.type === 'partial receive') && !quantityStatus && !receiveStatus) {
  //       curStatus.type = setStatus;
  //     }
  //
  //   }
  //   // used setTimeout because materialize-select doesn't change the text
  //   setTimeout(() => { curStatus.showStatusSelect = true; }, 0.1);
  //   console.log(product.status);
  //   this.onchangeStatusQty(product, curStatus, curStatus.qty);
  // }

  // onchangeStatusQty(product, status, newValue) {
  //   status.qty = newValue;
  //
  //   const pendingSum  = product.status.reduce((sum, currentStatus) => {
  //     if (currentStatus.type === 'pending') {
  //       return +sum;
  //     } else {
  //       return +sum + Number(currentStatus.qty);
  //     }
  //   }, 0);
  //
  //   product.status.map(currentStatus => {
  //
  //     if (currentStatus.type === 'pending') {
  //       currentStatus.qty = product.quantity - +pendingSum - this.alreadyReceived;
  //       if (currentStatus.qty < 0) {
  //         this.toasterService.pop('error', `The full amount should not be more than ${product.quantity}`);
  //         status.qty = Number(status.qty) + Number(currentStatus.qty);
  //         currentStatus.qty = 0;
  //       }
  //     }
  //
  //     if (currentStatus.type === 'receive' && Number(currentStatus.qty) < Number(product.quantity)) {
  //       currentStatus.type = 'partial receive';
  //     }
  //
  //     if (currentStatus.type === 'partial receive'
  //       && Number(currentStatus.qty) === Number(pendingSum)
  //       && Number(currentStatus.qty) === Number(product.quantity)) {
  //       currentStatus.type = 'receive';
  //       _.remove(product.status, {'type': 'partial receive'});
  //       product.status[product.status.length-1].qty = 0;
  //     }
  //
  //     const filterPartReceiveStatus:any[] = _.filter(product.status, {'type': 'partial receive'});
  //     if (filterPartReceiveStatus.length && currentStatus.type === 'partial receive' && currentStatus.tmp_id === filterPartReceiveStatus[0].tmp_id) {
  //       currentStatus.inventoryHide = true;
  //     } else if (filterPartReceiveStatus.length && currentStatus.type === 'partial receive' && currentStatus.tmp_id !== filterPartReceiveStatus[0].tmp_id) {
  //       currentStatus.inventoryHide = false;
  //     }
  //
  //     return currentStatus;
  //   });
  // }

  // changeLocation(location, status) {
  //   status.storage_location_id = location.id;
  //   status.location_id = location.location_id;
  // }

  // transformStorageLocations(item) {
  //   let locations = item.inventory_group.locations.reduce((acc: any[], location) => {
  //
  //     const array = location.storage_locations.map(storage_location => ({
  //       location_id: location.location_id,
  //       location_name: location.name,
  //       ...storage_location
  //     }));
  //
  //     return [...acc, array];
  //   }, []);
  //   item.locations = _.flatten(locations);
  // }

  // remove(product, status) {
  //   let removedStatus = _.remove(product.status, status);
  //   this.onchangeStatusQty(product, status, status.qty);
  // }

  // selectedAutocompledInventoryGroup(item, product) {
  //   this.inventoryGroupValid = true;
  //   if(item.id) {
  //     if (item.id === 'routerLink') {
  //       this.openAddInventoryModal(product);
  //     } else {
  //       product.inventory_group = item;
  //       product.inventory_group_id = product.inventory_group.id;
  //       this.transformStorageLocations(product);
  //     }
  //   }
  // }

}
