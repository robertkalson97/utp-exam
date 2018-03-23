import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CheckboxesFilterComponent } from './checkboxes-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    CheckboxesFilterComponent,
  ],
  exports: [
    CheckboxesFilterComponent,
  ]
})
export class CheckboxesFilterModule {

}
