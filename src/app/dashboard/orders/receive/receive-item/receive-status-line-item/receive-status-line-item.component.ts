import { Component, Input, OnInit } from '@angular/core';

import * as _ from 'lodash';

import { OrderItemStatusFormGroup } from '../../models/order-item-status-form.model';
import { ReceiveService } from '../../receive.service';
import { Observable } from 'rxjs/Observable';
import {
  ReceivedInventoryGroupLocationModel,
  ReceivedInventoryGroupModel, ReceivedInventoryGroupStorageLocationModel
} from '../../models/received-inventory-group.model';

@Component({
  selector: 'app-receive-status-line-item',
  templateUrl: './receive-status-line-item.component.html',
})

export class ReceiveStatusLineItemComponent implements OnInit {
  public removed = false;

  public inventoryGroup$: Observable<ReceivedInventoryGroupModel>;

  public location$: Observable<ReceivedInventoryGroupLocationModel>;
  public storageLocation$: Observable<ReceivedInventoryGroupStorageLocationModel>;

  @Input() public statusFormGroup: OrderItemStatusFormGroup;

  @Input() public inventoryGroupId: string;

  constructor(
    private receiveService: ReceiveService,
  ) {

  }

  get status(): string {
    return this.getControlValue('status');
  }

  get qty(): string {
    return this.getControlValue('qty');
  }

  get location_id(): string {
    return this.getControlValue('location_id');
  }

  get storage_location_id(): string {
    return this.getControlValue('storage_location_id');
  }

  get deleteControl() {
    return this.statusFormGroup.get('delete');
  }

  ngOnInit() {
    this.inventoryGroup$ = this.receiveService.getInventoryGroup(this.inventoryGroupId);

    this.location$ = this.inventoryGroup$
    .filter((r) => !!r)
    .map((inventoryGroup) => _.find(inventoryGroup.locations, {'id': this.location_id}));

    this.storageLocation$ = this.location$
    .filter((location) => !!location)
    .map((location) => _.find(location.storage_locations, {'id': this.storage_location_id}));
  }

  removePreviouslyReceivedToggle() {
    this.deleteControl.patchValue(!this.deleteControl.value);
  }

  private getControlValue(controlName: string) {
    const control = this.statusFormGroup.get(controlName);
    return control && control.value;
  }
}
