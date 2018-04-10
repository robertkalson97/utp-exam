import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DialogRef, ModalComponent } from 'angular2-modal';
import { Observable } from 'rxjs/Observable';

import { AccountService } from '../../../../core/services/account.service';
import { ProductService } from '../../../../core/services/product.service';
import { MarketplaceFiltersModel } from './marketplace-filters.model';

export class MarketplaceFiltersModalContext extends BSModalContext {
  public filters: any;
}
@Component({
  selector: 'app-marketplace-filters',
  templateUrl: './marketplace-filters.component.html',
})
@DestroySubscribers()
export class MarketplaceFiltersComponent implements OnInit, ModalComponent<MarketplaceFiltersModalContext> {
  private subscribers: any = {};
  public context;
  public filterForm: FormGroup;
  public departmentCollection$: Observable<any> = this.accountService.getDepartments();

  constructor(
    public dialog: DialogRef<MarketplaceFiltersModalContext>,
    private accountService: AccountService,
    private productService: ProductService,
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
      retired: new FormControl(),
      hazardous: new FormControl(),
      trackable: new FormControl(),
      tax_exempt: new FormControl(),
      most_frequently_ordered: new FormControl(),
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
  get retiredControl() {
    return this.filterForm.get('retired');
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
  get mostFrequentlyOrderedControl() {
    return this.filterForm.get('most_frequently_ordered');
  }

  ngOnInit() {

  }

  dismissModal() {
    this.dialog.dismiss();
  }

  applyFilters() {
    const filters = new MarketplaceFiltersModel(this.filterForm.value);
    Object.keys(filters).forEach((key) => (filters[key] == null) && delete filters[key]);
    this.productService.filterBy$.next(filters);
    this.dialog.dismiss();
  }

}
