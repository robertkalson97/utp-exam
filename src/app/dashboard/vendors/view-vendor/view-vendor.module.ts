import { NgModule } from '@angular/core';

import { ViewVendorComponent } from './view-vendor.component';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    ViewVendorComponent
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ ViewVendorComponent ]
})
export class ViewVendorModule {
}