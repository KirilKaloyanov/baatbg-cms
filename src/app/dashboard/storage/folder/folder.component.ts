import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FileItem } from '@shared/interfaces/fileItem.model';
import { DbService } from '@shared/services/db.service';

@Component({
  selector: 'folder-tree',
  template: `
    <ul>
      <li *ngFor="let child of folder.children" [attr.data-path]="child.path">
        <span *ngIf="child.isFolder" (click)="toggleFolder(child)">
          {{ child.expanded ? '▼' : '▶' }} {{ child.name }}
        </span>
        <span *ngIf="!child.isFolder">
          {{ child.name }}
        </span>

        <folder-tree *ngIf="child.expanded && child.isFolder" [folder]="child"></folder-tree>
      </li>
    </ul>
  `,
  styles: [],
  imports: [CommonModule]
})
export class FolderTreeComponent {
  @Input() folder!: FileItem;
  constructor(private dbService: DbService){

}
ngOnInit(){

    console.log(this.folder)
}

  toggleFolder(child: FileItem) {
    if (child.isFolder) {
      child.expanded = !child.expanded;
      if (child.expanded && !child.children) {
        this.loadFolderChildren(child);
      }
    }
  }

  loadFolderChildren(child: FileItem) {
    this.dbService.listAllFilesAndFloders(child.path).subscribe((items) => {
      child.children = items;
    });
  }
}
