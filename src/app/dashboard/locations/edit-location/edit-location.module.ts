import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { EditLocationComponent } from './edit-location.component';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    EditLocationComponent
  ],
  imports: [
     AppSharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ EditLocationComponent ]
})
export class EditLocationModule {
}