import { NgModule } from '@angular/core';

import { CongratsComponent } from './congrats.component';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    CongratsComponent,
  ],
  imports: [
    AppSharedModule
  ],
  providers: []
})
export class CongratsModule {
}