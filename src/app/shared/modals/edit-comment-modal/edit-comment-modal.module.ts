import { NgModule } from '@angular/core';

import { EditCommentModal } from './edit-comment-modal.component';
import { AppSharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    //EditCommentModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  exports: [
    //EditCommentModal
  ],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  //entryComponents: [ EditCommentModal ]
})
export class EditCommentModalModule {
}