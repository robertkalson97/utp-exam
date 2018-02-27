import { NgModule } from '@angular/core';

import { UploadCsvModal } from './upload-csv-modal.component';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    UploadCsvModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ UploadCsvModal ]
})
export class UploadCsvModalModule {
}