import { NgModule } from '@angular/core';
import { ScannerComponent } from './scanner.component';
import { BarcodeScannerModule } from './barcode-scanner/barcode-scanner.module';
import { QrScannerModule } from './qr-scanner/qr-scanner.module';
import { AppSharedModule } from '../../shared/shared.module';
import {VideoModule} from './video-modal/video-modal.module';

@NgModule({
  declarations: [
    ScannerComponent,
  ],
  exports: [
    ScannerComponent
  ],
  imports: [
    AppSharedModule,
  
    BarcodeScannerModule,
    QrScannerModule,
    VideoModule
  ],
  providers: [],
})
export class ScannerModule {
}