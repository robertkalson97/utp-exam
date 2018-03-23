import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { DestroySubscribers } from 'ngx-destroy-subscribers';

import { AccountService } from '../../../../core/services/account.service';

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
})
@DestroySubscribers()
export class CategoryFilterComponent implements OnInit {

  public categories = new FormControl([]);
  public productCategoriesCollection = {};

  public autocompleteCategories = {
    autocompleteOptions: {
      data: this.productCategoriesCollection,
      limit: Infinity,
      minLength: 0,
    }
  };

  private subscribers: any = {};

  constructor(
    private accountService: AccountService,
  ) {
  }

  ngOnInit() {
    this.subscribers.getProductCategoriesSubscription = this.accountService.getProductCategories()
    .subscribe((res: any) => {
      const categoriesData = [...res];
      categoriesData.map((category) =>
        this.productCategoriesCollection[category] = null
      );
    });
  }

}
