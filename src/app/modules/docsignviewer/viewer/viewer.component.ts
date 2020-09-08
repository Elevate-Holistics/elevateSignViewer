import { Component, OnInit, ViewChild } from '@angular/core';
import { iDocsigneditorComponent } from 'esigndoccontrol';
import { SignviewerService } from '../../../service/signviewer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../service/global.service';
import { Location } from '@angular/common';
@Component({
    selector: 'app-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit {
    @ViewChild('viewer', { static: false }) viewer: any
    options = {
        fonts: []
    }

    activedoc = 0;
    doclist: any = [];
    // [{name: 'Document Subject D Subject Herer ajjl',id: 1,status_icon: 'fa-warning',status_color: 'rgb(224, 120, 0)',extra: {}}, {name: 'DCS Subject D Subject Herer ajjl',status_icon: 'fa-check',status_color: 'rgb(0, 184, 92)',id: 2,extra: {}}]
    filePath = '';
    pdfSrc = "assets/sdlc.pdf";
    envid: string = '';
    cmpid: string = '';
    docid: string = '';
    constructor(private signviewer: SignviewerService, private route: ActivatedRoute,
        private router: Router, private global: GlobalService, private location: Location,) { }

    ngOnInit(): void {
        debugger;
        this.envid = this.route.snapshot.paramMap.get('envid');
        this.cmpid = this.route.snapshot.paramMap.get('cmpid');
        this.docid = this.route.snapshot.paramMap.get('docid');

        // this.filePath="https://bucket-cmp" + this.global.getCompany() + ".s3.us-east-2.amazonaws.com/"
        this.filePath = "https://bucket-cmp" + this.cmpid + ".s3.us-east-2.amazonaws.com/"
        this.bindDocuments();
    }

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
        setTimeout(() => {
            this.viewer.setData(this.pdfSrc, {"1":{"1599553630906":{"extras":{"recipient":{"val":"Patients","extra":["Patients"]}},"style":{"fontFamily":"Arial","fontSize":12,"fontStyle":"normal","fontWeight":"normal","width":100,"left":241,"top":214},"dataset":{"name":"1599553630906","type":"text","page":1,"fieldtype":"none","maxlength":1000,"require":true},"type":"text","id":"1599553630906","text":"TextBox","val":"Value"},"1599553632941":{"extras":{"ddlprop":{"val":"asdlksja;sdklsja;sds","extra":["asdlksja","sdklsja","sds"],"defval":"sdklsja"},"recipient":{"val":"Patients","extra":["Patients"]}},"style":{"left":624,"top":228,"fontFamily":"Arial","fontSize":12,"fontStyle":"normal","fontWeight":"normal","width":100},"dataset":{"name":"1599553632941","type":"ddl","page":1,"require":true},"type":"ddl","id":"1599553632941","text":"Dropdown","val":"sdklsja"},"1599553654021":{"extras":{"recipient":{"val":"Doctor","extra":["Doctor"]}},"style":{"left":377,"top":326,"width":50,"height":50},"dataset":{"name":"1599553654021","type":"sign","page":1,"require":true},"type":"sign","id":"1599553654021"}}})
        }, 100);
    }
    onFinished(e) {
        console.log(e)
    }

    onCancel(e) {

    }
    onDocListSelect(item) {
        debugger
        if (this.activedoc == item.id) {
            return;
        }
        this.activedoc = item.id;
        this.doclist.find((a) => {
            if (a.id == this.activedoc) {
                //let abc='sign/2/28827f42-eb7a-11ea-b33a-40b034be4f37';
               
                this.router.navigate(['/sign/2/28827f42-eb7a-11ea-b33a-40b034be4f37/' + a.id]);
                //this.viewer.setData(a.src, {});



            }
        })
    }

    bindDocuments() {
        debugger
        this.signviewer.getDocumnet({
            "operate": 'forsignviewer',
            "envid": this.envid,
            "cmpid": "cmp" + this.cmpid
        }).subscribe((data) => {
            if (data.resultKey == 1) {
                this.makeData(data.resultValue);
                //this.doclist =
            }
        })
    }

    makeData(data) {

        if (data.length > 0) {
            debugger
            data.forEach(element => {
                let tempSrc = element.src;
                element.src = this.filePath + tempSrc;
                this.doclist.push(element);
            });
 
            // if( this.route.snapshot.paramMap.has('docid')){
            //     let docid=this.route.snapshot.paramMap.get('docid');
            //     let result= data.find((b)=>{
            //         return b.id=docid;
            //     })
            //     this.onDocListSelect(result);
               
            // }else {
            //     this.onDocListSelect(data[0]);
            // }
             
        }
        debugger

    }

}
