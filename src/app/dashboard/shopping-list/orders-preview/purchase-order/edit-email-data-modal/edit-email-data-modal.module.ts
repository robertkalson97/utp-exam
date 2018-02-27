import { NgModule } from '@angular/core';

import { EditEmailDataModal } from './edit-email-data-modal.component';
import { AppSharedModule } from '../../../../../shared/shared.module';

@NgModule({
  declarations: [
    EditEmailDataModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  entryComponents: [ EditEmailDataModal ]
})
export class EditEmailDataModalModule {
}