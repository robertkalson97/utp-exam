import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ChipsInputModule } from '../../../components/chips-input/chips-input.module';
import { CheckboxesFilterModule } from '../checkboxes-filter/checkboxes-filter.module';
import { DateFilterModule } from '../date-filter/date-filter.module';
import { SingleCheckboxFilterModule } from '../single-checkbox-filter/single-checkbox-filter.module';
import { InventoryGroupFiltersComponent } from './inventory-group-filters.component';
import { VendorFilterModule } from '../vendor-filter/vendor-filter.module';
import { CategoryFilterModule } from '../category-filter/category-filter.module';
import { AccountingFilterModule } from '../accounting-filter/accounting-filter.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChipsInputModule,
    CheckboxesFilterModule,
    DateFilterModule,
    SingleCheckboxFilterModule,
    AccountingFilterModule,
    VendorFilterModule,
    CategoryFilterModule,
  ],
  declarations: [
    InventoryGroupFiltersComponent,
  ],
  entryComponents: [
    InventoryGroupFiltersComponent,
  ],
  exports: [
    InventoryGroupFiltersComponent,
  ]
})
export class InventoryGroupFiltersModule {

}
