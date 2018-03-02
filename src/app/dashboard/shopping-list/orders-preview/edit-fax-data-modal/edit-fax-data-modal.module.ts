import { NgModule } from '@angular/core';

import { EditFaxDataModal } from './edit-fax-data-modal.component';
import { AppSharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [
    EditFaxDataModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  entryComponents: [ EditFaxDataModal ]
})
export class EditFaxDataModalModule {
}