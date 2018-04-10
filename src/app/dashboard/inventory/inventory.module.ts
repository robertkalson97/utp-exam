import { NgModule } from '@angular/core';

import { InventoryComponent } from './inventory.component';
import { AppSharedModule } from '../../shared/shared.module';
import { InventoryItemModule } from './inventory-item/inventory-item.module';
import { AddInventoryModalModule } from './add-inventory/add-inventory-modal.module';
import { InventoryGroupFiltersModule } from '../../shared/modals/filters-modal/inventory-group-filters/inventory-group-filters.module';

@NgModule({
  declarations: [
    InventoryComponent,
  ],
  imports: [
    AppSharedModule,
    InventoryItemModule,
    AddInventoryModalModule,
    InventoryGroupFiltersModule,
  ],
  providers: []
})
export class InventoryModule {
}