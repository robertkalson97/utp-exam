import { NgModule } from "@angular/core";
import { NoContentComponent } from "./no-content.component";
import { AppSharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [
    NoContentComponent
  ],
  imports: [
    AppSharedModule
  ],
  providers: []
})
export class NoContentModule {
}