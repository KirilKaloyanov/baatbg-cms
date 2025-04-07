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
  setDoc,
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  getDownloadURL,
  listAll,
  uploadBytesResumable,
  deleteObject,
} from '@angular/fire/storage';
import {
  catchError,
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
import { Member, MemberType } from '../../dashboard/members/member.model';
import { FileItem } from '@shared/interfaces/fileItem.model';
@Injectable({ providedIn: 'root' })
export class DbService {
  menus$!: Observable<Menu[]>;
  posts$!: Observable<Post[]>;
  members$!: Observable<Member[]>;
  memberTypes$!: Observable<MemberType[]>;

  constructor(
    private firestore: Firestore,
    private injector: Injector,
    private loaderService: LoaderService,
    private storage: Storage
  ) {
    const menuRef = collection(this.firestore, 'menu');
    this.menus$ = collectionData(menuRef, { idField: 'id' }) as Observable<
      Menu[]
    >;

    const postRef = collection(this.firestore, 'posts');
    this.posts$ = collectionData(postRef, { idField: 'id' }) as Observable<
      Post[]
    >;

    const membersRef = collection(this.firestore, 'members');
    this.members$ = collectionData(membersRef, { idField: 'id' }) as Observable<
      Member[]
    >;

    const memberTypeRef = collection(this.firestore, 'memberType');
    this.memberTypes$ = collectionData(memberTypeRef, {
      idField: 'id',
    }) as Observable<MemberType[]>;
  }

  getMenuCollection() {
    return this.menus$;
  }

  getPostCollection() {
    return this.posts$;
  }

  getMembersCollection() {
    return this.members$;
  }

  getMemberTypeCollection() {
    return this.memberTypes$;
  }

  getIfDocument<T>(collectionName: string, docName: string) {
    return this.runInFirebaseContext(() => {
      const docRef = doc(this.firestore, `${collectionName}/${docName}`);
      return from(getDoc(docRef)).pipe(
        switchMap((docSnap) => {
          console.log(docSnap);
          if (!docSnap.exists())
            return throwError(() => 'Document not found in the database');
          return of({ id: docSnap.id, ...docSnap.data() }) as Observable<T>;
        })
      );
    });
  }

  //describe docs firestore

  getDocument<T>(collectionName: string, docName: string) {
    return this.runInFirebaseContext(() => {
      console.log('db service get doc', docName);
      const docRef = doc(this.firestore, `${collectionName}/${docName}`);
      return docData(docRef, { idField: 'id' }) as Observable<T>;
    });
  }

  saveDocument(collectionName: string, id: string, payload: {}) {
    return this.runInFirebaseContext(() => {
      if (!id) return throwError(() => ({ message: 'Invalid ID' }));
      console.log(id);
      const docRef = doc(this.firestore, `${collectionName}/${id}`);
      return from(setDoc(docRef, payload));
    });
  }

  uploadFile(file: File, filepath: string = '') {
    return this.runInFirebaseContext(() => {
      return new Observable((observer) => {
        const storageRef = ref(this.storage, filepath + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          'state_changed',
          (snapshot) => observer.next(snapshot),
          (error) => observer.error(error),
          () => {
            observer.next('uploaded');
            observer.complete();
          }
        );
      });
    });
  }

  getFileUrl(filepath: string) {
    return this.runInFirebaseContext(() => {
      const storageRef = ref(this.storage, filepath);
      return from(getDownloadURL(storageRef));
    });
  }

  listAllFilesAndFloders(path: string = '') {
    return this.runInFirebaseContext<FileItem[]>(() => {
      const storageRef = ref(this.storage, path);

      return from(listAll(storageRef)).pipe(
        map((res) => {
          return [
            ...res.prefixes.map((folderRef) => ({
              name: folderRef.name,
              path: folderRef.fullPath,
              isFolder: true,
              expanded: false,
              children: undefined,
            })),
            ...res.items.map((fileRef) => ({
              name: fileRef.name,
              path: fileRef.fullPath,
              isFolder: fileRef.fullPath.endsWith('/'),
              expanded: false,
            })),
          ] as FileItem[];
        })
      );
    });
  }

  deleteFolder(path: string) {
    return this.runInFirebaseContext(() => {
      const storageRef = ref(this.storage, path + '');
      return from(deleteObject(storageRef));
    });
  }

  runInFirebaseContext<T>(fn: () => Observable<T>): Observable<T> {
    return new Observable((observer) => {
      runInInjectionContext(this.injector, () => {
        this.loaderService.show();

        // console.log('FB context start', fn);

        fn()
          .pipe(
            tap((value) => this.loaderService.hide()),
            catchError((err, caught) => {
              console.log('error', err);
              console.log('caught', caught);
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
