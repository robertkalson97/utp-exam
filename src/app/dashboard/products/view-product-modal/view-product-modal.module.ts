import {NgModule} from '@angular/core';

import {ViewProductModal} from './view-product-modal.component';
import {AppSharedModule} from '../../../shared/shared.module';
import {VariantDetailComponent} from "./variant-detail/variant-detail.component";
import {InventoryDetailComponent} from './inventory-detail/inventory-detail.component';
import {HistoryDetailComponent} from "./history-detail/history-detail.component";

@NgModule({
    declarations: [
        ViewProductModal,
        VariantDetailComponent,
        InventoryDetailComponent,
        HistoryDetailComponent
    ],
    imports: [
        AppSharedModule
    ],
    providers: [],
    // IMPORTANT:
    // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
    // we must tell angular about it.
    entryComponents: [ViewProductModal]
})
export class ViewProductModalModule {
}