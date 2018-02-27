import { NgModule } from '@angular/core';

import { InventoryComponent } from './inventory.component';
import { AppSharedModule } from '../../shared/shared.module';
import { InventoryItemModule } from './inventory-item/inventory-item.module';
import { AddInventoryModalModule } from './add-inventory/add-inventory-modal.module';

@NgModule({
  declarations: [
    InventoryComponent,
  ],
  imports: [
    AppSharedModule,
    InventoryItemModule,
    AddInventoryModalModule,
  ],
  providers: []
})
export class InventoryModule {
}