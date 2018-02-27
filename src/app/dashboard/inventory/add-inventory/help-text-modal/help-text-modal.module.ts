import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../../shared/shared.module';
import { HelpTextModal } from './help-text-modal-component';

@NgModule({
  declarations: [
    HelpTextModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ HelpTextModal ]
})
export class HelpTextModalModule {
}