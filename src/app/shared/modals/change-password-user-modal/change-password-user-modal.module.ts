import { NgModule } from '@angular/core';

import { ChangePasswordUserModal } from './change-password-user-modal.component';
import { AppSharedModule } from '../../shared.module';

@NgModule({
  //declarations: [
  //  ChangePasswordUserModal
  //],
  imports: [
    AppSharedModule
  ],
  providers: [],
  //exports: [
  //  ChangePasswordUserModal
  //],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  //entryComponents: [ ChangePasswordUserModal ]
})
export class ChangePasswordUserModalModule {
}