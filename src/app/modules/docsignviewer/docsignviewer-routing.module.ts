import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Prerequisite } from '../../service/prerequisite';
import {ViewerComponent} from '../docsignviewer/viewer/viewer.component';
import {ErrorpageComponent} from '../docsignviewer/errorpage/errorpage.component';
import { from } from 'rxjs';

const routes: Routes = [
    {
      path: '',
  
  
      children: [
        {
          path: ':cmpid/:envid',
          component: ViewerComponent,
        
          data: {
            title: 'Sign',
            code: 'sign'
  
          }
        },
        {
          path: ':cmpid/:envid/:docid',
          component: ViewerComponent,
        
          data: {
            title: 'Sign',
            code: 'sign'
  
          }
        }
,
        {
          path: 'error',
          component: ErrorpageComponent,
        
          data: {
            title: 'Error',
            code: 'error'
  
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
