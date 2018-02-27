import { NgModule } from '@angular/core';

import { EditUserModal } from './edit-user-modal.component';
import { AppSharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    //EditUserModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  exports: [
    //EditUserModal
  ],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  //entryComponents: [ EditUserModal ]
})
export class EditUserModalModule {
}