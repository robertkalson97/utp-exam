import { NgModule } from '@angular/core';

import { ProductsComponent } from './products.component';
import { AppSharedModule } from '../../shared/shared.module';
import { EditProductModalModule } from './edit-product-modal/edit-product-modal.module';
import { ProductFilterModalModule } from './product-filter-modal/product-filter-modal.module';
import { RequestProductModalModule } from './request-product-modal/request-product-modal.module';
import { BulkEditModalModule } from './bulk-edit-modal/bulk-edit-modal.module';
import { ProductModule } from './product/product.module';
import { UploadCsvModalModule } from './upload-csv-modal/upload-csv-modal.module';
import { HomeTabModule } from './home-tab/home-tab.module';
import { MarisListTabModule } from './maris-list-tab/maris-list-tab.module';
import { MarketplaceTabModule } from './marketplace-tab/marketplace-tab.module';
import { SearchFilterHeaderModule } from '../../shared/components/search-filter-header/search-filter-header.module';

@NgModule({
  declarations: [
    ProductsComponent,
  ],
  imports: [
    AppSharedModule,
    EditProductModalModule,
    HomeTabModule,
    ProductFilterModalModule,
    RequestProductModalModule,
    SearchFilterHeaderModule,
    BulkEditModalModule,
    ProductModule,
    MarisListTabModule,
    MarketplaceTabModule,
    UploadCsvModalModule,
  ],
  providers: []
})
export class ProductsModule {
}
