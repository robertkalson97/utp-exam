import { NgModule } from '@angular/core';

import { TransferComponent } from './transfer.component';
import { AppSharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    TransferComponent
  ],
  imports: [
    AppSharedModule
  ],
  providers: []
})
export class TranseferModule {
}