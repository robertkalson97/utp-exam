import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChipsComponent } from './chips.component';
import { Angular2FontawesomeModule } from 'angular2-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    Angular2FontawesomeModule,
  ],
  exports: [
    ChipsComponent,
  ],
  declarations: [
    ChipsComponent,
  ],
})
export class ChipsModule {

}
