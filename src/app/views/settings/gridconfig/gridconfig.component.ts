import { Component, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from "../../../service/settings.service";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { GlobalService } from '../../../service/global.service';
import { AdvancesearchService } from '../../../service/advancesearch.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ToastService } from '../../../service/toast-service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-gridconfig',
  templateUrl: './gridconfig.component.html',
  styleUrls: ['./gridconfig.component.css']
})
export class GridconfigComponent implements OnInit {
  @ViewChild('moduleTemplate') moduleTemplate;
  modalRef: BsModalRef;
  restvalues: any = {};
  constructor(private settingservice: SettingsService, private modalService: BsModalService, private global: GlobalService, private advanceSearchService: AdvancesearchService, private message: ToastService, private translate: TranslateService,) { }
  moduleList: any = [];
  moduleName: any = '';
  buttons: any = [];
  columnData: any = { columnName: '', active: true };
  moduleTitle: any = '';
  moduleExist: boolean = false;
  rawSignArr: any = '';
  isFromGrid: boolean = true;
  newEntryFlag = false;
  sortArray: any = [];
  extraData: any = { allowType: 'allow', datasource: '', search: '', sort: [1, 'ASC'], case: '' };
  signArray = [
    { 'name': 'equal', 'sign': '=', 'checked': false },
    { 'name': 'notequal', 'sign': '<>', 'checked': false },
    { 'name': 'less', 'sign': '<', 'checked': false },
    { 'name': 'greater', 'sign': '>', 'checked': false },
    { 'name': 'lessequal', 'sign': '<=', 'checked': false },
    { 'name': 'greaterequal', 'sign': '>=', 'checked': false },
    { 'name': 'contain', 'sign': 'LIKE', 'checked': false }
  ];
  selectedColumn: any = {
    id: -1,
    column_name: '',
    label: '',
    datatype: 'input',
    column_order: 1,
    module: '',
    extra: undefined,
    column_type: 1,
    stylejson: undefined,
    isfilter: 0,
    issort: 0,
    defaultselected: 0,
    searchSelected: 0,
    fixedselected: 0,
    hidden: 0,
    isactive: 1,
    usercreated: this.global.getUser().id
  };
  moduleData: any = [];
  ngOnInit(): void {
    this.restvalues = JSON.stringify(this.selectedColumn);
    this.rawSignArr = JSON.stringify(this.signArray);
    this.buttons = [
      {
        'id': 'add', 'color': 'white', 'bg': 'info', 'text': 'Add', 'icon': 'plus', 'shortcut': 'ctrl+shift+a'
      },
      {
        'id': 'save', 'color': 'white', 'bg': 'success', 'access': true, 'text': 'Save', 'iconi': 'fa fa-save',
        'shortcut': 'ctrl+s', 'disabled': false
      }
    ];
    this.bindModules();
  }


  buttonClicks(type) {
    switch (type) {
      case 'save': this.save();
        break;
      case 'add': this.openModal(this.moduleTemplate);
        break;
      default: ''
    }
  }

  openModal(content: string) {
    this.modalRef = this.modalService.show(content, {
      backdrop: 'static',
      keyboard: false
    });
  }
  bindModules() {


    this.settingservice.getGridconfig({
      'type': 'allmodules'
    }).subscribe((res: any) => {
      if (res.resultKey == 1) {
        this.moduleList = res.resultValue;
      }
    }, (error) => {

    });

  }


  checkModule() {
    let flag = this.moduleList.find((a) => {
      let b = a.module.toLowerCase();
      let c = this.moduleTitle.toLowerCase();
      return b.replace("'", "`") === c.replace("'", "`");

    });
    if (flag != undefined) {
      this.moduleExist = true;
    }
    else {
      this.moduleExist = false;
    }
  }

  closeModal() {
    this.modalRef.hide();
  }
  save() {
    this.setSortToMain();
    console.log(this.moduleData);
    const data = JSON.parse(JSON.stringify(this.moduleData));

    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      element.column_order = index + 1;
      element.isfilter = (element.isfilter) ? 1 : 0; // New code
      element.issort = (element.issort) ? 1 : 0; // New code
      element.hidden = (element.hidden) ? 1 : 0; // New code
      element.fixedselected = (element.fixedselected) ? 1 : 0; // New code

      element.defaultselected = (element.defaultselected) ? 1 : 0; // New code

      if (element.extra && element.extra.trim() != '' && this.IsJsonString(element.extra)) {
        element.extra = JSON.parse(element.extra);
      } else {

        element.extra = undefined;
      }
      if (element.stylejson && element.stylejson.trim() != '' && this.IsJsonString(element.stylejson)) {
        element.stylejson = JSON.parse(element.stylejson);
      } else {

        element.stylejson = undefined;
      }
    }
    console.log("data", data);
    try {
      this.advanceSearchService.addAdvanceSearchData({ 'data': data, 'user_id': this.global.getUser().id }).subscribe((res: any) => {
        const d = res.resultValue;
        if (res.resultKey === 1) {
          if (d.status) {
            this.sortArray = [];
            this.message.show('Done', 'Saved Successfully', 'success', this.translate);
            this.getModuleData();
          }
          else {
            this.message.show('error', d.defaultError, 'error', 'Error');
          }
        }
        else {
          this.message.show('error', d.defaultError, 'error', 'Error');
        }
      }, (error) => {
        this.message.show('error', error, 'error', 'Error');
      })
    } catch (error) {
      this.message.show('error', error, 'error', 'Error');
    }
  }

  setSortToMain() {
    for (let i = 0; i < this.sortArray.length; i++) {
      const element = this.sortArray[i];

      const col = this.moduleData.find((a) => {
        return element.column_name === a.column_name
      })
      if (col) {
        if (this.IsJsonString(col.extra)) {
          const j = JSON.parse(col.extra);
          if (j.sort) {
            j.sort = [i + 1, element.sortType];
          }
          col.extra = JSON.stringify(j);
        }
      }
    }
  }
  getModuleData() {

    try {
      if (this.moduleName == '') {
        this.newEntryFlag = false;
        this.moduleData = [];
      }
      else {
        this.newEntryFlag = true;
        this.selectedColumn = this.getResetvalue();
        this.signArray = this.getRawSignvalue();
        this.advanceSearchService.show({
          'type': 'getModuleData',
          'name': this.moduleName
        }).subscribe((res: any) => {
          if (res.resultKey == 1) {
            this.moduleData = res.resultValue;
            this.newEntryFlag = true;
            this.setMainToSort();
          }
        }, (error) => {

        });
      }
    } catch (error) {

    }
  }
  setMainToSort() {
    this.sortArray = [];

    for (let i = 0; i < this.moduleData.length; i++) {
      const element = this.moduleData[i];
      if (this.IsJsonString(element.extra)) {
        const j = JSON.parse(element.extra);
        if (element.issort && j.sort) {
          this.sortArray.push({ label: element.label, column_name: element.column_name, sortType: j.sort[1], order: j.sort[0] });
        }

      }

    }

    // this.sortArray =  
    this.sortArray.sort(function (a, b) { return a.order - b.order })
  }


  IsJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  addNewColumn() {
    try {
      const found = this.moduleData.find((a) => {
        return a.label === this.columnData.columnName;
      });
      if (!found) {
        this.selectedColumn = this.getResetvalue();
        this.selectedColumn.id = 0;
        this.selectedColumn.label = this.columnData.columnName;
        this.selectedColumn.active = this.columnData.active;
        this.selectedColumn.module = this.moduleName;
        this.moduleData.push(this.selectedColumn);
        this.message.show('success', 'Column added successfully', 'success', this.translate);
        this.closeModal();
      }
      else {
        throw ('Column Name is already exist');
      }
    } catch (error) {
      this.message.show('error', error, 'error', this.translate);
    }
  }

  getResetvalue() {

    return JSON.parse(this.restvalues);
  }
  getRawSignvalue() {

    return JSON.parse(this.rawSignArr);
  }

  buildExtra() {
    const extra = {};
    let allarr = [];
    for (let index = 0; index < this.signArray.length; index++) {
      const element = this.signArray[index];
      if (element.checked) {
        allarr.push(element.sign);
      }
    }
    extra[this.extraData.allowType] = allarr;
    if (this.extraData.datasource) {
      extra['datasource'] = this.extraData.datasource;
    }
    if (this.extraData.search) {
      extra['search'] = this.extraData.search;
    }

    if (this.extraData.sort && this.selectedColumn.issort) {
      extra['sort'] = this.extraData.sort;

    }
    else {
      extra['sort'] = undefined;
    }

    if (this.extraData.case) {

      extra['case'] = this.extraData.case;

    }
    return JSON.stringify(extra);
  }

  oncheckchange(e) {
    this.selectedColumn.extra = this.buildExtra();
  }

  onchange(e) {
    this.selectedColumn.extra = this.buildExtra();
  }
  oncaseChange(e) {
    this.selectedColumn.extra = this.buildExtra();
  }

  addNewModule() {
    try {
      this.moduleList.push({ 'module': this.moduleTitle });
      this.moduleName = this.moduleTitle;
      this.message.show('success', 'Module added successfully', 'success', this.translate);
      this.closeModal();
      this.newEntryFlag = true;
    } catch (error) {

    }
  }

  onSortChange(event) {
    this.selectedColumn.extra = this.buildExtra();
    this.addToSort();
  }
  onSortOrderChange(event) {
    this.selectedColumn.extra = this.buildExtra();
    this.addToSort();
  }

  addToSort() {
    const selectedCol = this.sortArray.find((b) => {
      return b.column_name == this.selectedColumn.column_name;
    });

    if (this.extraData.sort && this.selectedColumn.issort) {
      if (selectedCol) {
        selectedCol.sortType = this.extraData.sort[1];
      }
      else {
        this.sortArray.push({ label: this.selectedColumn.label, column_name: this.selectedColumn.column_name, sortType: this.extraData.sort[1] });
      }

    }
    else {
      const sArray = this.sortArray.filter((a) => {
        return a.column_name != this.selectedColumn.column_name;
      });
      this.sortArray = sArray;
    }
  }

  onSortTypeChange(item) {
    const selectedItem = this.moduleData.find((b) => {
      return b.column_name == item.column_name;
    });
    if (selectedItem) {
      if (this.IsJsonString(selectedItem.extra)) {
        const j = JSON.parse(selectedItem.extra);
        if (j.sort) {
          j.sort[1] = item.sortType;
        }
        selectedItem.extra = JSON.stringify(j);
        if (this.selectedColumn && this.selectedColumn.column_name == selectedItem.column_name) {
          this.extraData.sort = j.sort;
        }
      }
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(event.previousContainer.data, event.container.data,
        event.previousIndex, event.currentIndex)
    } else {
      moveItemInArray(this.moduleData, event.previousIndex, event.currentIndex);
    }
  }


  sortDrop(event: CdkDragDrop<string[]>) {

    if (event.previousContainer !== event.container) {
      transferArrayItem(event.previousContainer.data, event.container.data,
        event.previousIndex, event.currentIndex)
    } else {
      moveItemInArray(this.sortArray, event.previousIndex, event.currentIndex);
    }

  }

  onColumnClick(item) {
    if (this.selectedColumn.id !== item.id) {
      this.selectedColumn = this.getResetvalue();
      this.signArray = this.getRawSignvalue();
      this.selectedColumn = item;
    } else {
      this.selectedColumn = this.getResetvalue();
      this.signArray = this.getRawSignvalue();
    }


    this.buttons.filter((a) => {
      if (a.id == 'save') {
        return a.disabled = false;
      }
    });

    if (this.selectedColumn.id != -1) {



      if (this.selectedColumn.extra && this.selectedColumn.extra.trim() != '' && this.IsJsonString(this.selectedColumn.extra)) {

        const extras = JSON.parse(this.selectedColumn.extra);

        if (extras.datasource) {
          this.extraData.datasource = extras.datasource;
        }
        if (extras.search) {
          this.extraData.search = extras.search;
        }
        if (extras.sort) {
          this.extraData.sort = extras.sort;
        }
        if (extras.case) {
          this.extraData.case = extras.case;
        } else {
          this.extraData.case = undefined
        }

        console.log(extras);
        if (extras.allow) {
          for (let k = 0; k < extras.allow.length; k++) {
            const element = extras.allow[k];
            const a = this.signArray.find((a) => {
              return element == a.sign;
            });
            if (a) {
              a.checked = true;
            }
          }
          this.extraData.allowType = 'allow';

        }
        if (extras.disallow) {
          for (let k = 0; k < extras.disallow.length; k++) {
            const element = extras.disallow[k];
            const a = this.signArray.find((a) => {
              return element == a.sign;
            });
            if (a) {
              a.checked = true;
            }
          }
          this.extraData.allowType = 'disallow';
        }
      }

    }

  }
  onBlurCheckExist(item) {
    const a = this.moduleData.find((b) => {
      return b.column_name === item.column_name;
    });
    if (a) {
      item.column_name = '';
      this.message.show('error', 'Column Field is already exist', 'error', this.translate);
    }
  }

  onSortColumnClick(item) {
    const col = this.moduleData.find((a) => {
      return a.column_name === item.column_name;
    });

    this.onColumnClick(col);
  }
}
