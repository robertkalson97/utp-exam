import { Component, EventEmitter, Input, Output } from '@angular/core';

import { OrderItemStatusFormModel } from '../../models/order-item-status-form.model';

@Component({
  selector: 'app-receive-status-line-qty-item',
  templateUrl: './receive-status-line-qty-item.component.html',
})
export class ReceiveStatusLineQtyItemComponent {

  @Input() item: OrderItemStatusFormModel = null;

  @Input() lineThrough = false;

  @Input() showEditIcon = false;

  @Output() edit = new EventEmitter();

  onEditClick(event) {
    this.edit.emit(event);
  }

}
