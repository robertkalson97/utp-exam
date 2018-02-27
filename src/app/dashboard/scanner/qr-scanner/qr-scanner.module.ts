import { NgModule } from '@angular/core';
import { QrScannerComponent } from './qr-scanner.component';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    QrScannerComponent
  ],
  exports: [
    QrScannerComponent
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
})
export class QrScannerModule {
}