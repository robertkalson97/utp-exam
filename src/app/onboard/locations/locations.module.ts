import { NgModule } from '@angular/core';

import { OnboardLocationsComponent } from './locations.component';
import { AppSharedModule } from '../../shared/shared.module';

// import { EditLocationModalModule } from '../../shared/modals/index';

@NgModule({
  declarations: [
    OnboardLocationsComponent,
  ],
  imports: [
    AppSharedModule,
    // EditLocationModalModule
  ],
  providers: []
})
export class OnboardLocationsModule {
}