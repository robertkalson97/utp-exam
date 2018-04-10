import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ChipsInputModule } from '../../../components/chips-input/chips-input.module';
import { CheckboxesFilterModule } from '../checkboxes-filter/checkboxes-filter.module';
import { DateFilterModule } from '../date-filter/date-filter.module';
import { SingleCheckboxFilterModule } from '../single-checkbox-filter/single-checkbox-filter.module';
import { OrdersPageFiltersComponent } from './orders-page-filters.component';
import { VendorFilterModule } from '../vendor-filter/vendor-filter.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChipsInputModule,
    CheckboxesFilterModule,
    DateFilterModule,
    SingleCheckboxFilterModule,
    VendorFilterModule,
  ],
  declarations: [
    OrdersPageFiltersComponent,
  ],
  entryComponents: [
    OrdersPageFiltersComponent,
  ],
  exports: [
    OrdersPageFiltersComponent,
  ]
})
export class OrdersPageFiltersModule {

}
