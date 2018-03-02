import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderItemFormGroup, ReceiveOrderItemModel } from './order-item-form.model';

export interface ReceiveOrderModel {
  order_id: string;
  po_number?: string;
  items: ReceiveOrderItemModel[];
}

export class OrderFormGroup extends FormGroup {

  constructor({ order_id, items }: ReceiveOrderModel) {
    const itemsGroups = items.map((item) => new OrderItemFormGroup(item));
    super({
      order_id: new FormControl(order_id, Validators.required),
      items: new FormArray(itemsGroups),
    });
  }
}
