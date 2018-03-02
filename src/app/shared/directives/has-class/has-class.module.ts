import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HasClassDirective } from './has-class.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    HasClassDirective,
  ],
  exports: [
    HasClassDirective,
  ],
})
export class HasClassModule {
}
