
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../../service/global.service';
import { ToastService } from '../../../../service/toast-service';
import { TranslateService } from '@ngx-translate/core';

import { TemplateService } from '../../../../service/template.service';
import { ClsTemplate } from '../../../../model/cls-template.model';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  upload_url: any = '';

  templateObj: ClsTemplate;

  uploadMaxFilesize: any = 5000000;
  imageUrl: string = "";
  bucketPath: string = "https://bucket-cmp" + this.global.getCompany() + ".s3.us-east-2.amazonaws.com/";

  canSubmit: boolean;
  @ViewChild("f") ngform: NgForm;
  constructor(private router: Router, private global: GlobalService,
    private translate: TranslateService, private message: ToastService,
    private template: TemplateService, public route: ActivatedRoute,) {
  }

  ngDoCheck(): void {
    //Called every time that the input properties of a component or a directive are checked. Use it to extend change detection by performing a custom check.
    //Add 'implements DoCheck' to the class.
    this.checkIsFormValid();
  }

  checkIsFormValid() {
    this.canSubmit = !(this.templateObj.docurl.trim() != "" && this.ngform.form.valid && !this.global.loader);
  }

  ngOnInit(): void {
    this.templateObj = new ClsTemplate();
    this.upload_url = this.global.getConfig().api_root + '/company(' + this.global.getCompany() + ')/uploadpdf';
    // this.getAllTemplate();

    if (this.route.snapshot.paramMap.has('id'))
      this.getTemplateById(this.route.snapshot.paramMap.get('id'));

  }
  enableRecipient() {
    this.router.navigate(['/documents/templates/' + this.templateObj.id + '/recipient']);
  }
  enableEditor() {
    this.router.navigate(['/documents/editor'], { queryParams: { id: this.templateObj.id, filepath: this.templateObj.docurl } });
  }

  // IMAGE
  selectFile(event, fileUpload) {
    let file = event.files[0];
    if (file.size > this.uploadMaxFilesize) {
      this.message.show('error', 'Please upload pdf file.', 'error', this.translate);
      return false;
    }
    fileUpload.chooseLabel = "File Selected";
  }
  onFileUploadProgress(event, fileUpload) {
    fileUpload.chooseLabel = "File Uploading";
  }
  onFileBeforeUpload(event) {
    this.upload_url += '?usercreated=' + this.global.getUser().id + '&cmp=' + this.global.getCompany();
    event.formData.append('usercreated', this.global.getUser().id);

    event.formData.append('cmp', this.global.getCompany());
   // event.xhr.setRequestHeader('Authorization', 'Bearer ' + this.global.getUser().token);
  }
  onFileUpload(event, fileUpload) {
    let res: any = {};
    if (event.xhr && event.xhr.response) {
      res = JSON.parse(event.xhr.response);
    } else {
      res = event.originalEvent.body;
    }
    if (res.resultKey === 1) {
      fileUpload.chooseLabel = "File Uploaded";
      this.templateObj.docurl = res.resultValue.path;
      this.imageUrl = this.bucketPath + res.resultValue.imagePath;
    } else {
      this.templateObj.docurl = "";
    }
    this.global.loadertext = "Loading";
  }

  // getAllTemplate() {
  //   this.template.getAllTemplate({
  //     operate: 'get'
  //   }).subscribe((data: any) => {
  //     if (data.resultKey == 1) {
  //       console.log(data.resultValue);
  //     }
  //   });
  // }

  getTemplateById(id) {
    this.template.getTemplateById({
      operate: 'get',
      id: id
    }).subscribe((data: any) => {
      if (data.resultKey == 1) {
        this.templateObj = <ClsTemplate>data.resultValue[0];
        let imgPath = this.templateObj.docurl.split("/")[1];
        imgPath = imgPath.substr(0, imgPath.lastIndexOf(".")) + ".jpeg";
        this.imageUrl = this.bucketPath + "template/thumbnail/" + imgPath;
      }
    });
  }

  validation() {
    if (this.templateObj.docurl.trim() == "") {
      this.message.show('error', 'Please upload pdf file.', 'error', this.translate);
      return false;
    }
    return true;
  }

  saveTemplate() {
    if (this.validation()) {
      this.template.saveTemplate({
        operate: 'create',
        data: this.templateObj,
        userid: this.global.getUser().id
      }).subscribe((data: any) => {
        if (data.resultKey == 1) {
          this.templateObj.id = data.resultValue.msg;
          this.enableRecipient();
        } else {
          this.message.show('error', data.resultValue.msg, 'error', this.translate);
        }
      });
    }
  }

}