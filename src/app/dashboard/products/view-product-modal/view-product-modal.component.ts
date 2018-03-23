import {Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone} from '@angular/core';

import {DialogRef, ModalComponent, Modal} from 'angular2-modal';
import {BSModalContext} from 'angular2-modal/plugins/bootstrap';
import {DestroySubscribers} from 'ngx-destroy-subscribers';
import {Observable, BehaviorSubject, Subject} from 'rxjs/Rx';
import * as _ from 'lodash';

import {ProductModel} from '../../../models/index';
import {UserService, AccountService} from '../../../core/services/index';
import {ProductService} from "../../../core/services/product.service";
import {ModalWindowService} from "../../../core/services/modal-window.service";
import {ToasterService} from "../../../core/services/toaster.service";
import {EditCommentModal} from "../../../shared/modals/edit-comment-modal/edit-comment-modal.component";
import {FileUploadService} from "../../../core/services/file-upload.service";

export class ViewProductModalContext extends BSModalContext {
    public product: any;
}

@Component({
    selector: 'app-view-product-modal',
    //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
    // Remove when solved.
    /* tslint:disable */
    templateUrl: './view-product-modal.component.html',
    styleUrls: ['./view-product-modal.component.scss']
})
@DestroySubscribers()
export class ViewProductModal implements OnInit, AfterViewInit, ModalComponent<ViewProductModalContext> {
    public subscribers: any = {};
    context: ViewProductModalContext;
    // public product$: BehaviorSubject<any> = new BehaviorSubject([]);
    public product: any;
    public productCopy: any;
    public variation: any = {};
    public variationArrs = {
        package_type: [],
        unit_type: [],
        units_per_package: [],
        size: [],
        material: [],
        price_range: []
    };
    public currentVariant:any = {};
    public showVariant:boolean = false;
    public comment: any = {};
    public showEdit: boolean = false;
    public hasDocs: boolean = false;
    public hasFiles: boolean = false;
    public addOrderVariantsButtonShow: boolean = false;
    public departmentCollection$: Observable<any> = new Observable<any>();
    public departmentCollection: any[];
    public productAccountingCollection$: Observable<any> = new Observable<any>();
    public productAccountingCollection: any[];
    public productCategoriesCollection$: Observable<any> = new Observable<any>();
    public productCategoriesCollection: any[];

    public variants = [];
    public variants$: BehaviorSubject<any> = new BehaviorSubject([]);
    public orders$: BehaviorSubject<any> = new BehaviorSubject([]);
    public showEdit$: BehaviorSubject<any> = new BehaviorSubject([]);
    public filterSelectOption$: BehaviorSubject<any> = new BehaviorSubject({});
    public filterName$: BehaviorSubject<any> = new BehaviorSubject(null);
    public filterPrice$ = new BehaviorSubject(null);
    public filteredVariants$ = Observable.of([]);
    public variantsCopy = [];
    public variantChecked$ = new BehaviorSubject(false);
    public variantVisibility$ = new BehaviorSubject(false);
    public currentLocation$ = new BehaviorSubject("");
    public comments$ = new BehaviorSubject([]);
    public addToComments$ = new Subject();
    public deleteFromComments$ = new Subject();
    public editCommentComments$ = new Subject();
    public filteredComments$;
    public location_id;
    public currentLocation:any = {};

    fileIsOver: boolean = false;
    public newFiles$: BehaviorSubject<any> = new BehaviorSubject(null);
    public oldFiles$: BehaviorSubject<any> = new BehaviorSubject(null);
    public fileArr: any = [];
    public oldFileArr: any = [];
    // @ViewChild('secondary') secondaryLocationLink: ElementRef;

    public file$: Observable<any>;
    public file;
    public loadFile$: Subject<any> = new Subject<any>();
    public addFileToFile$: Subject<any> = new Subject<any>();
    public deleteFromFile$: Subject<any> = new Subject<any>();
    public updateFile$: Subject<any> = new Subject<any>();

    public doc$: Observable<any>;
    public doc;
    public loadDoc$: Subject<any> = new Subject<any>();
    public addDocToDoc$: Subject<any> = new Subject<any>();
    public deleteFromDoc$: Subject<any> = new Subject<any>();
    public updateDoc$: Subject<any> = new Subject<any>();

    public formData: FormData = new FormData();

    public hasInfoTab:boolean = false;

    constructor(public dialog: DialogRef<ViewProductModalContext>,
                public userService: UserService,
                public accountService: AccountService,
                public productService: ProductService,
                public modalWindowService: ModalWindowService,
                public toasterService: ToasterService,
                public fileUploadService: FileUploadService,
                public zone: NgZone,
                public modal: Modal) {
        this.context = dialog.context;
        this.fileActions();
        this.docActions();
        this.showEdit$.next(false);
    }

    changeSelected(loc_id,var_id){
        this.currentLocation[var_id] = loc_id;
    }

    showEditFields() {
        this.departmentCollection$ = this.accountService.getDepartments().take(1);
        this.productAccountingCollection$ = this.accountService.getProductAccounting().take(1);
        this.productCategoriesCollection$ = this.accountService.getProductCategories().take(1);
        this.showEdit = true;
        this.productCopy = _.clone(this.product);
        this.variants$.take(1).subscribe(r => {
            this.variantsCopy = _.cloneDeep(r);
        });
        this.showEdit$.next(true);
    }

    closeEditFields() {
        this.showEdit = !this.showEdit;
        this.showEdit$.next(false);

        this.productCopy = [];
        this.variants$.next(this.variantsCopy);
    }

    resetText() {
        this.product.hazardous_string = this.product.hazardous ? 'Yes' : 'No';
        this.product.trackable_string = this.product.trackable ? 'Yes' : 'No';
        this.product.tax_exempt_string = this.product.tax_exempt ? 'Yes' : 'No';
        this.product.account_category = this.product.account_category ? this.product.account_category : 'Not Specified';
    }

    ngOnInit() {
        console.clear();
        this.product = this.context.product;

        this.loadFile$.next([]);
        this.resetText();
        this.product.comments = [];
        this.location_id = this.product.location_id;

        let addToComments$ = this.addToComments$.switchMap((item: any) => {
            return this.comments$.first().map(collection => {
                collection.unshift(item);
                return collection;
            })
        });

        let deleteFromComments$ = this.deleteFromComments$.switchMap((id: any) => {
            return this.comments$.first().map(collection => {
                _.remove(collection, {id: id});
                return collection;
            })
        });

        let editCommentComments$ = this.editCommentComments$.switchMap((commentToUpdate: any) => {
            return this.comments$.first().map(collection => {
                return collection.map((comment: any) => {
                    if (comment.id == commentToUpdate.id) {
                        return commentToUpdate
                    }
                    return comment;
                });
            })
        });


        this.filteredComments$ = Observable.merge(
            this.comments$,
            addToComments$,
            deleteFromComments$,
            editCommentComments$
        ).map(comments => {
            let filteredComments = _.map(comments, (item: any) => {
                if (item.body) {
                    let regKey = new RegExp('(?:\r\n|\r|\n)', 'g');
                    item.body = item.body.replace(regKey, "<br/>"); // adding many lines comment
                }

                if (item.created_at) {
                    let date = new Date(item.created_at);
                    item.created_at = date.toDateString();
                }

                return item;
            });
            return _.orderBy(filteredComments, (item: any) => {
                return new Date(item.created_at)
            }, ['desc'])
        });


        this.filteredVariants$ = Observable.combineLatest(
            this.variants$,
            this.filterSelectOption$,
            this.filterName$,
            this.filterPrice$,
            this.variantChecked$,
            this.showEdit$,
        )
            .map(([variants, filterSelectOption, filterName, filterPrice, variantChecked,showEdit]) => {
                if (showEdit) {

                    return variants;
                }
                // check if at least on variant is checked to show add order button
                let checkedArrVariants = _.filter(variants, {checked: true});

                this.variation.checked = checkedArrVariants.length == variants.length && variants.length ? true : false;

                this.addOrderVariantsButtonShow = checkedArrVariants.length ? true : false;

                if (filterPrice && filterPrice != "") {
                    variants = _.reject(variants, (variant: any) => {
                        let key = new RegExp(filterPrice, 'i');
                        return !key.test(variant.name);
                    });
                }
                if (filterName && filterName != "") {
                    variants = _.reject(variants, (variant: any) => {
                        let key = new RegExp(filterName, 'i');
                        return !key.test(variant.name);
                    });
                }
                variants = _.filter(variants, filterSelectOption);
                //
                return variants;
            });
        this.getProducts();
    }

    addSubscribers() {
        this.subscribers.departmenCollectiontSubscription = this.departmentCollection$
        .subscribe(departments => this.departmentCollection = departments);

        this.subscribers.productAccountingCollection = this.productAccountingCollection$
        .subscribe(products => this.productAccountingCollection = products);

        this.subscribers.productCategoriesCollection = this.productCategoriesCollection$
        .subscribe(productsCat => this.productCategoriesCollection = productsCat);
    }

    getProducts (){
        this.subscribers.getProductSubscription = this.productService.getProductLocation(this.product.id, this.location_id)
        .filter(res => res.data)
        .map(res => res.data)
        .subscribe(data => {
            this.product = data.product;
            this.hasInfoTab = (data.product.description == ''
            || data.product.hazardous_form == ''
            || data.product.msds == ''
            || data.product.notes == ''
            || !_.isEmpty(data.product.documents));

            this.loadDoc$.next(data.product.documents);
            this.loadDoc$.subscribe(r=>console.log(r));

            this.resetText();
            this.variants = _.map(data.variants, (item: any) => {
                item.checked = false;
                item.status = item.status ? item.status : 1;
                item.trimmed_inventory = !_.isEmpty(item.inventory) ?  _.slice(item.inventory, 0 ,3) : [];
                item.total_inventory = _.sumBy(item.inventory,(i:any)=>i.current_inventory);
                return item;
            });
            this.variants$.next(this.variants); // update variants
            this.orders$.next(this.reformatOrderHistory(this.variants)); // update order history
            this.orders$.subscribe(r=>console.log('orders',r));

            this.comments$.next(data.comments); // update comments
            console.log(this.variants[0]);
            _.each(this.variants, (variant: any) => {
                _.forEach(this.variationArrs, (value, key) => {
                    this.variationArrs[key].push(this.variationArrs[key].indexOf(variant[key]) >= 0 ? null : variant[key]);
                })
            });
            _.forEach(this.variationArrs, (value, key) => {
                this.variationArrs[key] = _.filter(this.variationArrs[key], res => res);
            });

        });
    }
    // File load, add, delete actions
    fileActions():any {
        let addFileToFile$ = this.addFileToFile$
            .switchMap((res) => {
                return this.file$.first()
                    .map((file: any) => {
                        file = file.concat(res);
                        return file;
                    });
            });
        let deleteFromFile$ = this.deleteFromFile$
            .switchMap((deleteFile) => {
                this.file$.subscribe((res) => {
                    console.log('Model Service delete from file ' + res);
                });
                return this.file$.first()
                    .map((file: any) => {
                        return file.filter((el: any) => {
                            return el.name != deleteFile.name;
                        });
                    });
            });
        this.file$ = Observable.merge(
            this.loadFile$,
            this.updateFile$,
            addFileToFile$,
            deleteFromFile$
        ).publishReplay(1).refCount();
        this.file$.subscribe(res => {
            this.file = res;
            this.hasFiles = res.length > 0;
        });
    }

    // Doc load, add, delete actions
    docActions():any {
        let addDocToDoc$ = this.addDocToDoc$
            .switchMap((res) => {
                return this.doc$.first()
                    .map((doc: any) => {
                        doc = doc.concat(res);
                        return doc;
                    });
            });
        let deleteFromDoc$ = this.deleteFromDoc$
            .switchMap((deleteDoc) => {
                this.doc$.subscribe((res) => {
                    console.log('Model Service delete from doc ' + res);
                });
                return this.doc$.first()
                    .map((doc: any) => {
                        return doc.filter((el: any) => {
                            return el.file_name != deleteDoc.file_name;
                        });
                    });
            });
        this.doc$ = Observable.merge(
          this.loadDoc$,
          this.updateDoc$,
          addDocToDoc$,
          deleteFromDoc$
        )
        .publishReplay(1)
        .refCount();

        this.doc$
        .subscribe(res => {
            console.log('docs',res);
            this.doc = res;
            this.hasDocs = res.length > 0;
        });
    }

    ngAfterViewInit() {
        this.filterSelectOption$.next({status:1});
    }

    dismissModal() {
        this.productService.getNextProducts(this.productService.current_page);
        this.dialog.dismiss();
    }

    closeModal(data) {
        this.dialog.close(data);
    }

    checkFilterValue(event) {
        if (event.target.value.length) {
            return event.target.value;
        }
    }

    // make all variant checkboxes value to be head checkbox value
    headCheckboxChange() {
        this.variants$.next(_.map(this.variants$.getValue(), (variant: any) => {
            variant.checked = this.variation.checked;
            return variant;
        }));
    }

    // detects changes on variant checkbox
    variantCheckedChange() {
        this.variantChecked$.next(false)
    }

    changeName(event) {
        this.filterName$.next(event.target.value.trim())
    }

    changePrice(event) {
        this.filterPrice$.next(event.target.value.trim())
    }

    changePkg(event) {
        if (this.checkFilterValue(event)) {
            this.variation.package_type = event.target.value;
        }
        else {
            delete this.variation.package_type
        }
        this.filterSelectOption$.next(this.variation)
    }

    changeUnit(event) {
        if (this.checkFilterValue(event)) {
            this.variation.unit_type = event.target.value;
        }
        else {
            delete this.variation.unit_type
        }
        this.filterSelectOption$.next(this.variation)
    }

    changeUnitsPkg(event) {
        if (this.checkFilterValue(event)) {
            this.variation.units_per_package = parseInt(event.target.value);
        }
        else {
            delete this.variation.units_per_package
        }
        this.filterSelectOption$.next(this.variation)
    }

    changeSize(event) {
        if (this.checkFilterValue(event)) {
            this.variation.size = event.target.value;
        }
        else {
            delete this.variation.size
        }
        this.filterSelectOption$.next(this.variation)
    }

    changeMaterial(event) {
        if (this.checkFilterValue(event)) {
            this.variation.material = event.target.value;
        }
        else {
            delete this.variation.material
        }
        this.filterSelectOption$.next(this.variation)
    }

    toggleVariationVisibility() {
        this.variation.status = this.variation.status == 2 ? this.variation.status =1 : this.variation.status = 2;
        this.filterSelectOption$.next(this.variation);

    }

    toggleVariantVisibility(variant) {
        variant.status = variant.status == 2 ? variant.status =1 : variant.status = 2;
    }

    toggleVariantDetailView(variant) {
        variant.detailView = !variant.detailView;
    }

    sendComment() {
        Object.assign(this.comment,
            {
                "user_id": this.userService.selfData.id,
                "object_type": "products",
                "object_id": this.product.id
            }
        );
        this.subscribers.addProductSubscriber = this.productService.addProductComment(this.comment).subscribe(res => {
            this.comment = {};
            this.addToComments$.next(res.data);
        });
    }

    editComment(comment) {
        let clonedComment:any = _.cloneDeep(comment);
        if (clonedComment.body) {
            let regKey = new RegExp('<br/>', 'g');
            clonedComment.body = clonedComment.body.replace(regKey, "\r\n"); // replacing <br/> many lines comment
        }
        this.modal
            .open(EditCommentModal, this.modalWindowService.overlayConfigFactoryWithParams({comment: clonedComment}))
            .then((resultPromise) => {
                resultPromise.result.then(
                    (comment) => {
                        this.subscribers.editProductComment = this.productService.editProductComment(comment).subscribe(res => {
                            this.editCommentComments$.next(res.data);
                        })
                    },
                    (err) => {
                    }
                );
            });
    }

    deleteComment(comment) {
        this.modalWindowService.confirmModal('Delete Comment?', { text: 'Are you sure you want to delete this comment?', btn: 'Delete'}, this.deleteCommentFunc.bind(this, comment.id));

    }

    deleteCommentFunc(id) {
        this.subscribers.deleteProductSubscriber = this.productService.deleteProductComment(id).subscribe(res => {
            this.deleteFromComments$.next(id);
            this.toasterService.pop("", res.message)
        })
    }


    showVariantDetails($event,variant){
        $event.stopPropagation();
        this.showVariant = true;
        this.currentVariant = variant;

    }

    hideVariantDetails(){
        this.showVariant = false;
        this.currentVariant = {};
    }

    // upload by filedrop
    fileOver(fileIsOver: boolean): void {
        this.fileIsOver = fileIsOver;
    }

    onFileDrop(file: any): void {
        let myReader: any = new FileReader();
        myReader.fileName = file.name;
        this.addFile(file);
    }

    onFileUpload(event){
        this.onFileDrop(event.target.files[0]);
    }

    addFile(file) {
        this.addFileToFile$.next([file]);
    }

    removeFile(file, index) {
        console.log(`remove ${file.name}`);
        this.deleteFromFile$.next(file);
    }
    removeDoc(doc, index) {
        console.log(`remove ${doc.file_name}`);
        this.deleteFromDoc$.next(doc);
    }

    inventoryDetailCollapse(v) {
        v.detailView = false;
    }

    saveAfterEdit() {
        this.fileUploadService.uploadDocuments(this.userService.selfData.account_id, 'product', this.product.id, this.file)
        .subscribe(result => {
            if (result.error) {
                this.toasterService.pop("error","Error. " + result.error);
            } else {
                if (!result.continue) {
                    this.addDocToDoc$.next(result);
                }
                let prod_diff = this.productService.deepDiff(this.productCopy, this.product);
                let vars_diff = this.productService.deepDiff(this.variants, this.variantsCopy);
                prod_diff.id = this.product.id;
                let variants: any = [];
                for (let item in vars_diff) {
                    if (!item && this.productService.emptyValues(vars_diff[item])) {
                        vars_diff[item].id = this.variants[item].id;
                        variants.push(vars_diff[item]);
                    }
                }
                prod_diff['documents'] = this.doc;
                let updateData: any = {
                    location_id: this.location_id,
                    product: prod_diff,
                    variants: variants,
                };
                this.subscribers.updateProduct = this.productService.updateProduct(updateData);
                this.subscribers.updateProduct
                .filter(res => res.data)
                .map(res => res.data)
                .subscribe(data => {
                      this.variants = _.map(data.variants, (item: any) => {
                          item.checked = false;
                          item.status = item.status ? item.status : 1;
                          return item;
                      });
                      this.product = data.product;

                      this.hasInfoTab = (data.product.description == ''
                      || data.product.hazardous_form == ''
                      || data.product.msds == ''
                      || data.product.notes == ''
                      || !_.isEmpty(data.product.documents));
                      this.variants$.next(this.variants); // update variants
                      this.comments$.next(data.comments); // update comments
                      _.each(this.variants, (variant: any) => {
                          _.forEach(this.variationArrs, (value, key) => {
                              this.variationArrs[key].push(this.variationArrs[key].indexOf(variant[key]) >= 0 ? null : variant[key]);
                          })
                      });
                      _.forEach(this.variationArrs, (value, key) => {
                          this.variationArrs[key] = _.filter(this.variationArrs[key], res => res);
                      });
                      this.showEdit = false;

                      this.showEdit$.next(false);
                      this.productCopy = [];
                      this.filterSelectOption$.next({status: 1});
                      this.resetText();
                  },
                  err => {
                      this.toasterService.pop("error", err);
                  });
                this.loadFile$.next([]);

            }
        },
        err => this.toasterService.pop("error", err));


    }

    reformatOrderHistory(ina: any): any {
        let out:any=[];
         _.map(ina, vnt =>
            _.map(vnt['inventory'], inv =>
                _.map(inv['orders'], ord => {
                        ord['variant_name'] = vnt['name'];
                        out.push(ord);
                    }
                )
            )
        )
        return out;
    }

}
