import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DateFilterComponent } from './date-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    DateFilterComponent,
  ],
  exports: [
    DateFilterComponent,
  ]
})
export class DateFilterModule {

}
