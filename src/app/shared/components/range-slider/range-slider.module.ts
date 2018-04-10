import { NgModule } from '@angular/core';
import { RangeSliderComponent } from './range-slider.component';
import { AppSharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    RangeSliderComponent,
  ],
  exports: [RangeSliderComponent],
  imports: [AppSharedModule],
  providers: [],
})
export class RangeSliderModule {}
