import { Injectable, Injector } from '@angular/core';
import {Subscribers} from '../../decorators/subscribers.decorator';
import {ModelService} from '../../overrides/model.service';
import { APP_CONFIG, AppConfig } from '../../app.config';
import { Observable } from 'rxjs';
import {Restangular} from 'ngx-restangular';

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null
})

export class RestockService extends ModelService {
  public appConfig: AppConfig;
  public selfData$: Observable<any>;

  constructor(
    public injector: Injector,
    public restangular: Restangular,

  ) {
    super(restangular);
    this.appConfig = injector.get(APP_CONFIG)
    this.onInit()
  }

  onInit() {
    this.selfData$ = this.restangular.all('restock').customGET()
      .map(
        (res: any) => res.data.locations.map(
          (location: any) => ({
            id: location.id,
            name: location.name,
            floorstock_locations: location.floorstock_locations.map(
              (floorstock_location: any) => ({
                id: floorstock_location.id,
                name: floorstock_location.name,
                inventory_groups: floorstock_location.inventory_groups.map(
                  (inventory_group: any) => ({
                    ...inventory_group,
                    on_floor_qty: '',
                    restock_qty: ''
                  })
                )
              })
            )
          })
        )
      )
  }
}
