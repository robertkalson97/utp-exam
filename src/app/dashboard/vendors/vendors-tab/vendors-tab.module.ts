import { NgModule } from '@angular/core';
import { AppSharedModule } from '../../../shared/shared.module';
import { VendorsTabComponent } from './vendors-tab.component';


@NgModule({
  declarations: [
    VendorsTabComponent,
  ],
  exports: [
    VendorsTabComponent,
  ],
  imports: [
    AppSharedModule,
  ],
  providers: []
})
export class VendorsTabModule {
}
