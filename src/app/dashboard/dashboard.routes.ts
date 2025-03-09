import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './dashboard-layout.component';
import { MenusComponent } from './menus/menus.component';
import { PostsComponent } from './posts/posts.component';
import { MenuComponent } from './menus/menu/menu.component';
import { PostComponent } from './posts/post/post.component';
import { MemberComponent } from './members/member/member.component';
import { MemberFormComponent } from './members/member-form/member-form.component'
import { MemberTypeComponent } from './members/member-type/member-type.component';
import { StorageComponent } from './storage/storage.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: 'storage', component: StorageComponent},
      { path: 'menus', component: MenusComponent },
      {
        path: 'menus/edit/:id',
        component: MenuComponent,
        data: { isCreate: false },
      },
      {
        path: 'menus/create',
        component: MenuComponent,
        data: { isCreate: true },
      },
      { path: 'posts', component: PostsComponent },
      {
        path: 'posts/edit/:id',
        component: PostComponent,
        data: { isCreate: false },
      },
      {
        path: 'posts/create',
        component: PostComponent,
        data: { isCreate: true },
      },
      { path: 'members', component: MemberComponent },
      { path: 'members/create', component: MemberFormComponent, data: { isCreate: true } },
      { path: 'members/edit/:id', component: MemberFormComponent, data: { isCreate: false } },
      { path: 'member-types', component: MemberTypeComponent },
      { path: '', redirectTo: '/dashboard/posts', pathMatch: 'full' },
    ],
  },
];
