import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ChipsInputModule } from '../../../components/chips-input/chips-input.module';
import { VendorFilterComponent } from './vendor-filter.component';

@NgModule({
  imports: [
    CommonModule,
    ChipsInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    VendorFilterComponent,
  ],
  exports: [
    VendorFilterComponent,
  ]
})
export class VendorFilterModule {

}
