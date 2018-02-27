import { NgModule } from '@angular/core';
import { AppSharedModule } from '../shared.module';
import { AddCustomProductComponent } from './add-custom-product.component';
import { ScannerModule } from '../../dashboard/scanner/scanner.module';

@NgModule({
  declarations: [
    AddCustomProductComponent,
  ],
  exports: [AddCustomProductComponent],
  imports: [
    AppSharedModule,
    ScannerModule,
  ],
  providers: [],
})
export class AddCustomProductModule {

}
