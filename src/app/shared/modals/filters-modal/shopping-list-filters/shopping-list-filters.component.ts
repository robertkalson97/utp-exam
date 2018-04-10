import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { Observable } from 'rxjs/Observable';

import { AccountService } from '../../../../core/services/account.service';
import { CartService } from '../../../../core/services/cart.service';

export class ShoppingListFiltersModalContext extends BSModalContext {
  public filters: any;
}

@Component({
  selector: 'app-shopping-list-filters',
  templateUrl: './shopping-list-filters.component.html',
})
@DestroySubscribers()
export class ShoppingListFiltersComponent implements OnInit, ModalComponent<ShoppingListFiltersModalContext> {
  private subscribers: any = {};
  public context;
  public filterForm: FormGroup;
  public departmentCollection$: Observable<any> = this.accountService.getDepartments();

  constructor(
    public dialog: DialogRef<ShoppingListFiltersModalContext>,
    public cartService: CartService,
    private accountService: AccountService,
  ) {
    this.context = dialog.context;

    this.filterForm = new FormGroup({
      vendors: new FormControl(),
      categories: new FormControl(),
      bogo: new FormControl(),
      percent_off: new FormControl(),
      rewards: new FormControl(),
      departments: new FormControl(),
      accountings: new FormControl(),
      my_favorite: new FormControl(),
      without_price: new FormControl(),
      tax_exempt: new FormControl(),
    });

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

  get withoutPriceControl() {
    return this.filterForm.get('without_price');
  }

  get taxExemptControl() {
    return this.filterForm.get('tax_exempt');
  }

  ngOnInit() {

  }

  dismissModal() {
    this.dialog.dismiss();
  }

  applyFilters() {
    Object.keys(this.filterForm.value).forEach((key) => (this.filterForm.value[key] == null) && delete this.filterForm.value[key]);
    this.cartService.filtersParams$.next(this.filterForm.value);
    this.dialog.dismiss();
  }
}
