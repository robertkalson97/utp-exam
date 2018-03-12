import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { OrderStatus, OrderStatusValues } from '../../models/order-status';

export interface OrderReceivingStatus {
  value: string;
  text: string;
}

export class OrderItemStatusFormModel {
  type: string;
  qty: number;
  primary_status?: boolean;
  location_id: string;
  storage_location_id: string;
  status?: string;
  inventory_group_name?: string;
  location_name?: string;
  storage_location_name?: string;
  status_int?: string;
  id?: string;
  qty_change?: boolean;
  note?: string  ;
}

export class OrderItemStatusFormGroup extends FormGroup {

  constructor(
    { type,
      qty,
      primary_status = false,
      location_id,
      storage_location_id,
      status,
      inventory_group_name,
      location_name,
      storage_location_name,
      id,
    }: OrderItemStatusFormModel,
    qtyValidator?: (ctrl: FormGroup) => Observable<null | { [key: string]: any }>
  ) {
    super({
      id: new FormControl(id),
      type: new FormControl(type, Validators.required),
      qty: new FormControl(qty, [Validators.required, Validators.min(1)], qtyValidator),
      primary_status: new FormControl(primary_status),
      location_id: new FormControl(location_id),
      storage_location_id: new FormControl(storage_location_id),
      status: new FormControl(status),
      inventory_group_name: new FormControl(inventory_group_name),
      location_name: new FormControl(location_name),
      storage_location_name: new FormControl(storage_location_name),
      delete: new FormControl(false),
    }, orderItemStatusFormGroupValidator);
  }
}

export function orderItemStatusFormGroupValidator(ctrl: FormGroup) {
  if (ctrl.get('type').value === OrderStatusValues.receive) {
    return ctrl.get('location_id').value && ctrl.get('storage_location_id').value ? null : {locationRequired: true};
  }
  return null;
}
