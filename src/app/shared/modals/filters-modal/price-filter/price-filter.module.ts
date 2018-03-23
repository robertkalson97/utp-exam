import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PriceFilterComponent } from './price-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    PriceFilterComponent,
  ],
  exports: [
    PriceFilterComponent,
  ]
})
export class PriceFilterModule {

}
