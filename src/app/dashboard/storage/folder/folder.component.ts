import { CommonModule } from '@angular/common';
import { Clipboard } from '@angular/cdk/clipboard';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { FileItem } from '@shared/interfaces/fileItem.model';
import { DbService } from '@shared/services/db.service';
import { StorageService } from '@shared/services/storage.service';
import { ToasterComponent } from '@shared/components/toaster.component';
import { ToasterService } from '@shared/services/toaster.service';

@Component({
  selector: 'folder-tree',
  template: `
    <div>Upload file in {{ folder.name }} folder:</div>
    <input
      type="file"
      accept="application/pdf"
      #fileInput
      (change)="fileUpload($event)"
    />
    <ul>
      @for(child of folder.children; track child.path) {

      <li [attr.data-path]="child.path">
        @if(child.isFolder) {

        <span (click)="toggleFolder(child)">
          📁 {{ child.expanded ? '▼' : '▶' }}
          <a href="javascript:void(0)">{{ child.name }}</a>
        </span>

        } @else {

        <span> {{ child.name }} </span>
        <button (click)="placeUrlInClipboard(child.path)">Copy URL</button>
        <button (click)="deleteItem(child.path)">Delete</button>

        } @if(child.expanded && child.isFolder) {

        <folder-tree
          [folder]="child"
        ></folder-tree>

        }
      </li>

      }
    </ul>
  `,
  styles: [],
  imports: [CommonModule],
})
export class FolderTreeComponent {
  @Input() folder!: FileItem;
  
  constructor(
    private dbService: DbService,
    private storage: StorageService,
    private toaster: ToasterService,
    private clipboard: Clipboard
  ) {}

  // ngOnInit() {
  //   console.log(this.folder);
  // }

  toggleFolder(folder: FileItem) {
    if (!folder.isFolder) return;
    folder.expanded = !folder.expanded;

    if (folder.expanded && !folder.children) {
      this.dbService.listAllFilesAndFloders(folder.path).subscribe((items) => {
        folder.children = items;
      });
    }
  }

  deleteItem(path: string) {
    this.dbService.deleteFolder(path).subscribe(()=> {
      this.updateFilesAndFolders();
  })
  }

  fileUpload(e: Event) {
    const fileInput = e.target as HTMLInputElement;
    const files = fileInput.files;

    if (!files || files.length < 1) return;
    if (files[0].size > 30 * 1000 * 1000) {
      alert('Choose file less than 3MB.');
      fileInput.value = '';
      return;
    }
    let filePath = this.folder.path;
    if (filePath.length > 0) filePath += '/';

    const subFolder = prompt(
      'Enter folders path, e.g. folder or folder/subfolder'
    );
    if (subFolder) filePath += subFolder + '/';

    const isConfirmed = confirm(
      'Hey there, are you sure you want to upload ' + filePath + files[0].name
    );
    if (isConfirmed) {
      this.storage.uploadFile(files[0], filePath ? filePath : '').subscribe({
        complete: () => {
          fileInput.value = '';
          this.updateFilesAndFolders();
        },
      });
    } else {
      fileInput.value = '';
    }
  }

  updateFilesAndFolders() {
    this.dbService
      .listAllFilesAndFloders(this.folder.path)
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
