import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterializeModule } from 'angular2-materialize';

import { ChipsInputComponent } from './chips.component';
import { HasClassModule } from '../../directives';

@NgModule({
  imports: [
    MaterializeModule,
    CommonModule,
    HasClassModule
  ],
  exports: [
    ChipsInputComponent,
  ],
  declarations: [
    ChipsInputComponent,
  ],
  providers: [],
})
export class ChipsModule {

}
