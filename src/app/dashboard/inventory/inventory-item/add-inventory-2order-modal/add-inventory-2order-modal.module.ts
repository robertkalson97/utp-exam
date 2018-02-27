import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../../shared/shared.module';
import { AddInventory2OrderModal } from './add-inventory-2order-modal.component';

@NgModule({
  declarations: [
    AddInventory2OrderModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ AddInventory2OrderModal ]
})
export class AddInventory2OrderModalModule {

}