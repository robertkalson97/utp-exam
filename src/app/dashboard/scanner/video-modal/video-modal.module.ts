import { NgModule } from '@angular/core';
import { AppSharedModule } from '../../../shared/shared.module';
import { VideoModal } from './video-modal.component';

@NgModule({
  declarations: [
    VideoModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ VideoModal ]
})
export class VideoModule {
}
