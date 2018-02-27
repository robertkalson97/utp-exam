import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { MarketplaceTabComponent } from './marketplace-tab.component';
import { AddCustomProductModalModule } from '../../../shared/modals/add-custom-product-modal/add-custom-product-modal.module';

@NgModule({
  declarations: [
    MarketplaceTabComponent,
  ],
  exports: [MarketplaceTabComponent],
  imports: [
    AppSharedModule,
    AddCustomProductModalModule,
  ],
  providers: [],
})
export class MarketplaceTabModule {

}
