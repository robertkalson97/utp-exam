import { Component, Input } from '@angular/core';

import { OrderItemStatusFormModel } from '../../models/order-item-status-form.model';

@Component({
  selector: 'app-receive-status-line-qty-item',
  templateUrl: './receive-status-line-qty-item.component.html',
})
export class ReceiveStatusLineQtyItemComponent {

  @Input() item: OrderItemStatusFormModel = null;

  @Input() lineThrough: boolean = false;

}
