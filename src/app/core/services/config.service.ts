import { Injectable, Injector } from "@angular/core";
import { Subscribers } from "../../decorators/subscribers.decorator";
import { Restangular } from "ngx-restangular";
import { APP_CONFIG } from "../../app.config";
import { Observable } from 'rxjs/Observable';

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class ConfigService {
  public appConfig: any;
  environment$: Observable<string>;
  
  constructor(
    public injector: Injector,
    public restangular: Restangular,
  ) {
    this.appConfig = injector.get(APP_CONFIG);
    this.onInit();
  }
  
  onInit() {
    this.environment$ = this.restangular.all('config').customGET('')
    .map((res: any) => {
      return res.data.environment;
    })
  }
  
}
