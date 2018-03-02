import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DestroySubscribers } from 'ngx-destroy-subscribers';

import { Subject } from 'rxjs/Subject';

import { PastOrderService } from '../../../../../../core/services/pastOrder.service';
import { Modal } from 'angular2-modal';
import { ToasterService } from '../../../../../../core/services/toaster.service';
import { ResendOrderModal } from '../../../../resend-order-modal/resend-order-modal.component';
import { ModalWindowService } from '../../../../../../core/services/modal-window.service';
import { OrderTableOnVoidService } from '../../order-table-on-void.service';
import { AddCommentModalComponent } from '../../../../../../shared/modals/add-comment-modal/add-comment-modal.component';
import { ConfirmModalService } from '../../../../../../shared/modals/confirm-modal/confirm-modal.service';
import { FavoritedListService } from '../../../../services/favorited-list.service';
import { FlaggedListService } from '../../../../services/flagged-list.service';

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
  private openShowCommentModal$:  any = new Subject<any>();

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
    public confirmModalService: ConfirmModalService,
    private favoritedListService: FavoritedListService,
    private flaggedListService: FlaggedListService,
  ) {
  }
  ngOnInit() {

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

    this.subscribers.openShowCommentModalSubscription = this.openShowCommentModal$
    .switchMap((item) =>
      this.confirmModalService.confirmModal(
        'Unflag?', {text: item.flagged_comment, btn: 'Unflag'}
      )
      .filter(({success}) => success)
      .mapTo(item)
    )
    .switchMap((item) => this.flaggedListService.putItem(item))
    .subscribe(res => this.toasterService.pop('', res.favorite ? 'Flagged' : 'Unflagged'),
      err => console.log('error')
    );

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

  sendToReceiveProduct(item) {
    const queryParams = item.order_id.toString() + '&' + item[this.uniqueField].toString();
    this.pastOrderService.goToReceive(queryParams);
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
    .open(AddCommentModalComponent, this.modalWindowService
    .overlayConfigFactoryWithParams(item, true, 'mid'))
    .then((resultPromise) => {
      resultPromise.result.then(
        (comment) => {
          item.flagged_comment = comment.body;
          this.updateFlagged$.next(item);
      },
        (err) => {}
      );
    });
  }

  openShowCommentModal(item) {
    this.openShowCommentModal$.next(item);
  }

}
