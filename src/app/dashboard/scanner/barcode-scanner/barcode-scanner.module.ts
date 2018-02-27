import { NgModule } from '@angular/core';
import { BarcodeScannerComponent } from './barcode-scanner.component';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    BarcodeScannerComponent
  ],
  exports: [
    BarcodeScannerComponent
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
})
export class BarcodeScannerModule {
}