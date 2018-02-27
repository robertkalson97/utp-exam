import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { OrderTableModule } from '../directives/order-table/order-table.module';
import { ReconciledListComponent } from './reconciled-list.component';

@NgModule({
  declarations: [
    ReconciledListComponent,
  ],
  exports: [ReconciledListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
  providers: [],
})
export class ReconciledListModule {

}
