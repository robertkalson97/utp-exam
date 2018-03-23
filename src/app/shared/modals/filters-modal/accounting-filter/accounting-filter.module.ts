import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ChipsInputModule } from '../../../components/chips-input/chips-input.module';
import { AccountingFilterComponent } from './accounting-filter.component';

@NgModule({
  imports: [
    CommonModule,
    ChipsInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AccountingFilterComponent,
  ],
  exports: [
    AccountingFilterComponent,
  ]
})
export class AccountingFilterModule {

}
