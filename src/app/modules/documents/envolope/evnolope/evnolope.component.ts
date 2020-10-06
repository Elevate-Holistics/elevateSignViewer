import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ActionBarComponent } from '../../../../shared/usercontrol/actionbar/actbar.comp';
import { EnvolopeService } from '../../../../service/envolope.service';
import { GlobalService } from '../../../../service/global.service';
import { ToastService } from '../../../../service/toast-service';
import { TranslateService } from '@ngx-translate/core';
import { TemplateService } from '../../../../service/template.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-evnolope',
  templateUrl: './evnolope.component.html',
  styleUrls: ['./evnolope.component.css']
})
export class EvnolopeComponent implements OnInit {
  @ViewChild('actionbar', { static: false }) actionbar: ActionBarComponent;
  @ViewChild('template') popupContainer;
  @ViewChild('template1') popupContainer1;

  items: any = [];
  loader: boolean = false;
  showDocpannel: boolean = false;
  uniqueRecepientheadList: any = [];
  RecepientheadList: any = [];

  buttons = [];
  form: any = {
    id: null,
    envname: ''
  }
  isedit: boolean = false;
  isloading = false;
  onColclickid: any = '';
  searchstring: any = '';
  modalRef: any;
  noEnvmsg: any = '';
  showLoader: boolean = false;
  srcurl: any = '';
  searchtemplatestring: any = '';
  temptemplateList: any = [];
  noTemplatefound: boolean = false;
  constructor(private envelope: EnvolopeService, private global: GlobalService, private message: ToastService, private translate: TranslateService, private template: TemplateService, private modalService: BsModalService, private router: Router) {


    this.items = [{
      label: 'Action',
      items: [
        {
          label: 'New', icon: 'pi pi-fw pi-plus', command: (event) => {
            this.open();
          }
        },
        {
          label: 'Edit', icon: 'pi pi-fw pi-pencil', command: (event) => {
            this.edit(0);
          }
        },
        { label: 'Remove', icon: 'pi pi-fw pi-trash' }
      ]
    }, {
      label: 'Template',
      items: [
        {
          label: 'Add Templates', icon: 'pi pi-fw pi-file-o', command: (event) => {
            this.getAllTemplate();
            this.open1();
          }
        },
      ]
    }];
  }
  templateList: any = [];
  documentList: any = [];
  documentsDeatilList: any = [];
  envNo: any = '';
  selectedenvelope: any = {};
  envelopeList = [];
  tempEnvlopeList = [];
  filePath: any = '';
  showDocspinner: boolean = false;
  ngOnInit(): void {

    this.srcurl = "";
    this.filePath = "https://bucket-cmp" + this.global.getCompany() + ".s3.us-east-2.amazonaws.com/";
    console.log(this.filePath);
    // this.getAllTemplate();
    //   this.templateList = [
    //     { id: 1, name: "Template 1", src: "/assets/img/img1.png" },
    //     { id: 2, name: "Template 2", src: "/assets/img/img2.png" },
    //     { id: 3, name: "Template 3", src: "" }, { id: 4, name: "Template 4", src: "/assets/img/img1.png" },
    //     { id: 5, name: "Template 5", src: "/assets/img/img2.png" },
    //     { id: 6, name: "Template 6", src: "" }
    // ];
    this.bindEnvelope();

    // for (let index = 0; index < 100; index++) {
    //   this.envelopeList.push({ id: index, name: "Envelope " + index });

    // }




  }

  buttonClicks(id) {

    switch (id) {
      case 'edit':
        this.edit(id)

        //    this.open();
        break;
      case 'add':
        this.templateList = [];
        this.temptemplateList = [];
        this.getAllTemplate();

        this.open1();
        break;
      default:
        break;
    }
  }

  onTemplateSelected(item) {
    item.checked = !item.checked;
  }

  bindEnvelope() {

    this.envelopeList = [];
    this.tempEnvlopeList = [];
    this.showLoader = true;
    this.envelope.getEnvolope({
      'operate': 'bindenv'
    }).subscribe((data: any) => {
      if (data.resultKey === 1) {
        this.envelopeList = data.resultValue;
        this.tempEnvlopeList = data.resultValue;
        this.showLoader = false;
      } else {
        this.showLoader = false;
      }
    })
  }

  onColumnClick(item) {
    if (this.onColclickid == item.id) {
      return;
    }

    this.buttons = [
      {
        'id': 'edit', 'color': 'white', 'bg': 'primary', 'text': 'Edit Envelope', 'icon': 'pencil', 'shortcut': 'ctrl+shift+a',
        'disabled': false, 'access': true
      },
      {
        'id': 'add', 'color': 'white', 'bg': 'success', 'text': 'Add Templates In Envelope', 'icon': 'plus', 'shortcut': 'ctrl+shift+a',
        'disabled': false, 'access': true
      }
    ];
    this.onColclickid = item.id;

    // this.documentsDeatilList = [
    //   { id: 1, name: "Document 1", src: "/assets/img/img1.png" },
    //   { id: 2, name: "Document 2", src: "/assets/img/img2.png" },
    //   { id: 3, name: "Document 3", src: "" },
    //   { id: 4, name: "Document 1", src: "/assets/img/img1.png" },
    //   { id: 5, name: "Document 1", src: "/assets/img/img1.png" },
    //   { id: 6, name: "Document 1", src: "/assets/img/img1.png" },];
    this.bindDocuments(this.onColclickid);
    this.loader = true;




    this.actionbar.changeProp('edit', 'disabled', false);
    this.selectedenvelope = item;
  }


  makeDocgrid(gridList) {

    if (gridList.length == 0) {
      this.showDocspinner = false;
      return;
    }
    this.documentsDeatilList = [];
    this.uniqueRecepientheadList = []
    this.RecepientheadList = []
    gridList.forEach(element => {

      element.src = (element.src == null || element.src == '' || element.src == undefined) ? null :
        this.filePath + 'template/thumbnail/' + element.src.split('/')[1].replace('.pdf', '.jpeg');

      this.documentsDeatilList.push(element);
      let data = JSON.parse(element.recipienthead);
      this.RecepientheadList = this.RecepientheadList.concat(data)
        ;


      // this.uniqueRecepientheadList = this.uniqueRecepientheadList.concat(this.global.makeJSON(element.recepienthead)
      // );

    });

    // this.uniqueRecepientheadList = this.uniqueRecepientheadList.filter(function (item, index, inputArray) {
    //   return inputArray.indexOf(item) == index;
    // });

    for (let i = 0; i < this.RecepientheadList.length; i++) {
      const element = this.RecepientheadList[i];
      if (!element.id) continue;
      if (!this.uniqueRecepientheadList.find(a => {
        return a.id == element.id
      })) {

        this.uniqueRecepientheadList.push(element);
      }

      // if(this.uniqueRecepientheadList.indexOf(element.id) == -1){
      //   this.uniqueRecepientheadList.push(element);
      // }
    }
    this.showDocspinner = false;
    console.log(this.uniqueRecepientheadList);
    // gridList.forEach(element => {
    //   element.src = this.filePath + element.src;

    //   this.uniqueRecepientheadList.push(element);

    // });



  }
  bindDocuments(envid) {
    this.isloading = true;
    this.documentsDeatilList = [];
    this.envelope.getEnvolope({
      'operate': 'binddocforgrid',
      'envid': envid
    }).subscribe((data: any) => {
      if (data.resultKey === 1) {
        this.showDocspinner = true;

        // this.documentList = data.resultValue;
        this.makeDocgrid(data.resultValue);
        this.isloading = false;
      } else {
        this.isloading = false;
      }
    }, () => {
      this.isloading = false;
    })

  }

  focus() {
    setTimeout(() => {
      $('#envname').focus();
    }, 300);
  }

  open() {
    if (this.isedit == false) {
      this.form.id = null;
      this.form.envname = '';

    }
    this.focus();
    this.modalRef = this.global.showPopup(this.popupContainer);
  }

  open1() {

    this.modalRef = this.global.showPopup(this.popupContainer1, { class: 'modal-lg' });
  }

  closeModal() {


    //  this.clear();
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  closeModal1() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
    //  this.bindDocuments(this.onColclickid);
  }

  save() {

    this.envelope.SaveEnvolope({
      "id": this.form.id,
      "envname": this.form.envname,
      "comapnyid": this.global.getCompany(),

    }).subscribe((res: any) => {
      if (res.resultKey == 1) {
        this.message.show('Success', 'Saved successfully', 'success', this.translate);
        this.searchstring = '';
        this.isedit = false;
        if (this.form.id == null) {
          let data = {
            id: res.resultValue.msg,
            name: this.form.envname,
            comapnyid: this.global.getCompany()
          }
          this.envelopeList.push(data);
        } else {
          this.envelopeList.forEach(element => {
            if (element.id == this.form.id) {
              element.name = this.form.envname;


            }
          });
        }

        this.form.envname = '';
        //this.envelopeList.push();
        // this.bindEnvelope();

        this.closeModal();



      } else if (res.resultValue.errorcode != '') {
        this.message.show('error', res.resultValue.msg, 'error', this.translate);
      }
      else {
        this.message.show('error', res.resultValue.msg, 'error', this.translate);
      }
    })
  }

  searchEnvolope() {
    if (this.searchstring == '' || this.searchstring == undefined || this.searchstring == null) {
      this.envelopeList = []
      this.noEnvmsg = '';
      this.envelopeList = this.tempEnvlopeList;
      //  this.bindEnvelope();
      return;
    }
    if (this.searchstring != '' || this.searchstring != undefined || this.searchstring != null) {
      this.showLoader = true;

      let tempEnvlist = this.tempEnvlopeList;
      this.envelopeList = [];

      let values = tempEnvlist.filter((a) => {
        let name = a.name.toLowerCase();
        return name.includes(this.searchstring.toLowerCase());
      });

      if (values.length >= 0) {

        this.showLoader = false;
        values.forEach(element => {
          this.envelopeList.push(element);
        });
      } else {
        this.showLoader = false;
      }




    }
  }



  count: any = 0;
  searchTemplates() {
    this.count = 0;
    // if (this.searchtemplatestring == '' || this.searchtemplatestring == undefined || this.searchtemplatestring == null) {
    //   this.templateList = []
    //   this.noEnvmsg = '';
    //   this.templateList = this.temptemplateList;
    //   //  this.bindEnvelope();
    //   return;
    // }

    if (this.searchtemplatestring != '' || this.searchtemplatestring != undefined || this.searchtemplatestring != null) { }
    let temptemplate = this.temptemplateList;

    this.noTemplatefound = false;
    // this.templateList = [];
    for (let index = 0; index < this.templateList.length; index++) {
      const element = this.templateList[index];
      let name = element.name.toLowerCase();

      // name.includes(this.searchtemplatestring.toLowerCase());
      if (!name.includes(this.searchtemplatestring.toLowerCase())) {
        element.show = false;




      }
      else {

        element.show = true;


      }
    }



  }

  // searchEnvolope() {
  //   if (this.searchstring == '' || this.searchstring == undefined || this.searchstring == null) {
  //     this.envelopeList = []
  //     this.noEnvmsg = '';
  //     this.bindEnvelope();
  //     return;
  //   }
  //   this.noEnvmsg = '';
  //   this.envelopeList = [];
  //   if (this.searchstring != '' || this.searchstring == undefined || this.searchstring == null) {
  //     this.showLoader = true;
  //     this.envlope.getEnvolope({
  //       'operate': 'searchenv',
  //       "keyword": this.searchstring
  //     }).subscribe((data: any) => {
  //       if (data.resultKey === 1) {


  //         this.showLoader = false;
  //         this.envelopeList = data.resultValue;
  //         this.noEnvmsg = this.envelopeList.length > 0 ? '' : 'No Envolope Found!'

  //       } else {
  //         this.showLoader = false;
  //         this.bindEnvelope();
  //         this.noEnvmsg = '';
  //       }
  //     })
  //   } else {
  //     this.envelopeList = [];
  //     this.showLoader = true;
  //     this.bindEnvelope();
  //   }



  // }


  edit(id) {
    this.isedit = true;

    this.envelope.getEnvolope({
      'operate': 'edit',
      'id': this.onColclickid

    }).subscribe((res: any) => {
      if (res.resultKey === 1) {

        this.form.id = res.resultValue[0].id;
        this.form.envname = res.resultValue[0].name;
        this.open();

      } else {

      }

    })


  }

  checkEmptyEnvolope() {


    if (this.searchstring == '' || this.searchstring == undefined || this.searchstring == null) {
      this.envelopeList = []
      this.noEnvmsg = '';
      this.bindEnvelope();
    }
  }


  getAllTemplate() {

    this.template.getAllTemplate({
      operate: 'get'
    }).subscribe((data: any) => {
      ;
      if (data.resultKey == 1) {

        this.createTemplateData(data.resultValue);

        // this.templateList = data.resultValue;
      }
    });
  }


  createTemplateData(data) {

    this.templateList = data;
    this.temptemplateList = data;
    console.log(this.documentsDeatilList);

    let flag = this.templateList.filter((a) => {
      let flag1 = this.documentsDeatilList.filter((b) => {
        if (a.id == b.id) {
          return a.checked = true;
        }
      })
    })
  }

  urlHandle(srcurl) {

    return (srcurl == '' || srcurl != null || srcurl != undefined) ? (this.filePath + 'template/thumbnail/' + srcurl.split('/')[1].replace('.pdf', '.jpeg')) : null;

  }

  addTemplate() {
    let data = this.makeTemplateDate(this.templateList);

    console.log(this.templateList);
    this.envelope.SaveEnvolope({
      "id": this.onColclickid,
      "operate": "addtemplates",
      "comapnyid": this.global.getCompany(),
      "data": data

    }).subscribe((res: any) => {
      if (res.resultKey == 1) {

        this.message.show('Success', 'Saved successfully', 'success', this.translate);

        this.bindDocuments(res.resultValue.msg);

        this.closeModal1();



      } else if (res.resultValue.errorcode != '') {
        this.message.show('error', res.resultValue.msg, 'error', this.translate);
      }
      else {
        this.message.show('error', res.resultValue.msg, 'error', this.translate);
      }
    })
  }

  makeTemplateDate(templateList) {
    //     let newArray = [];
    //     let idArray = [];
    //     let finalArray = [];
    //     templateList.forEach(element => {
    //       if(element.checked==true){
    //       idArray.push(element);
    //     }
    //     });



    //     newArray = this.temptemplateList;
    // let tempNewArray=[];
    // tempNewArray= idArray;

    //     for (let index = 0; index < newArray.length; index++) {
    //       const element = newArray[index];
    //       idArray.forEach(element1 => {
    //         if (element.id != element1.id && element.checked==true){
    //           finalArray.push(element);
    //       }
    //       });
    //     }

    //     // templateList.forEach(element => {
    //     //   newArray.push(element);
    //     // });


    //     // tempNewArray.forEach(element => {
    //     //   if (element.checked == true) {
    //     //     finalArray.push(element.id);
    //     //   }
    //     // });




    let finalArray = [];
    templateList.forEach(element => {
      if (element.checked == true) {
        finalArray.push(element.id);
      }
    });
    return finalArray;
  }

  editTemplate(item) {
    this.router.navigate(['/documents/templates/' + item.id + '/edit']);

    // http://localhost:4200/#/documents/templates/7305267e-edae-11ea-8aa5-029cd58f3b70/recipient
  }
}
