import { NgModule } from '@angular/core';

import { InfoModal } from './info-modal-component';
import { AppSharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [
    InfoModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ InfoModal ]
})
export class InfoModalModule {
}