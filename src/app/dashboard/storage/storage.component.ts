import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";
import { FileItem } from "@shared/interfaces/fileItem.model";
import { DbService } from "@shared/services/db.service";
import { FolderTreeComponent } from "./folder/folder.component";



@Component({
    selector: 'app-storage',
    templateUrl: "./storage.component.html",
    imports: [CommonModule, FolderTreeComponent]
})
export class StorageComponent { 
    fileTree = signal<FileItem[]>([]);
    constructor(private dbService: DbService){
        this.dbService.listAllFilesAndFloders('')
            .subscribe((items) => {
                this.fileTree.set(items);
            });
    }



    loadFolder(path: string, parentNode?: FileItem) {
        this.dbService.listAllFilesAndFloders(path)
            .subscribe((items) => {
                if (parentNode) {
                        parentNode.children = items;
                    parentNode.expanded = true;
                } 
            });
    }

    toggleFolder(folder: FileItem) {
        if (!folder.isFolder) return;
            folder.expanded = !folder.expanded;

            if (folder.expanded && (!folder.children || folder.children.length === 0)) {
                this.dbService.listAllFilesAndFloders(folder.path).subscribe((items) => {
                    folder.children = items;
                    // console.log(folder)
                    this.fileTree.update((tree) => [...tree])
                    // console.log(this.fileTree())
            });
            } else {
                this.fileTree.update((tree) => [...tree])
            }
    }
}