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
  getDoc,
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
  switchMap,
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
    const menuRef = collection(this.firestore, 'menu');
    this.menus$ = collectionData(menuRef, {idField: 'id'}) as Observable<Menu[]>;

    const postRef = collection(this.firestore, 'posts');
    this.posts$ = collectionData(postRef, {idField: 'id'}) as Observable<Post[]>;
  }

  getMenuCollection() {
    return this.menus$;
  }

  getPostCollection() {
    return this.posts$;
  }

  getOneDocument<T>(collectionName: string, docName: string) {
    return this.runInFirebaseContext(() => {
        const docRef = doc(this.firestore, `${collectionName}/${docName}`);
        return from(getDoc(docRef)).pipe(
          switchMap(docSnap => {
            if (!docSnap.exists()) return throwError(() => "Document not found in the database")
            return of(docSnap.data()) as Observable<T>;
          })
        )
    })
  }

  getDocument<T>(collectionName: string, docName: string) {
    return this.runInFirebaseContext(() => {
      console.log('db service get doc', docName)
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
        
        console.log('FB context start', fn);

        fn()
        .pipe(
          tap(value => {this.loaderService.hide()}),
          catchError((err, caught) => {
              console.log('error', err);
              console.log('caught', caught);
              this.loaderService.hide();
              // observer.error(err)
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
