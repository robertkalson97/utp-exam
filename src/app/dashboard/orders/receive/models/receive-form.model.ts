import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderFormGroup, ReceiveOrderModel } from './order-form.model';

export interface ReceiveVendor {
  vendor_name: string;
  vendor_id: string;
}

export interface ReceiveFormModel {
  invoice_number?: string;
  packing_slip_number?: string;
  orders: ReceiveOrderModel[];
  vendor: ReceiveVendor;
}

export class ReceiveFormGroup extends FormGroup {

  constructor({ orders, vendor }: ReceiveFormModel) {
    const ordersGroups = orders.map((order) => new OrderFormGroup(order));
    super({
      invoice_number: new FormControl(),
      packing_slip_number: new FormControl(''),
      orders: new FormArray(ordersGroups),
      vendor: new FormGroup({
        vendor_id: new FormControl(vendor.vendor_id, Validators.required),
        vendor_name: new FormControl(vendor.vendor_name, Validators.required),
      })
    });
  }
}
