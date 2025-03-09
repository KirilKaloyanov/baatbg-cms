import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FileItem } from "@shared/interfaces/fileItem.model";
import { DbService } from "@shared/services/db.service";



@Component({
    selector: 'app-storage',
    templateUrl: "./storage.component.html",
    imports: [CommonModule]
})
export class StorageComponent { 
    constructor(private dbService: DbService){}

    fileTree: FileItem[] = [];

    ngOnInit() {
        this.loadFolder('')
    }

    loadFolder(path: string, parentNode?: FileItem) {
        this.dbService.listAllFilesAndFloders(path)
            .subscribe((items) => {
                if (parentNode) {
                    parentNode.children = items;
                    parentNode.expanded = true;
                } else { 
                    this.fileTree = items;
                }
            });
    }

    toggleFolder(folder: FileItem) {
        if (!folder.expanded) {
            this.loadFolder(folder.path, folder);
        } else {
            folder.expanded = false;
        }
    }
}