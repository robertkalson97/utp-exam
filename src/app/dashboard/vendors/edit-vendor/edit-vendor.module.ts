import { NgModule } from '@angular/core';

import { EditVendorComponent } from './edit-vendor.component';
import { AppSharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmModalModule } from '../../../shared/modals/confirm-modal/confirm-modal.module';

@NgModule({
  declarations: [
    EditVendorComponent
  ],
  imports: [
    AppSharedModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmModalModule,
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ EditVendorComponent ]
})
export class EditVendorModule {
}
