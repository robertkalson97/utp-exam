import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class SpinnerService {
  public loading$: Observable<any>;
  public updateSpinner$: Subject<any> = new Subject<any>();
  public counter: number = 0;
  public request$: Observable<any> = new Observable<any>();
  public getRespond$: Subject<any> = new Subject<any>();
  public setRequest$: Subject<any> = new Subject<any>();


  constructor() {
    this.loading$ = Observable.merge(
        this.updateSpinner$
    );
    
    this.onInit();
  }

  onInit(){
    this.setRequest$.debounce(() => Observable.timer(60000))
      .subscribe(res=>{
        if (this.counter > 0){
          console.log('hide now');
          this.hideNow();
        }
      });
  }
  
  show() {
    this.counter++;
    this.updateSpinner$.next(true);
    this.setRequest$.next(true);
  }

  hide() {
    this.getRespond$.next(true);
    if (this.counter > 0)
      this.counter--;
    
    if  (this.counter == 0)
      this.updateSpinner$.next(false);
  }
  
  hideNow(){
    this.updateSpinner$.next(false);
    this.counter = 0;
  }

  // request(url){
  //   this.request$ = Observable.interval(1000)
  //   // .merge(
  //   //   this.setRequest$
  //   // )
  //       .take(5)
  //       .takeUntil(this.getRespond$)
  //   //     .takeLast(1)
  //       // .filter((res) => {
  //       //   return res == 60;
  //       // })
  //       .subscribe((res: any) => { //
  //         // if (res == 60)
  //           this.hideNow();
  //
  //       });
  // }
}