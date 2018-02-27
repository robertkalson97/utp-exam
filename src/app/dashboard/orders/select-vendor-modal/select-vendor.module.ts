import { NgModule } from '@angular/core';
import { AppSharedModule } from '../../../shared/shared.module';
import { SelectVendorModal } from './select-vendor.component';


@NgModule({
  declarations: [
    SelectVendorModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ SelectVendorModal ]
})
export class SelectVendorModule {
}