import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FileItem } from '@shared/interfaces/fileItem.model';
import { DbService } from '@shared/services/db.service';
import { FolderTreeComponent } from './folder/folder.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-storage',
  template: `
    <h1>Storage here</h1>
    <mat-card>
      <mat-card-header>Browse</mat-card-header>
      <folder-tree [folder]="fileTree()"></folder-tree>
    </mat-card>
  `,
  styles: `
  mat-card {
    overflow: hidden;   
  }
  mat-card-header {
    background-color: var(--mat-sys-secondary);
    color: var(--mat-sys-on-secondary);
    height: 30px;
    margin-bottom: 12px;
}
  `,
  imports: [CommonModule, FolderTreeComponent, MatCardModule],
})
export class StorageComponent {
  fileTree = signal<FileItem>({
    name: 'root',
    path: '',
    isFolder: true,
    expanded: true,
  });

  constructor(private dbService: DbService) {
    this.loadItems();
  }

  loadItems() {
    this.dbService.listAllFilesAndFoldersWithTime('').subscribe((items) => {
      this.fileTree.update((fileTree) => ({ ...fileTree, children: items }));
    });
  }
}
