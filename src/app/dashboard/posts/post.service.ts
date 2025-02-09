import { Injectable } from "@angular/core";
import { DbService } from "../../shared/services/db.service";

@Injectable({
    providedIn: "root"
})
export class PostService {
    constructor(private dbService: DbService) {}

    getPostsByMenuId(menuId: string) {
        return this.dbService.getPostCollection();
    }
}