import { ModelService } from "../../overrides/model.service";
import { Injectable, Injector } from "@angular/core";
import { Subscribers } from "../../decorators/subscribers.decorator";
import { Restangular } from "ngx-restangular";
import { APP_CONFIG, AppConfig } from "../../app.config";
import { Observable } from "rxjs";
import { LocalStorage } from 'angular2-local-storage/local_storage';

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class DashboardService extends ModelService {
  public appConfig: AppConfig;
  public selfData$: Observable<any>;
  public dashboardText: string;
  public hasInfo: boolean = false;

  constructor(
    public injector: Injector,
    public restangular: Restangular,
    public localStorage: LocalStorage,

  ) {
    super(restangular);
    this.appConfig = injector.get(APP_CONFIG);
    this.onInit();
  }

  onInit() {
    this.selfData$ = this.restangular.all('dashboard').customGET()
    .filter((data: any) => data.data && data.data.html)
    .map((data: any) => data.data.html);

   let a =  this.selfData$.subscribe((text: string) => {
      this.dashboardText = text;
      if (this.localStorage.get('read_info')) {
        this.setRead();
      } else {
        this.setRead(false);
      }
    });


  }

  setRead(status = true){
    this.hasInfo=!status;
    this.localStorage.set('read_info', status ? '1' : '0')
  }
}
