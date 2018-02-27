import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../shared/shared.module';
import { AppliancesComponent } from './appliances.component';

@NgModule({
  declarations: [
    AppliancesComponent
  ],
  imports: [
    AppSharedModule
  ],
  providers: []
})
export class AppliancesModule {
}