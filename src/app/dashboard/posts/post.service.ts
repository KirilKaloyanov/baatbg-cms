import { Injectable } from "@angular/core";
import { DbService } from "../../shared/services/db.service";
import { combineLatest, map, Observable } from "rxjs";
import { Menu } from "../menus/menu.model";
import { Post } from "./post.model";

@Injectable({
    providedIn: "root"
})
export class PostService {
    menus$!: Observable<Menu[]>;
    posts$!: Observable<Post[]>;

    constructor(private dbService: DbService) {
        this.menus$ = dbService.getMenuCollection();
        this.posts$ = dbService.getPostCollection();
    }

    getPostsGroupByMenuId(): Observable<Post[][]> {

        return combineLatest([this.menus$, this.posts$]).pipe(
            map(([menus, posts]) => {
                return menus
                  .map((menu: Menu) => posts.filter((post: Post) => menu.id === post.menuPath))
                  .filter((menuGroup: Post[]) => menuGroup.length > 0)
            })
        )
    }
}