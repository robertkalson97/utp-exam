import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CategoryFilterComponent } from './category-filter.component';
import { ChipsInputModule } from '../../../components/chips-input/chips-input.module';

@NgModule({
  imports: [
    CommonModule,
    ChipsInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    CategoryFilterComponent,
  ],
  exports: [
    CategoryFilterComponent,
  ]
})
export class CategoryFilterModule {

}
