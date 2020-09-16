import { Component, OnInit, ViewChild } from '@angular/core';
import { iDocsigneditorComponent, iDocsignviewerComponent } from 'esigndoccontrol';
// import { iDocsigneditorComponent, iDocsignviewerComponent } from '/Users/pratiknaik/Work/i2t/DocEditor/idoceditor/dist/esigndoccontrol';

import { SignviewerService } from '../../../service/signviewer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../service/global.service';
import { Location } from '@angular/common';
import { ConfirmationService } from 'primeng/api';

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
    currentView = '';
    activedoc: any = '';
    doclist: any = [];
    defaultDocdata = '';
    // [{name: 'Document Subject D Subject Herer ajjl',id: 1,status_icon: 'fa-warning',status_color: 'rgb(224, 120, 0)',extra: {}}, {name: 'DCS Subject D Subject Herer ajjl',status_icon: 'fa-check',status_color: 'rgb(0, 184, 92)',id: 2,extra: {}}]
    filePath = '';
    pdfSrc = "assets/sdlc.pdf";
    envid: string = '';
    cmpid: string = '';
    docid: string = '';
    constructor(private signviewer: SignviewerService, private activatedRoute: ActivatedRoute,
        private router: Router, private global: GlobalService, private location: Location, private confirmmsg: ConfirmationService,) { }

    ngOnInit() {


        this.envid = this.activatedRoute.snapshot.paramMap.get('envid');
        this.cmpid = this.activatedRoute.snapshot.paramMap.get('cmpid');
        this.docid = this.activatedRoute.snapshot.paramMap.get('docid');

        this.activedoc = this.activatedRoute.snapshot.paramMap.has('docid') ? this.activatedRoute.snapshot.paramMap.get('docid') : 0;

        // this.filePath="https://bucket-cmp" + this.global.getCompany() + ".s3.us-east-2.amazonaws.com/"
        this.filePath = "https://bucket-cmp" + this.cmpid + ".s3.us-east-2.amazonaws.com/"
        this.bindDocumentsList();
    }

    ngAfterViewInit(): void {
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
    onFinished(e) {
        let v = this.viewer.validate(this.currentView)
        if (v.length > 0) {
            return
        }

        let data = this.viewer.getValues(this.currentView);
        this.signviewer.postData({
            'operate': 'finish',
            'dmid': this.envid,
            'drid': this.docid,
            'data': data,
            'cmpid': 'cmp' + this.cmpid,
            "key": this.global.getUser().key

        }).subscribe((data: any) => {

        })

    }

    onCancel(e) {

    }

    onDocListSelect(item) {

        this.bindDocumentDetails(item.drid);
    }
    setDatatoViewer(item) {


        this.activedoc = item.id;
        let docdata = (item.actualvaluedata != '{}' || item.actualvaluedata != null || item.actualvaluedata != undefined) ? JSON.parse(item.actualvaluedata) : item.actualvaluedata;
        let valuedata = (item.valuedata != '{}' || item.valuedata != null || item.valuedata != undefined) ? JSON.parse(item.valuedata) : item.valuedata;

        console.log('docdata', docdata);
        console.log('valuedata', valuedata);
        this.currentView = item.key;
        this.viewer.setData(item.src, docdata, item.key);
        // this.router.navigate(['/sign/2/' + this.envid + '/' + item.drid]);

        //  this.viewer.setVisibility();

    }

    bindDocumentsList() {

        this.signviewer.getDocumnet({
            "operate": 'list',
            "dmid": this.envid,
            "cmpid": "cmp" + this.cmpid,
            "templateid": this.activatedRoute.snapshot.paramMap.has('docid') ? this.docid : null,
            "key": this.global.getUser().key
        }).subscribe((data) => {
            if (data.resultKey == 1) {
                if (data.resultValue.length == 0) {
                    this.global.removeUser();
                    this.router.navigate(['/sign/' + this.cmpid + '/' + this.envid + '/' + this.docid]);
                    // this.global.setBackurl();

                }
                else {

                    this.doclist = data.resultValue;
                    this.bindDocumentDetails(this.docid);
                }

            }



        })


    }
    bindDocumentDetails(templateid) {
        debugger
        this.signviewer.getDocumnet({
            "operate": 'docdetail',
            "dmid": this.envid,
            "cmpid": "cmp" + this.cmpid,
            "templateid": templateid,
            "key": this.global.getUser().key
        }).subscribe((data) => {
            if (data.resultKey == 1) {

                this.makeData(data.resultValue);
            }


        })
    }
    makeData(data) {


        if (data.length > 0) {
            let docdetail = data[0];
            let tempUrl = JSON.parse(docdetail.url);
            let url = tempUrl.doc;

            let result = this.doclist.find((a) => {
                if (a.id == docdetail.id) {

                    a.src = this.filePath + url;
                    return a;
                }
            })


            if (result != undefined) {
                this.setDatatoViewer(result);
            }


            console.log(this.doclist);


        } else {
            this.router.navigate(['/sign/error']);
        }
    }

    onSignatureCreate(event) {
        //   this.viewer.signUploaded(true, { name: event.name, url: "" }, event.controlid);
        this.confirmmsg.confirm({
            message: 'Do you want to save this signature for future purpose?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            accept: () => {
                this.uploadSignature(event, true);
            },
            reject: () => {
                this.uploadSignature(event, false);
            }
        });

    }

    uploadSignature(event, saveInDB) {
        this.signviewer.saveSignature({
            'img': event.base64,
            'name': event.name,
            'emailid': this.global.getUser().email,
            'title': "",
            'desc': "",
            'type': 'signature',
            'dbsave': saveInDB,
            'cmpid': this.cmpid,
            'userid': this.global.getUser().id
        }).subscribe((data: any) => {
            if (data.resultKey == 1) {
                debugger
                this.viewer.signUploaded(true,
                    { name: event.name, url: this.filePath + data.resultValue.path },
                    event.props);
            } else {
                console.log("Error while uploading signature");
            }
        })
    }
}
