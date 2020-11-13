import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Prerequisite } from '../../service/prerequisite';
import { ViewerComponent } from '../docsignviewer/viewer/viewer.component';
import { ErrorpageComponent } from '../docsignviewer/errorpage/errorpage.component';
import { CompletedComponent } from '../docsignviewer/completed/completed.component';
import { AuthGuard } from '../../service/authguard.service';
import { from } from 'rxjs';

const routes: Routes = [
  {
    path: '',


    children: [
      // {
      //   path: ':cmpid/:dmid/:emailid',
      //   component: ViewerComponent,
      //   canActivate: [AuthGuard],
      //   data: {
      //     title: 'Sign',
      //     code: 'sign'

      //   }
      // },
      {
        path: ':cmpid/:dmid/:drid/:emailid',
        component: ViewerComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Sign',
          code: 'sign'

        }
      },
      {
        path: ':cmpid/:dmid/:drid/:emailid/:otp',
        component: ViewerComponent,
        canActivate: [],
        data: {
          title: 'Sign',
          code: 'sign'

        }
      },
      {
        path: 'error',
        component: ErrorpageComponent,
        canActivate: [],
        data: {
          title: 'Error',
          code: 'error'

        }
      },
      {
        path: 'complete/:type',
        component: CompletedComponent,
        canActivate: [],
        data: {
          title: 'Complete',
          code: 'complete'

        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DocsignviewerRoutingModule { }
