import {Subscriber} from "rxjs";

export function Subscribers1(
  params?
) {
  return function (target: any) {
    params = Object.assign({
      addSubscribersFunc: 'addSubscribers',
      removeSubscribersFunc: 'removeSubscribers',
      initFunc: 'ngOnInit',
      destroyFunc: 'ngOnDestroy',
    }, params);
    
    target.prototype[params.initFunc] = ngOnInitDecorator(target.prototype[params.initFunc]);
    target.prototype[params.destroyFunc] = ngOnDestroyDecorator(target.prototype[params.destroyFunc]);
    
    function ngOnDestroyDecorator(f) {
      return function () {
        if (typeof this[params.removeSubscribersFunc] === 'function') {
          this[params.removeSubscribersFunc]();
        }

        for (let subscriberKey in this.subscribers) {
          let subscriber = this.subscribers[subscriberKey];
          if(subscriber instanceof Subscriber){
            subscriber.unsubscribe();
          }
        }

        if(f){
          return f.apply(this, arguments);
        }
      }
    }
    
    function ngOnInitDecorator(f) {
      return function () {
        if (typeof this[params.addSubscribersFunc] === 'function') {
          this[params.addSubscribersFunc]();
        }
        
        if(f){
          return f.apply(this, arguments);
        }
      }
    }
    
    return target;
  }
}