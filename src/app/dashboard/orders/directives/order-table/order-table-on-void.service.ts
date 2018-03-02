import { Injectable } from '@angular/core';

import { Modal } from 'angular2-modal';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash';

import { PastOrderService } from '../../../../core/services/pastOrder.service';
import { ModalWindowService } from '../../../../core/services/modal-window.service';
import { ToasterService } from '../../../../core/services/toaster.service';
import { OrderTableService } from './order-table.service';
import { AddCommentModalComponent } from '../../../../shared/modals/add-comment-modal/add-comment-modal.component';


@Injectable()
export class OrderTableOnVoidService {
  private voidOrder$: Subject<any>;
  private voidCheckedOrders$: Subject<any>;
  private openConfirmVoidModal$: Subject<any>;

  constructor(
    public modal: Modal,
    public pastOrderService: PastOrderService,
    public modalWindowService: ModalWindowService,
    public toasterService: ToasterService,
    public orderTableService: OrderTableService,
  ) {
    this.voidOrder$ = new Subject<any>();
    this.voidCheckedOrders$ = new Subject<any>();
    this.openConfirmVoidModal$ = new Subject();

    this.openConfirmVoidModal$
    .map((data) => _.isArray(data) ? [...data] : [data])
    .map((items) => _.map(items, 'id'))
    .switchMap((ids) =>
      Observable.fromPromise(
        this.modal
        .open(AddCommentModalComponent, this.modalWindowService
        .overlayConfigFactoryWithParams({
          title: `Why are you voiding this item${ids.length > 1 ? 's' : ''}?`,
          placeholder: 'Message'
        }, true, 'mid'))
        .then((resultPromise) => resultPromise.result)
      )
      .catch(() => Observable.never())
      .map((result) => ids.map((id) => ({id, message: result.body})))
    )
    .switchMap((items: any) =>
      this.pastOrderService.onVoidOrder({items})
    )
    .subscribe();

  }

  onVoidOrder(data) {
    this.openConfirmVoidModal$.next(data);
  }

}
