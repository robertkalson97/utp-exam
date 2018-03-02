import { NgModule } from '@angular/core';

import { OrdersComponent } from './orders.component';
import { AppSharedModule } from '../../shared/shared.module';
import { ReceiveModule } from './receive/receive.module';
import { OrderModule } from './order/order.module';
import { SelectVendorModule } from './select-vendor-modal/select-vendor.module';
import { ReceivedListModule } from './received-list/received-list.module';
import { ResendOrderModalModule } from './resend-order-modal/resend-order-modal.module';
import { BackorderedListModule } from './backordered-list/backordered-list.module';
import { ReconcileModule } from './reconcile/reconcile.module';
import { AllOrdersListModule } from './all-orders-list/all-orders-list.module';
import { OpenOrdersListModule } from './open-list/open-orders-list.module';
import { ClosedListModule } from './closed-list/closed-list.module';
import { SearchFilterHeaderModule } from '../../shared/components/search-filter-header/search-filter-header.module';
import { FavoritedListModule } from './favorited-list/favorited-list.module';
import { FlaggedListModule } from './flagged-list/flagged-list.module';
import { ReconciledListModule } from './reconciled-list/reconciled-list.module';
import { ORDER_PROVIDERS } from './services';

@NgModule({
  declarations: [
    OrdersComponent,
  ],
  imports: [
    AppSharedModule,
    AllOrdersListModule,
    BackorderedListModule,
    ReceiveModule,
    ReconciledListModule,
    OrderModule,
    OpenOrdersListModule,
    FavoritedListModule,
    FlaggedListModule,
    SelectVendorModule,
    SearchFilterHeaderModule,
    ReceivedListModule,
    ClosedListModule,
    ReconcileModule,
    ResendOrderModalModule,
  ],
  providers: [
    ORDER_PROVIDERS
  ]
})
export class OrdersModule {
}
