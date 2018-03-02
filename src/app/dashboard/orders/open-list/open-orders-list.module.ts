import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { OpenOrdersListComponent } from './open-orders-list.component';
import { OrderTableModule } from '../directives/order-table/order-table.module';

@NgModule({
  declarations: [
    OpenOrdersListComponent,
  ],
  exports: [OpenOrdersListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule
  ],
})
export class OpenOrdersListModule {

}
