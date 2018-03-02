import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Angular2FontawesomeModule } from 'angular2-fontawesome';

import { SearchFilterHeaderComponent } from './search-filter-header.component';
import { ChipsModule } from '../chips/chips.module';

@NgModule({
  declarations: [
    SearchFilterHeaderComponent,
  ],
  exports: [SearchFilterHeaderComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Angular2FontawesomeModule,
    ChipsModule,
  ],
  providers: [],
})
export class SearchFilterHeaderModule {

}
