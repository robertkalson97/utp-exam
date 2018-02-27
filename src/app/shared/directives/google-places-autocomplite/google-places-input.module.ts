import {NgModule} from '@angular/core';
import { GooglePlacesInputComponent } from "./google-places-input.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    GooglePlacesInputComponent
  ],
  exports: [GooglePlacesInputComponent],
  imports: [ReactiveFormsModule],
  providers: [],
})
export class GooglePlacesInputModule {}
