import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewerComponent } from './viewer/viewer.component';
import {DocsignviewerRoutingModule} from '../docsignviewer/docsignviewer-routing.module';
import { iViewerModule } from "esigndoccontrol";
import {SharedModule} from '../../shared/shared.module';
import { ErrorpageComponent } from './errorpage/errorpage.component';
@NgModule({
  declarations: [ViewerComponent, ErrorpageComponent],
  imports: [
    CommonModule,
    DocsignviewerRoutingModule,
    iViewerModule,
    SharedModule
  ]
})
export class DocsignviewerModule { }
