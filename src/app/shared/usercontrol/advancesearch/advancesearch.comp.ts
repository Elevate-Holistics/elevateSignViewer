import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { GlobalService } from '../../../service/global.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AdvancesearchService } from "../../../service/advancesearch.service";
import { ToastService } from '../../../service/toast-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-advancesearch',
    templateUrl: './advancesearch.comp.html',
    styleUrls: ['advancesearch.comp.scss']
})
export class AdvanceSearchComponent implements OnInit, OnDestroy {
    @Output() onAdvanceSearch: EventEmitter<any> = new EventEmitter();
    @Input('controlName') controlName: String = '';
    @ViewChild('template') template;
    @Input('cols') cols: any = [];
    modalRef: BsModalRef;

    constructor(private global: GlobalService, private modalService: BsModalService, private filterService: AdvancesearchService, private message: ToastService, private translate: TranslateService) {
        translate.use(global.getLang());
    }

    signs: any = [];
    signsData: any = [];
    filterData: any = [];
    filterForm: any = { column: '', sign: '', inputValue: '', condition: 'AND', column_label: '' };
    inputList: any = [];
    ddlFlag: boolean = false;
    datpickerFlag: boolean = false;
    inputFlag: boolean = true;
    autocompleteFlag: boolean = false;
    submitFlag: boolean = false;
    data: any = {};
    onModelShow = null;
    searchList: any = [];
    dbTableData: any = { id: 0, filterName: '', active: true, isdelete: false, module: this.controlName };
    ddlSearches: any = '';
    isFilterOn = false;

    /** For Editing Data */
    isEdited = false;
    editIndex = -1;
    /** end */

    ngOnInit(): void {
        //  this.bindSavedSearch();
        this.signs = [
            { field: '=', header: 'Is equal to (=)' },
            { field: '<>', header: 'Is Not equal to (<>)' },
            { field: '>', header: 'Is greater than (>)' },
            { field: '>=', header: 'Is greater than and equal to (>=)' },
            { field: '<', header: 'Is less than (<)' },
            { field: '<=', header: 'Is less than and equal to (<=)' },
            { field: 'LIKE', header: 'Contains' }];

        this.onModelShow = this.modalService.onShown.subscribe((evt) => {
            setTimeout(() => {
                //$('#Columnname').focus();
                // $('.modal-dialog').draggable({
                //       handle: ".modal-header"
                // });
                this.assignDefaultSelectedColumn();

            }, 500);

        });
    }
    assignDefaultSelectedColumn(): any {
        let a = undefined;
        a = this.cols.find((a) => {
            return a.searchSelected === 1;
        });
        if (a !== undefined) {
            this.filterForm.inputValue = '';
            this.filterForm.column = a.column_name;
            this.bindValueInput(a);
            this.filterForm.sign = 'LIKE';
        }
    }

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.

    }

    onBindValueInput(columnName) {
        try {
            let selectedColumn: any = undefined;
            selectedColumn = this.cols.find((a) => {
                return a.column_name === columnName;
            });
            if (selectedColumn != undefined) {
                this.bindValueInput(selectedColumn);
            } else {
                throw ('Column data not found');
            }
        } catch (error) {
            this.message.show('error', error, 'error', this.translate);
        }
    }


    bindValueInput(selectedColumn) {
        this.submitFlag = true;
        this.clearFlags();

        // this.data = this.cols.find((a) => {
        //     return a.column_name === event;
        // });
        this.data = selectedColumn;

        const ALDL = this.data.extra.allow || this.data.extra.disallow;

        if (ALDL) {
            this.showSign(ALDL, (this.data.extra.allow ? true : false));
        }


        this.filterForm.column_label = this.data.column_label;
        if (this.data.datatype === 'ddl') {
            this.ddlFlag = true;
            this.filterService.getDatasource({ 'datasource': this.data.extra.datasource }).subscribe((res: any) => {
                if (res.resultKey === 1) {
                    this.inputList = res.resultValue;
                }
            });
        }
        else if (this.data.datatype === 'input') {
            this.inputFlag = true;
        }
        else if (this.data.datatype === 'datepicker') {
            this.datpickerFlag = true;
        }
        else if (this.data.datatype === 'autocomplete') {
            this.autocompleteFlag = true;
        }
    }

    private showSign(signdata, allow) {
        for (let i = 0; i < this.signs.length; i++) {
            const el = this.signs[i];
            if (allow) {
                if (signdata.indexOf(el.field) > -1) {
                    this.signsData.push(el)
                }
            } else {
                if (signdata.indexOf(el.field) == -1) {
                    this.signsData.push(el)
                }
            }


        }

    }

    autocomplete(event) {
        this.filterService.getDatasource({ 'datasource': this.data.extra.datasource, 'keyword': event.query }).subscribe((res: any) => {
            if (res.resultKey === 1) {
                this.inputList = res.resultValue;
            }
        });
    }

    /**
   * 
   * @param content 
   * For open popup modal
   */
    openModal(content: string) {
        this.submitFlag = true;
        this.modalRef = this.modalService.show(content, {
            class: 'modal-lg'
        });
    }

    showModal() {
        $('#btnsearch').click();
    }
    // showModal() {
    //     $('#btnsearch').click();
    // }

    /**
     * For closing popup
     */
    closeModal() {
        if (this.modalRef !== undefined) {
            this.modalRef.hide();
        }
    }

    ngOnDestroy(): void {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this.onModelShow.unsubscribe();
    }

    addFilter() {
        if (this.data.datatype === 'datepicker') {
            this.filterForm.inputValue = this.global.formatDate(new Date(this.filterForm.inputValue));
        }
        // if (this.data.datatype === 'ddl') {
        //     this.filterForm.inputText = $('#type option:selected').text().trim();
        // }
        if (this.isEdited && this.editIndex > -1) {
            this.filterData[this.editIndex] = this.filterForm;
        }
        else {
            this.filterData.push(this.filterForm);
        }
        this.clear();
        this.submitFlag = false;
        this.isEdited = false;
    }

    clear() {
        this.filterForm = { column: '', sign: '', inputValue: '', condition: 'AND', column_label: '' };
        this.isEdited = false;
        this.editIndex = -1;
        this.isFilterOn = false;
    }

    search() {
        let arr = {};
        if (this.filterData.length > 0) {
            arr = this.format_filter_data();
        }
        else {
            this.addFilter();
            arr = this.format_filter_data();
        }
        this.onAdvanceSearch.emit(arr);
        this.isFilterOn = true;
    }
    format_filter_data(): any {
        if (this.filterData.length > 0) {
            let data = JSON.parse(JSON.stringify(this.filterData));
            const a = data[data.length - 1];
            a.condition = '';
            return data;
        }
    }

    getName(event) {
        this.filterForm.inputValue = event.value;
        this.filterForm.inputText = event.name;
    }

    clearFlags() {
        this.signsData = [];
        this.ddlFlag = false;
        this.datpickerFlag = false;
        this.inputFlag = false;
        this.autocompleteFlag = false;
    }

    removeFilter(index) {
        this.filterData.splice(index, 1);
    }

    savefilter() {
        try {
            this.filterService.create({
                'id': this.dbTableData.id,
                // 'createdby': this.global.getUser().id,
                'filterData': this.filterData,
                'module': this.controlName,
                'filterName': this.dbTableData.filterName,
                'active': this.dbTableData.active,
                'isdelete': this.dbTableData.isdelete
            }).subscribe((res: any) => {
                if (res.resultKey === 1) {
                    if (this.dbTableData.id === 0) {
                        this.searchList.push({
                            'id': res.resultValue,
                            'filterName': this.dbTableData.filterName
                        });
                    }
                    this.message.showTranslate('done', 'saved_success', 'success', this.translate);
                }
                else if (res.resultKey === 0) {
                    this.message.show('error', res.defaultError, 'error', this.translate)
                }
            });
        } catch (error) {
            this.message.showTranslate('error', error, 'error', this.translate);
        }
    }

    bindSavedSearch() {
        this.filterService.getSavedSearch({
            // 'userid': this.global.getUser().id,
            'module': this.controlName,
            'type': 'ddl'
        }).subscribe((res: any) => {
            if (res.resultKey === 1) {
                this.searchList = res.resultValue;
            }
        });
    }

    selectSavedSearch(event, iscall) {
        const id = event.target.value;
        this.filterService.getSavedSearch({
            // 'userid': this.global.getUser().id,
            'module': this.controlName,
            'type': 'id',
            'id': id
        }).subscribe((res: any) => {
            if (res.resultKey === 1) {
                const selectedSearch = res.resultValue;
                this.dbTableData.id = selectedSearch.id;
                this.dbTableData.filterName = selectedSearch.filterName;
                this.dbTableData.active = selectedSearch.active;
                this.dbTableData.isdelete = selectedSearch.isdelete;
                this.dbTableData.module = selectedSearch.module;
                this.filterData = JSON.parse(selectedSearch.filterData);
                if (iscall) {
                    this.search();
                }
            }
        });
        //$("#Columnname").focus();
    }

    onStoredSearch(event) {
        this.selectSavedSearch(event, true);
    }

    clearfilter() {
        this.filterData = [];
        this.ddlSearches = '';
        this.dbTableData = { id: 0, filterName: '', active: true, isdelete: false, module: this.controlName };
        /** clear form */
        this.clear();
        this.onAdvanceSearch.emit([]);
    }

    editFilter(index) {
        try {
            this.isEdited = true;
            this.editIndex = index;
            const selectedData = this.filterData[index];
            let selectedColumn: any = undefined;
            selectedColumn = this.cols.find((a) => {
                return a.column_name === selectedData.column;
            });
            if (selectedColumn != undefined) {
                this.bindValueInput(selectedColumn);
                this.filterForm.column = selectedData.column;
                this.filterForm.sign = selectedData.sign;
                if (selectedColumn.datatype == 'datepicker') {
                    this.filterForm.inputValue = new Date(selectedData.inputValue);
                }
                else {
                    this.filterForm.inputValue = selectedData.inputValue;
                }
                this.filterForm.condition = selectedData.condition;
                this.filterForm.column_label = selectedData.column_label;
                this.filterForm.inputText = selectedData.inputText;
                this.filterForm.inputValueauto = selectedData.inputValueauto;
            }
            else {
                throw ('Column data not found');
            }
        } catch (error) {
            this.message.show('error', error, 'error', this.translate);
        }
    }
}
