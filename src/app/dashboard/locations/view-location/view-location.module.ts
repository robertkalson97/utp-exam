import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { ViewLocationComponent } from './view-location.component';

@NgModule({
  declarations: [
    ViewLocationComponent
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ ViewLocationComponent ]
})
export class ViewLocationModule {
}