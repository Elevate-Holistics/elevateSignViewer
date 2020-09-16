import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewerComponent } from './viewer/viewer.component';
import { DocsignviewerRoutingModule } from '../docsignviewer/docsignviewer-routing.module';
import { iViewerModule } from "esigndoccontrol";
// import { iViewerModule } from "/Users/pratiknaik/Work/i2t/DocEditor/idoceditor/dist/esigndoccontrol";

import { SharedModule } from '../../shared/shared.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ErrorpageComponent } from './errorpage/errorpage.component';
@NgModule({
  declarations: [ViewerComponent, ErrorpageComponent],
  imports: [
    CommonModule,
    DocsignviewerRoutingModule,
    iViewerModule,
    SharedModule,
    ConfirmDialogModule
  ]
})
export class DocsignviewerModule { }
