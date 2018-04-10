import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { Observable } from 'rxjs/Observable';

import { AccountService } from '../../../../core/services/account.service';
import { InventoryService } from '../../../../core/services/inventory.service';

export class InventoryGroupFiltersModalContext extends BSModalContext {
  public filters: any;
}

@Component({
  selector: 'app-inventory-group-filters',
  templateUrl: './inventory-group-filters.component.html',
})
@DestroySubscribers()
export class InventoryGroupFiltersComponent implements OnInit, ModalComponent<InventoryGroupFiltersModalContext> {
  private subscribers: any = {};
  public context;
  public filterForm: FormGroup;
  public departmentCollection$: Observable<any> = this.accountService.getDepartments();

  constructor(
    public dialog: DialogRef<InventoryGroupFiltersModalContext>,
    public inventoryService: InventoryService,
    private accountService: AccountService,
  ) {
    this.context = dialog.context;

    this.filterForm = new FormGroup({
      vendors: new FormControl(),
      categories: new FormControl(),
      departments: new FormControl(),
      accountings: new FormControl(),
      my_favorite: new FormControl(),
      order_date_min: new FormControl(),
      order_date_max: new FormControl(),
      without_price: new FormControl(),
      below_critical_level: new FormControl(),
      above_fully_stocked: new FormControl(),
      tracking_info: new FormControl(),
      most_frequently_ordered: new FormControl(),
      hazardous: new FormControl(),
      trackable: new FormControl(),
      tax_exempt: new FormControl(),
      retired: new FormControl(),
    });

  }

  get vendorsControl() {
    return this.filterForm.get('vendors');
  }
  get categoriesControl() {
    return this.filterForm.get('categories');
  }
  get departmentsControl() {
    return this.filterForm.get('departments');
  }
  get accountingsControl() {
    return this.filterForm.get('accountings');
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
  get withoutPriceControl() {
    return this.filterForm.get('without_price');
  }
  get belowCriticalLevelControl() {
    return this.filterForm.get('below_critical_level');
  }
  get aboveFullyStockedControl() {
    return this.filterForm.get('above_fully_stocked');
  }
  get mostFrequentlyOrderedControl() {
    return this.filterForm.get('most_frequently_ordered');
  }
  get hazardousControl() {
    return this.filterForm.get('hazardous');
  }
  get trackableControl() {
    return this.filterForm.get('trackable');
  }
  get taxExemptControl() {
    return this.filterForm.get('tax_exempt');
  }
  get trackingInfoControl() {
    return this.filterForm.get('tracking_info');
  }
  get retiredControl() {
    return this.filterForm.get('retired');
  }

  ngOnInit() {

  }

  dismissModal() {
    this.dialog.dismiss();
  }

  applyFilters() {
    Object.keys(this.filterForm.value).forEach((key) => (this.filterForm.value[key] == null) && delete this.filterForm.value[key]);
    this.inventoryService.filterParams$.next(this.filterForm.value);
    this.dialog.dismiss();
  }

}
