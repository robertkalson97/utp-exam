import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FiltersModalComponent } from './filters-modal.component';
import { PriceFilterModule } from './price-filter/price-filter.module';
import { CheckboxesFilterModule } from './checkboxes-filter/checkboxes-filter.module';
import { ChipsInputModule } from '../../components/chips-input/chips-input.module';
import { DateFilterModule } from './date-filter/date-filter.module';
import { SingleCheckboxFilterModule } from './single-checkbox-filter/single-checkbox-filter.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChipsInputModule,
    CheckboxesFilterModule,
    DateFilterModule,
    PriceFilterModule,
    SingleCheckboxFilterModule,
  ],
  declarations: [
    FiltersModalComponent,
  ],
  entryComponents: [
    FiltersModalComponent,
  ],
  exports: [
    FiltersModalComponent,
  ]
})
export class FiltersModalModule {

}
