import { NgModule } from '@angular/core';

import { ShoppingListComponent } from './shopping-list.component';
import { AppSharedModule } from '../../shared/shared.module';
import { EditProductModalModule } from './edit-product-modal/edit-product-modal.module';
import { ViewProductModalModule } from './view-product-modal/view-product-modal.module';
import { ProductFilterModalModule } from './product-filter-modal/product-filter-modal.module';
import { RequestProductModalModule } from './request-product-modal/request-product-modal.module';
import { AddProductModalModule } from './add-product-modal/add-product-modal.module';
import { ShoppingListSettingsModalModule } from './shopping-list-settings-modal/shopping-list-settings.module';
import { PriceModalModule } from './price-modal/price-modal.module';
import { ShoppingListFiltersModule } from '../../shared/modals/filters-modal/shopping-list-filters/shopping-list-filters.module';

@NgModule({
  declarations: [
    ShoppingListComponent,
  ],
  imports: [
    AppSharedModule,
    AddProductModalModule,
    EditProductModalModule,
    ViewProductModalModule,
    ShoppingListSettingsModalModule,
    ShoppingListFiltersModule,
    ProductFilterModalModule,
    RequestProductModalModule,
    PriceModalModule,
  ],
  providers: []
})
export class ShoppingListModule {
}