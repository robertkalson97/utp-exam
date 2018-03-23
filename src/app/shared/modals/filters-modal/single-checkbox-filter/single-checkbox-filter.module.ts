import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SingleCheckboxFilterComponent } from './single-checkbox-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    SingleCheckboxFilterComponent,
  ],
  exports: [
    SingleCheckboxFilterComponent,
  ]
})
export class SingleCheckboxFilterModule {

}
