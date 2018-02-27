import { NgModule } from '@angular/core';
import { AppSharedModule } from '../../shared.module';
import { AddCommentModalComponent } from './add-comment-modal.component';

@NgModule({
  declarations: [
    AddCommentModalComponent
  ],
  imports: [
    AppSharedModule,
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ AddCommentModalComponent ]
})
export class AddCommentModalModule {
}
