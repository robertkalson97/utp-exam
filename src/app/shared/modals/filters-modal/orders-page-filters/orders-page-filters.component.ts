import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DialogRef, ModalComponent } from 'angular2-modal';
import { PastOrderService } from '../../../../core/services/pastOrder.service';
import { OrdersPageFiltersModel } from './orders-page-filters.model';

export class OrdersPageFiltersModalContext extends BSModalContext {
  public filters: any;
}

@Component({
  selector: 'app-orders-page-filters',
  templateUrl: './orders-page-filters.component.html',
})
export class OrdersPageFiltersComponent implements OnInit, ModalComponent<OrdersPageFiltersModalContext> {
  public context;
  public filterForm: FormGroup;

  constructor(
    public dialog: DialogRef<OrdersPageFiltersModalContext>,
    public pastOrderService: PastOrderService,
  ) {
    this.context = dialog.context;

    this.filterForm = new FormGroup({
      archived: new FormControl(),
      bogo: new FormControl(),
      percent_off: new FormControl(),
      rewards: new FormControl(),
      vendors: new FormControl(),
      voided: new FormControl(),
      my_favorite: new FormControl(),
      order_date_min : new FormControl(),
      order_date_max : new FormControl(),
    });

  }
  get archivedControl() {
    return this.filterForm.get('archived');
  }
  get bogoControl() {
    return this.filterForm.get('bogo');
  }
  get percentOffControl() {
    return this.filterForm.get('percent_off');
  }
  get rewardsControl() {
    return this.filterForm.get('rewards');
  }
  get voidedControl() {
    return this.filterForm.get('voided');
  }
  get vendorsControl() {
    return this.filterForm.get('vendors');
  }
  get myFavoriteControl() {
    return this.filterForm.get('my_favorite');
  }
  get orderedFromControl() {
    return this.filterForm.get('order_date_min');
  }
  get orderedToControl() {
    return this.filterForm.get('order_date_max');
  }

  ngOnInit() {

  }

  dismissModal() {
    this.dialog.dismiss();
  }

  applyFilters() {
    const filters = new OrdersPageFiltersModel(this.filterForm.value);
    Object.keys(filters).forEach((key) => (filters[key] == null) && delete filters[key]);
    this.pastOrderService.filterQueryParams$.next(filters);
    this.dialog.dismiss();
  }

}
