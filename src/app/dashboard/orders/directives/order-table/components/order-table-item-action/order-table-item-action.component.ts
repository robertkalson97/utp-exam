import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DestroySubscribers } from 'ngx-destroy-subscribers';

import { Subject } from 'rxjs/Subject';

import { PastOrderService } from '../../../../../../core/services/pastOrder.service';
import { Modal } from 'angular2-modal';
import { ToasterService } from '../../../../../../core/services/toaster.service';
import { ResendOrderModal } from '../../../../resend-order-modal/resend-order-modal.component';
import { ModalWindowService } from '../../../../../../core/services/modal-window.service';
import { OrderTableOnVoidService } from '../../order-table-on-void.service';
import { OrderFlagModalComponent } from '../../../order-flag-modal/order-flag-modal.component';
import { FavoritedListService } from '../../../../services/favorited-list.service';
import { FlaggedListService } from '../../../../services/flagged-list.service';
import { OrderStatus, OrderStatusValues } from '../../../../models/order-status';
import { OrderListType } from '../../../../models/order-list-type';

@Component({
  selector: 'app-order-table-item-action',
  templateUrl: './order-table-item-action.component.html',
})
@DestroySubscribers()

export class OrderTableItemActionComponent implements OnInit, OnDestroy {

  private updateFlagged$: any = new Subject<any>();
  private updateFavorite$: any = new Subject<any>();

  private subscribers: any = {};

  private reorderProduct$:  any = new Subject<any>();

  @Input() i: any;
  @Input() item: any;
  @Input() isShow: boolean;
  @Input() listName: string;
  @Input() uniqueField: string;

  constructor(
    public modal: Modal,
    public pastOrderService: PastOrderService,
    public modalWindowService: ModalWindowService,
    public toasterService: ToasterService,
    public orderTableOnVoidService: OrderTableOnVoidService,
    private favoritedListService: FavoritedListService,
    private flaggedListService: FlaggedListService,
  ) {
  }

  get isRecieveList() {
    return this.listName === OrderListType.received;
  }

  get isBackorderedList() {
    return this.listName === OrderListType.received;
  }

  get isBackorderedItem() {
    return this.item.status_int === OrderStatus.backorder;
  }

  get isReceivedItem() {
    return this.item.status_int === OrderStatus.receive;
  }

  get isViodedItem() {
    return this.item.status_int === OrderStatus.void;
  }

  ngOnInit() {
    console.log(`${this.constructor.name} Inits`);
  }

  ngOnDestroy() {
    console.log('for unsubscribing');
  }

  addSubscribers() {

    this.subscribers.updateFlaggedSubscription = this.updateFlagged$
    .switchMap((item: any) => this.flaggedListService.putItem(item))
    .subscribe( res => this.toasterService.pop('', res.flagged ? 'Flagged' : 'Unflagged'),
      err => console.log('error')
    );

    this.subscribers.updateFavoriteSubscription = this.updateFavorite$
    .switchMap((item: any) => this.favoritedListService.postItem(item))
    .subscribe( res => this.toasterService.pop('', res.favorite ? 'Favorite' : 'Unfavorite'),
      err => console.log('error')
    );

    this.subscribers.reorderProductFromOrderSubscription = this.reorderProduct$
    .switchMap((data) => this.pastOrderService.reorder(data))
    .subscribe((res: any) => this.toasterService.pop('', res.msg));

  }

  setFavorite(item) {
    this.updateFavorite$.next(item);
  }

  buyAgainOrder(item) {
    const data = {
      'orders': [
        {
          'order_id': item.order_id,
          'items_ids': [item[this.uniqueField]],
        }
      ]
    };
    this.reorderProduct$.next(data);
  }

  openResendDialog(item) {
    this.modal
    .open(ResendOrderModal, this.modalWindowService
    .overlayConfigFactoryWithParams(item, true, 'mid'));
  };

  onVoidOrder(item) {
    this.orderTableOnVoidService.onVoidOrder(item);
  }

  openAddCommentModal(item) {
    this.modal
    .open(OrderFlagModalComponent, this.modalWindowService
    .overlayConfigFactoryWithParams(item, true, 'big'))
    .then((resultPromise) => resultPromise.result)
    .then(
      (response) => {
        this.updateFlagged$.next({...item, flagged_comment: response.comment});
      },
      (err) => {
      }
    );
  }

  openUnflagToaster() {
    this.toasterService.pop('error', 'You cannot unflag a product with active comments');
  }

  receive() {
    this.sendToReceiveProduct(this.item, OrderStatusValues.receive);
  }

  backorder() {
    this.sendToReceiveProduct(this.item, OrderStatusValues.backorder);
  }

  edit() {
    this.sendToReceiveProduct(this.item);
  }

  private sendToReceiveProduct(item, type?) {
    const queryParams = item.order_id.toString() + '&' + item[this.uniqueField].toString();
    this.pastOrderService.goToReceive(queryParams, type);
  }

}
