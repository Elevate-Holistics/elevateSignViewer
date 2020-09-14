import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
//import{FranchisemasterComponent} from './views/master/franchisemaster/franchisemaster.component'

import { AuthGuard } from './auth.guard';
import {AppguardGuard} from '../app/guard/appguard.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AppguardGuard],
    data: {
      title: ''
    },
    children: [
  
      {
        path: 'sign',
        loadChildren: () => import('./modules/docsignviewer/docsignviewer.module').then(m => m.DocsignviewerModule)
      }
    ]
  },
  //{ path: '**', component: P404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
