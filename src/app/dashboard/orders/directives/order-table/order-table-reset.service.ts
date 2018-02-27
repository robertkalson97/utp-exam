import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class OrderTableResetService {
  
  resetFilters$: EventEmitter<boolean> = new EventEmitter();
  
  resetFilters() {
    this.resetFilters$.emit(true);
  }
  
}
