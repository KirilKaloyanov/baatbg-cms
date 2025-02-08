import { Routes } from "@angular/router";
import { DashboardLayoutComponent } from "./dashboard-layout.component";
import { MenusComponent } from "./menus/menus.component";
import { PostsComponent } from "./posts/posts.component";

export const routes: Routes = [
    {
        path: '', 
        component: DashboardLayoutComponent,
        children: [
            { path: 'menus', component: MenusComponent },
            { path: 'posts', component: PostsComponent },
            { path: '', redirectTo: '/dashboard/posts', pathMatch: 'full' },
        ]
    }
]