import { NgModule } from '@angular/core';
import { AppSharedModule } from '../../../shared/shared.module';
import { InventoryItemComponent } from './inventory-item.component';
import { InfoModalModule } from './default-info-modal/info-modal.module';
import { AddInventory2OrderModalModule } from './add-inventory-2order-modal/add-inventory-2order-modal.module';


@NgModule({
  declarations: [
    InventoryItemComponent
  ],
  imports: [
    AppSharedModule,
    InfoModalModule,
    AddInventory2OrderModalModule
  ],
  providers: []
})
export class InventoryItemModule {
}