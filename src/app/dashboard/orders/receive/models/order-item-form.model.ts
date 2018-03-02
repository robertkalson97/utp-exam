import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderItemStatusFormGroup, OrderItemStatusFormModel } from './order-item-status-form.model';

import * as _ from 'lodash';
import { ReceivedInventoryGroupModel } from './received-inventory-group.model';

export interface ReceiveOrderItemModel {
  id: string;
  status?: OrderItemStatusFormModel[];
  status_line_items?: OrderItemStatusFormModel[];
  inventory_group_id: string;
  quantity?: number;
  item_name?: string;
  location_name?: string;
  location_id?: string;
  inventory_group: ReceivedInventoryGroupModel;
  inventory_groups: ReceivedInventoryGroupModel[];
  variant_id: string;
}

export class OrderItemFormGroup extends FormGroup {

  constructor({ id, inventory_group_id, status_line_items, quantity }: ReceiveOrderItemModel) {
    const isStatusLineItemsArray = status_line_items && _.isArray(status_line_items);
    const filteredStatusLineItems = isStatusLineItemsArray ?
      status_line_items.filter((item) => !item.qty_change) : [];
    const statusLineItemsFormGroups = filteredStatusLineItems.map(item => new OrderItemStatusFormGroup(item));

    super({
      id: new FormControl(id, Validators.required),
      inventory_group_id: new FormControl(inventory_group_id, Validators.required),
      status: new FormArray([]),
      status_line_items: new FormArray(statusLineItemsFormGroups),
      quantity: new FormControl({value: quantity, disabled: true}, Validators.required),
      note: new FormControl({value: '', disabled: true}, Validators.required),
    });
  }
}
