import { Routes } from "@angular/router";
import { DashboardLayoutComponent } from "./dashboard-layout.component";
import { MenusComponent } from "./menus/menus.component";
import { PostsComponent } from "./posts/posts.component";
import { MenuComponent } from "./menus/menu/menu.component";
import { PostComponent } from "./posts/post/post.component";

export const routes: Routes = [
    {
        path: '', 
        component: DashboardLayoutComponent,
        children: [
            { path: 'menus', component: MenusComponent },
            { path: 'menus/edit/:id', component: MenuComponent },
            { path: 'menus/edit', component: MenuComponent },
            { path: 'posts', component: PostsComponent },
            { path: 'posts/edit/:id', component: PostComponent },
            { path: 'posts/edit', component: PostComponent },
            { path: '', redirectTo: '/dashboard/posts', pathMatch: 'full' },
        ]
    }
]