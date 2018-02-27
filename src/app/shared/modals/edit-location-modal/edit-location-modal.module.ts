import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { EditLocationModal } from './edit-location-modal.component';
import { AppSharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    //EditLocationModal
  ],
  imports: [
    AppSharedModule,
    //FormsModule,
    //ReactiveFormsModule
  ],
  providers: [],
  exports: [
    //EditLocationModal
  ],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  //entryComponents: [EditLocationModal]
})
export class EditLocationModalModule {
}