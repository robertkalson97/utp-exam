import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { AllOrdersListComponent } from './all-orders-list.component';
import { OrderTableModule } from '../directives/order-table/order-table.module';

@NgModule({
  declarations: [
    AllOrdersListComponent,
  ],
  exports: [AllOrdersListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
  providers: [],
})
export class AllOrdersListModule {

}
