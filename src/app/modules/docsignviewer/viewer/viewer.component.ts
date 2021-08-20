import { Component, OnInit, ViewChild } from '@angular/core';
import { iDocsigneditorComponent, iDocsignviewerComponent } from 'esigndoccontrol';
//import { iDocsigneditorComponent, iDocsignviewerComponent } from '/Users/pratiknaik/Work/i2t/DocEditor/idoceditor/dist/esigndoccontrol';

import { SignviewerService } from '../../../service/signviewer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../service/global.service';
import { Location } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { ToastService } from '../../../service/toast-service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment'
import { UserModel } from '../../../intefaces/userModel';

@Component({
    selector: 'app-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.css'],
    providers: [ConfirmationService]
})
export class ViewerComponent implements OnInit {
    @ViewChild('viewer', { static: false }) viewer: iDocsignviewerComponent
    options = {
        fonts: []
    }
    env = {}
    config: any = [];
    currentView = '';
    activedoc: any = '';
    otp: string = '';
    doclist: any = [];
    defaultDocdata = '';
    // [{name: 'Document Subject D Subject Herer ajjl',id: 1,status_icon: 'fa-warning',status_color: 'rgb(224, 120, 0)',extra: {}}, {name: 'DCS Subject D Subject Herer ajjl',status_icon: 'fa-check',status_color: 'rgb(0, 184, 92)',id: 2,extra: {}}]
    filePath = '';
    pdfSrc = "assets/sdlc.pdf";
    dmid: string = '';
    cmpid: string = '';
    drid: string = '';
    emailid: any = '';
    recpid: any = '';
    constructor(private signviewer: SignviewerService, private activatedRoute: ActivatedRoute,
        private router: Router, private global: GlobalService, private location: Location,
        private confirmmsg: ConfirmationService, private message: ToastService, private translate: TranslateService) { this.env = environment; }

    ngOnInit() {
        this.dmid = this.activatedRoute.snapshot.paramMap.get('dmid');
        this.cmpid = this.activatedRoute.snapshot.paramMap.get('cmpid');
        this.drid = this.activatedRoute.snapshot.paramMap.get('drid');
        this.emailid = this.activatedRoute.snapshot.paramMap.get('emailid');
        this.activedoc = this.activatedRoute.snapshot.paramMap.has('drid') ? this.activatedRoute.snapshot.paramMap.get('drid') : 0;

        if (this.activatedRoute.snapshot.paramMap.has('otp')) {
            this.env["isAuthenticated"] = true;
            this.otp = this.activatedRoute.snapshot.paramMap.get('otp')
        }

        this.config = this.global.getConfig();
        // this.filePath="https://bucket-cmp" + this.global.getCompany() + ".s3.us-east-2.amazonaws.com/"
        this.filePath = this.global.format(this.config.AWS_BUCKET_PREFIX, [this.cmpid]); //"https://bucket-cmp" + this.cmpid + ".s3.us-east-2.amazonaws.com/"
        // this.bindDocumentsList();
    }

    ngAfterViewInit(): void {
        this.bindDocumentDetails(this.drid);
        this.viewer.addSignatureFonts([{
            name: '\'Great Vibes\'',
            url: 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap'
        }, {
            name: '\'Alex Brush\'',
            url: 'https://fonts.googleapis.com/css2?family=Alex+Brush&family=Great+Vibes&family=Rock+Salt&display=swap'
        }, {
            name: '\'Herr Von Muellerhoff\'',
            url: 'https://fonts.googleapis.com/css2?family=Alex+Brush&family=Great+Vibes&family=Herr+Von+Muellerhoff&family=Rock+Salt&display=swap'
        }])
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
        //  setTimeout(() => {
        //     this.viewer.setData(this.pdfSrc, { "1": { "1599553630906": { "extras": { "recipient": { "val": "Patients", "extra": ["Patients"] } }, "style": { "fontFamily": "Arial", "fontSize": 12, "fontStyle": "normal", "fontWeight": "normal", "width": 100, "left": 241, "top": 214 }, "dataset": { "name": "1599553630906", "type": "text", "page": 1, "fieldtype": "none", "maxlength": 1000, "require": true }, "type": "text", "id": "1599553630906", "text": "TextBox", "val": "Value" }, "1599553632941": { "extras": { "ddlprop": { "val": "asdlksja;sdklsja;sds", "extra": ["asdlksja", "sdklsja", "sds"], "defval": "sdklsja" }, "recipient": { "val": "Patients", "extra": ["Patients"] } }, "style": { "left": 624, "top": 228, "fontFamily": "Arial", "fontSize": 12, "fontStyle": "normal", "fontWeight": "normal", "width": 100 }, "dataset": { "name": "1599553632941", "type": "ddl", "page": 1, "require": true }, "type": "ddl", "id": "1599553632941", "text": "Dropdown", "val": "sdklsja" }, "1599553654021": { "extras": { "recipient": { "val": "Doctor", "extra": ["Doctor"] } }, "style": { "left": 377, "top": 326, "width": 50, "height": 50 }, "dataset": { "name": "1599553654021", "type": "sign", "page": 1, "require": true }, "type": "sign", "id": "1599553654021" } } })
        // }, 100);
    }
    validate(e) {
        let v = this.viewer.validate(this.currentView)
        if (v.length > 0) {
            return;
        }else if(e == "validateonly"){
            return;
        }
        this.signviewer.validate({
            'operate': 'validateisfinish',
            'drid': this.drid,
            'email': this.global.getUser().email,
            'cmpid': this.global.getCompany(),
            'key': this.global.getUser().key

        }).subscribe((data: any) => {
            if (data.resultKey == 1) {
                if (data.resultValue[0].finished == true) {
                    this.router.navigate(['sign/complete/a']);
                } else if (data.resultValue[0].finished == false) {
                    this.onFinished(e);
                }
            }
        })
    }
    onFinished(e) {
        // let flag = this.validate();

        
        let v = this.viewer.validate(this.currentView)


        let valueData = this.viewer.getValues(this.currentView);
        let data = {
            'dmid': this.dmid,
            'drid': this.drid,
            'recpid': this.recpid,
            'valuedata': valueData

        }
        this.signviewer.processData({
            'operate': 'process',
            'data': data,
            'cmpid': this.cmpid,
            "key": this.global.getUser().key,
            "userid": 'ba3078a8-ec11-4aeb-953d-3513c05d203d'

        }).subscribe((data: any) => {
            if (data.resultKey == 1) {
                this.message.show('Success', 'Saved', 'success', this.translate);
                this.router.navigate(['sign/complete/f']);
            }
        })

    }

    onCancel(e) {

    }

    onDocListSelect(item) {

        this.bindDocumentDetails(item.drid);
    }
    setDatatoViewer(item) {

        this.activedoc = item.id;
        let docdata = (item.docdata != '{}' || item.docdata != null || item.docdata != undefined) ? JSON.parse(item.docdata) : item.docdata;
        let valuedata = (item.valuedata != '{}' || item.valuedata != null || item.valuedata != undefined) ? JSON.parse(item.valuedata) : item.valuedata;

        console.log('docdata', docdata);
        console.log('valuedata', valuedata);
        this.currentView = item.key;

        item.cval = JSON.parse(item.cval);

        let othersInput = {};
        if (item.cval != null) {
            item.cval.forEach(element => {
                othersInput = { ...element, ...othersInput }
            });
        }

        if (item.sign) {
            this.viewer.addSignatureList(item.sign.filter(a => a.type == "signature").map(b => ({ "name": b.name, "url": b.s3path, "type": 'sign' })))
            this.viewer.addInitialList(item.sign.filter(a => a.type == "initial").map(b => ({ "name": b.name, "url": b.s3path, "type": b.type })))
        }
        this.viewer.setSignatureName(item.uname, item.uname);

        this.viewer.setData(item.src, docdata, item.key, {}, othersInput);

        // this.router.navigate(['/sign/2/' + this.dmid + '/' + item.drid]);
        //  this.viewer.setVisibility();

    }

    bindDocumentsList() {

        this.signviewer.getDocumnet({
            "operate": 'list',
            "dmid": this.dmid,
            "cmpid": "cmp" + this.cmpid,
            "templateid": this.activatedRoute.snapshot.paramMap.has('drid') ? this.drid : null,
            "key": this.global.getUser().key,
            "drid": this.drid,
            "recpid": this.global.getUser().id
        }).subscribe((data) => {
            if (data.resultKey == 1) {
                if (data.resultValue.length == 0) {
                    this.global.removeUser();
                    this.router.navigate(['/sign/' + this.cmpid + '/' + this.dmid + '/' + this.drid]);
                    // this.global.setBackurl();

                }
                else {

                    this.doclist = data.resultValue;
                    this.bindDocumentDetails(this.drid);
                }

            }
        })


    }
    bindDocumentDetails(templateid) {
        this.signviewer.getDocumnet({
            "operate": this.otp == '' ? 'docdetail' : 'docdetailotp',
            "dmid": this.dmid,
            "cmpid": "cmp" + this.cmpid,
            "templateid": templateid,
            "key": this.global.getUser().key,
            "drid": this.drid,
            "recpid": this.global.getUser().id,
            "email": this.global.getUser().email,
            "otp": this.otp
        }).subscribe((data) => {
            if (data.resultKey == 1) {
                this.makeData(data.resultValue);
            }
        })
    }
    makeData(data) {
        if (data.length > 0) {
            let docdetail = data[0];

            if (docdetail.status == "completed") {
                this.router.navigate(['/sign/complete/a']);
            } else {
                if (this.otp != "") {
                    const user: UserModel = {
                        email: docdetail.email,
                        key: docdetail.key,
                        id: docdetail.id
                    };
                    this.global.setIslogin(true);
                    this.global.setUser(user);
                }

                this.recpid = docdetail.recpid;
                let tempUrl = JSON.parse(docdetail.url);
                let url = this.filePath + tempUrl.doc;
                docdetail.src = url;
                docdetail.sign = JSON.parse(docdetail.sign);
                // let result = this.doclist.find((a) => {
                //     if (a.id == docdetail.id) {

                //         a.src = this.filePath + url;
                //         return a;
                //     }
                // })


                // if (result != undefined) {
                this.setDatatoViewer(docdetail);
                // }


                // console.log(this.doclist);
            }

        } else if (data.length == 0) {
            this.router.navigate(['/sign/error']);
        }
    }

    onSignatureCreate(event) {
        //   this.viewer.signUploaded(true, { name: event.name, url: "" }, event.controlid);
        // this.confirmmsg.confirm({
        //     message: 'Do you want to save this signature for future purpose?',
        //     header: 'Delete Confirmation',
        //     icon: 'pi pi-info-circle',
        //     accept: () => {
        //         this.uploadSignature(event, true);
        //     },
        //     reject: () => {
        //         this.uploadSignature(event, false);
        //     }
        // });
        this.uploadSignature(event, true);
    }

    onSignatureApplyAll(event) {
        this.validate("validateonly")
    }

    uploadSignature(event, saveInDB) {
        this.signviewer.saveSignature({
            'img': event.base64,
            'name': event.props.dataset.name,
            'emailid': this.global.getUser().email,
            'title': "",
            'desc': "",
            'type': event.props.type == 'sign' ? 'signature' : 'initial',
            'dbsave': saveInDB,
            'cmpid': this.cmpid,
            'userid': this.global.getUser().id
        }).subscribe((data: any) => {
            if (data.resultKey == 1) {
                this.viewer.signUploaded(true,
                    { name: event.props.dataset.name, url: this.filePath + data.resultValue.path },
                    event.props);
            } else {
                console.log("Error while uploading signature");
            }
        })
    }
}
