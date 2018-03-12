import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import * as _ from 'lodash';

import { ReceivedOrderService } from '../../../../../core/services';

import { OrderReceivingStatus } from '../../models/order-item-status-form.model';
import { OrderStatusValues } from '../../../models/order-status';

@Component({
  selector: 'app-receive-add-new-status-item',
  templateUrl: './receive-add-new-status-item.component.html',
})

export class ReceiveAddNewStatusItemComponent implements OnInit {

  public pendingStatus = OrderStatusValues.pending;

  public statusList$: Observable<OrderReceivingStatus[]> = this.receivedOrderService.statusList$;
  public newStatusList$: ReplaySubject<OrderReceivingStatus[]> = new ReplaySubject<OrderReceivingStatus[]>(1);
  public remainingStatusList$: Observable<OrderReceivingStatus[]>;

  @Input() qty: number;

  @Input()
  set selected(value: OrderReceivingStatus[]) {
    this.newStatusList$.next(value);
  }

  @Output() statusAdd: EventEmitter<{type: string, qty: number}> = new EventEmitter();

  constructor(
    private receivedOrderService: ReceivedOrderService,
  ) {
  }

  ngOnInit() {
    this.remainingStatusList$ = Observable.combineLatest(
      this.statusList$,
      this.newStatusList$,
    )
    .map(([statusList, newStatusList]) => _.differenceWith(statusList, newStatusList, _.isEqual));
  }

  onListSelect(type) {
    if (type !== this.pendingStatus) {
      this.statusAdd.emit({
        type,
        qty: this.qty,
      });
    }
  }
}
