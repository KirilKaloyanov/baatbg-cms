import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";
import { FileItem } from "@shared/interfaces/fileItem.model";
import { DbService } from "@shared/services/db.service";
import { FolderTreeComponent } from "./folder/folder.component";



@Component({
    selector: 'app-storage',
    template: `
        <h1>Storage here</h1>
        <folder-tree [folder]="fileTree()"></folder-tree>

`,
    imports: [CommonModule, FolderTreeComponent]
})
export class StorageComponent { 

    fileTree = signal<FileItem>({
        name: 'root',
        path: '',
        isFolder: true,
        expanded: true,
    })

    constructor(private dbService: DbService){
        this.loadItems();
    }

    loadItems() {
        this.dbService.listAllFilesAndFloders('')
            .subscribe((items) => {
                this.fileTree.update(fileTree => ({...fileTree, children: items}))
            });
    }

}
