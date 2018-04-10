import { NgModule } from '@angular/core';

import { SubInventoryModal } from './sub-inventory-modal.component';
import { AppSharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    SubInventoryModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ SubInventoryModal ]
})
export class SubInventoryModalModule {
}
