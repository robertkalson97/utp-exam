import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Restangular } from 'ngx-restangular';

@Injectable()
export class ModelService {
  collection$: Observable<any> = new Observable<any>();
  loadCollection$: Subject<any> = new Subject<any>();
  addToCollection$: Subject<any> = new Subject<any>();
  addCollectionToCollection$: Subject<any> = new Subject<any>();
  deleteFromCollection$: Subject<any> = new Subject<any>();
  updateCollection$: Subject<any> = new Subject<any>();
  updateTotalCount$: Subject<any> = new Subject<any>();
  updateElementCollection$: Subject<any> = new Subject<any>();
  
  entity$: Observable<any>;
  loadEntity$: Subject<any> = new Subject<any>();
  deleteEntity$: Subject<any> = new Subject<any>();
  updateEntity$: Subject<any> = new Subject<any>();
  
  collection;
  
  public apiEndpoint: string;
  public defaultOptions: any;
  
  constructor(
      public restangular: Restangular
  ) {
    this.entityActions();
    this.collectionActions();
  }
  
  entityActions() {
    let deleteEntity$ = this.deleteEntity$
    .switchMap((id) => {
      return this.entity$.first()
      .filter((entity: any) => {
        return entity && entity.id == id;
      })
      .mapTo(null);
    });
    
    this.entity$ = Observable.merge(
      this.loadEntity$,
      this.updateEntity$,
      deleteEntity$
    )
    .publishReplay(1).refCount();
    this.entity$.subscribe(res => {
      this.updateElementCollection$.next(res);
      console.log(`${this.constructor.name} Entity Updated`, res);
    });
  }
  
  collectionActions() {
    let addToCollection$ = this.addToCollection$
    .switchMap((res) => {
      return this.collection$.first()
      .map((collection: any) => {
        collection.push(res);
        return collection;
      });
    });

    let addCollectionToCollection$ = this.addCollectionToCollection$
      .switchMap((res) => {
        return this.collection$.first()
          .map((collection: any) => {
            collection = collection.concat(res);
            return collection;
          });
      });

    // this.deleteFromCollection$.subscribe(res=>{
    //  console.log(res);
    // })

    let deleteFromCollection$ = this.deleteFromCollection$
    .switchMap((id) => {
      
      this.collection$.subscribe((res) => {
        console.log('Model Service delete from collection ' + res);
      });
      
      return this.collection$.first()
      .map((collection: any) => {
        return collection.filter((el: any) => {
          return el.id != id;
        });
      });
    });
    
    let updateElementCollection$ = this.updateElementCollection$
    .switchMap((entity) => {
      return this.collection$.first()
      .map((collection: any) => {
        return collection.map((el: any) => {
          if (el.id == entity.id) {
            return entity;
          }
          return el;
        });
      });
    });
    
    this.collection$ = Observable.merge(
      this.loadCollection$,
      this.updateCollection$,
      updateElementCollection$,
      addToCollection$,
      addCollectionToCollection$,
      deleteFromCollection$
    ).publishReplay(1).refCount();
    this.collection$.subscribe(res => {
      this.collection = res;
      console.log(`${this.constructor.name} Collection Updated`, res);
    });
  }
  
  loadCollection(data: any = {}, options: any = {}): Observable<any> {
    this.restangular.all(this.constructor.name).customGET('')
        .subscribe((res)=> {
          this.loadCollection$.next(res);
        });
    
    return this.collection$;
  }
  
  loadEntity(data: any = {}, options: any = {}) {
    let entity = this.restangular.one(this.constructor.name, data.id).get(data);
    
    entity.subscribe((res) => {
      this.loadEntity$.next(res);
    });
    
    return entity;
  }
  
  
  create(data = {}) {
    let entity = this.restangular.all(this.constructor.name).post(data);
    
    entity.subscribe(
      (res) => {
        this.addToCollection$.next(res);
        this.updateEntity$.next(res);
      },
      (err) => {
      }
    );
    
    return entity;
  }
  
  update(data) {
    let entity = this.restangular.all(this.constructor.name).save(data);
    
    entity.subscribe(
      (res) => {
        this.updateElementCollection$.next(res);
        this.updateEntity$.next(res);
      },
      (err) => {
      }
    );
    
    return entity;
  }
  
  delete(id: number): Observable<any> {
    this.restangular.one(this.constructor.name, id).remove()
        .subscribe((res) =>{
          this.deleteFromCollection$.next(id);
          this.deleteEntity$.next(id);
        });
    
    return Observable.of(true);
  }
}
