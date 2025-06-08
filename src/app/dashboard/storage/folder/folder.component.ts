import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';

import { Clipboard } from '@angular/cdk/clipboard';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { StorageService } from '@shared/services/storage.service';
import { ToasterService } from '@shared/services/toaster.service';
import { DbService } from '@shared/services/db.service';
import { FileItem } from '@shared/interfaces/fileItem.model';
import { ConfirmModal } from '@shared/components/modals/confirm-modal.component';
import { catchError, map, switchMap, of, throwError, filter, tap } from 'rxjs';
import { AlertModal } from '@shared/components/modals/alert-modal.component';
import { InputModal } from '@shared/components/modals/input-modal.component';

@Component({
  selector: 'folder-tree',
  templateUrl: 'folder.component.html',
  styleUrl: 'folder.component.scss',
  imports: [CommonModule, MatButtonModule, MatIconModule],
})
export class FolderTreeComponent {
  @Input() folder!: FileItem;

  constructor(
    private dbService: DbService,
    private storage: StorageService,
    private toaster: ToasterService,
    private clipboard: Clipboard
  ) {}

  readonly dialog = inject(MatDialog);

  toggleFolder(folder: FileItem) {
    if (!folder.isFolder) return;
    folder.expanded = !folder.expanded;

    if (folder.expanded && !folder.children) {
      this.dbService.listAllFilesAndFoldersWithTime(folder.path).subscribe((items) => {
        console.log(items)
        folder.children = items;
      });
    }
  }

  deleteItem(path: string) {
    const dialogRef = this.dialog.open(ConfirmModal);
    dialogRef
      .afterClosed()
      .pipe(
        switchMap((value) => {
          if (value) {
            return this.dbService.deleteFolder(path).pipe(
              map(() => true),
              catchError((err) => throwError(() => err))
            );
          }
          return of(false);
        })
      )
      .subscribe({
        next: (result) => {
          if (result) {
            this.updateFilesAndFolders();
            this.toaster.showSuccess('Successfully deleted document');
          } else {
            this.toaster.showError('Operation aborted!');
          }
        },
        error: (err) => {
          this.toaster.showError(err.message);
        },
      });
  }

  fileUpload(e: Event) {
    const fileInputElement = e.target as HTMLInputElement;
    const files = fileInputElement.files;

    if (!files || files.length < 1) return;
    if (files[0].size > 30 * 1000 * 1000) {
      this.dialog.open(AlertModal, {
        minWidth: '600px',
        data: 'Choose file less than 30MB!',
      });
      fileInputElement.value = '';
      return;
    }

    let filePath = this.folder.path;
    if (filePath.length > 0) filePath += '/';

    this.dialog
      .open(InputModal, {
        data: 'Enter folders path, e.g. folder or folder/subfolder (optional)',
      })
      .afterClosed()
      .pipe(
        switchMap((value) => {
          if (typeof value == 'string') {
            if (value) filePath += value + '/';
            return this.storage.uploadFile(files[0], filePath ? filePath : '');
          } else {
            fileInputElement.value = '';
            this.toaster.showError('Operation aborted!');
            return of(null);
          }
        })
      )
      .subscribe({
        error: (err) => {
          fileInputElement.value = '';
        },
        complete: () => {
          fileInputElement.value = '';
          this.updateFilesAndFolders();
        },
      });

    // const subFolder = prompt(
    //   'Enter folders path, e.g. folder or folder/subfolder'
    // );
    // if (subFolder) filePath += subFolder + '/';

    // const isConfirmed = confirm(
    //   'Hey there, are you sure you want to upload ' + filePath + files[0].name
    // );

    // if (isConfirmed) {
    //   this.storage.uploadFile(files[0], filePath ? filePath : '').subscribe({
    //     error: (err) => {
    //       fileInputElement.value = '';
    //     },
    //     complete: () => {
    //       fileInputElement.value = '';
    //       this.updateFilesAndFolders();
    //     },
    //   });
    // } else {
    //   fileInputElement.value = '';
    // }
  }

  updateFilesAndFolders() {
    this.dbService
      .listAllFilesAndFoldersWithTime(this.folder.path)
      .subscribe((items) => {
        this.folder.children = items;
      });
  }

  placeUrlInClipboard(path: any) {
    this.dbService.getFileUrl(path).subscribe((url) => {
      this.clipboard.copy(url);
      this.toaster.showSuccess(`URL copied successfully!`);
    });
  }
}
