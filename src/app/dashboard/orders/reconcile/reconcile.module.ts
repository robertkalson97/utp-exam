import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReconcileComponent } from './reconcile.component';

@NgModule({
  declarations: [
    ReconcileComponent,
  ],
  imports: [
    AppSharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: []
})
export class ReconcileModule {
}