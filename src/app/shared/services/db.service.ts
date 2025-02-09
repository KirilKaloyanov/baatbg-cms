import {
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
} from '@angular/fire/firestore';
import { setDoc } from 'firebase/firestore';
import {
  catchError,
  finalize,
  firstValueFrom,
  from,
  map,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { LoaderService } from './loader.service';
import { Menu } from '../../dashboard/menus/menu.model';
import { Post } from '../../dashboard/posts/post.model';

@Injectable({ providedIn: 'root' })
export class DbService {
  menus$!: Observable<Menu[]>;
  posts$!: Observable<Post[]>;

  constructor(
    private firestore: Firestore,
    private injector: Injector,
    private loaderService: LoaderService
  ) {
    // this.injector = inject(Injector)

    // runInInjectionContext(this.injector, ()=> {
    //     this.firestore = inject(Firestore);
    // })

    const menuRef = collection(this.firestore, 'menu');
    this.menus$ = collectionData(menuRef) as Observable<Menu[]>;

    const postRef = collection(this.firestore, 'posts');
    this.posts$ = collectionData(postRef) as Observable<Post[]>;
  }

  getMenuCollection() {
    return this.menus$;
  }

  getPostCollection() {
    return this.posts$;
  }

  getOneDocument<T>(collectionName: string, docName: string) {
    const docRef = doc(this.firestore, `${collectionName}/${docName}`);
    // return docData(docRef, {idField: 'id'}) as Observable<T>;
    let res = null;
    docData(docRef).subscribe({
      next: (value) => (res = value as T),
      error: (err) => {
        throw err;
      },
    });
    return of(res) as Observable<T>;
  }

  getDocument<T>(collectionName: string, docName: string) {
    return this.runInFirebaseContext(() => {
      const docRef = doc(this.firestore, `${collectionName}/${docName}`);
      return docData(docRef, { idField: 'id' }) as Observable<T>;
    });
  }

  saveDocument(collectionName: string, payload: { id: string }) {
    return this.runInFirebaseContext(() => {
      if (!payload.id) return throwError(() => ({message: "Invalid ID"}))

      const docRef = doc(this.firestore, `${collectionName}/${payload.id}`);
      return from(setDoc(docRef, payload));
    });
  }

  runInFirebaseContext<T>(fn: () => Observable<T>): Observable<T> {
    return new Observable((observer) => {
      runInInjectionContext(this.injector, () => {
        //start loader
        this.loaderService.show();
        console.log('start', fn);
        fn()
          .pipe(
            tap((value) => {
            //   console.log('end', value);
              this.loaderService.hide();
            }),
            catchError((err) => {
                // console.log('error');
                this.loaderService.hide();
                return throwError(() => err);
            })
          )
          .subscribe({
            next: (value) => observer.next(value),
            error: (err) => observer.error(err),
            complete: () => observer.complete(),
          });
      });
    });
  }
}
