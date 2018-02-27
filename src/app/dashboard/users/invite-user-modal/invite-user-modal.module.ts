import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { InviteUserModal } from './invite-user-modal.component';

@NgModule({
  declarations: [
    InviteUserModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ InviteUserModal ]
})
export class InviteUserModalModule {
}