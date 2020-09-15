import { Injectable, VERSION } from '@angular/core';
import { UserModel } from '../intefaces/userModel';
import { ConfigModel } from '../intefaces/configModel';
//import * as apiconfig from 'assets/appconfig.json';
import { EnvData } from '../intefaces/env';
import * as packageg from '../../../package.json';
import { BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import * as moment from 'moment'


// import * as apiconfiglocal from 'assets/appconfig.json';
// import * as apiconfigprod from 'assets/appconfig-prod.json';
// import { environment } from '../../../environments/environment';
// let apiconfig: any = {};
// if (environment.production) {
//     apiconfig = apiconfigprod;
// } else {
//     apiconfig = apiconfiglocal;
// }

export interface DomainEnv {
    doc_path?: any,
    cloudinary_url?: any
}

@Injectable({
    providedIn: 'root'
})
export class GlobalService {


    public btnStyleSource: any = {
        icononly: 0,
        textonly: 1,
        both: 2
    }

    confirmBox = {
        closable: true
    };

    public selectedCompany: any = {};
    private _envupdated: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public btnStyle = 0;
    user: any = {};
    backUrl: any = '';
    companyDispData: any = 0;
    loader: Boolean = false;
    loadertext: String = 'LOADING';
    env: any = {};
    currentMenu = '';
    currentActions: any = [];
    isFavReload = true;
    uploadMaxFilesize = 0;
    isSaveFilter: Boolean = false; //10719

    shortCuts: any = {
        add: ['meta+shift+a', 'ctrl+n']
    }
    _version: any = '-.-.-';
    gridFilterData: any = []; //10719
    gridControlName: any = null; //10719
    domainenv: DomainEnv;
    cmplogo: any = (this.getCompanyLogo() != '') ? this.getDomainEnvData().cloudinary_url + "cmp" + this.getCompany() + "/" + this.getCompanyLogo() : this.defaultLogo();

    changeLoaderText(msg) {
        if (msg == '') {
            this.loadertext = 'Loading';
        } else {
            this.loadertext = msg;
        }
    }

    showLoader() {
        this.loader = true;
    }

    hideLoader() {
        this.loadertext = 'Loading';
        this.loader = false;
    }

    defaultEnv: EnvData = {
        dateformat: 'dd-mm-yyyy',
        decimal: '1',
        defaultCur: 1
    };
    private config: ConfigModel;

    constructor(private modalService: BsModalService) {

        this.reloadConfig();
    }


    public reloadConfig() {
        this.config = environment as any;
        this.config.upload_folder = this.config.api_root + '/' + this.config.upload_folder;
        // this.config.directUpload = this.config.api_root + '/company(' + this.getUser().cmp + ')/' + this.config.directUpload;
        this.getEnvData();
        this.setFileConfig(2097152);
        this.getCompanyInfo();
    }

    public showPopup(popupContainer, props?: any) {
        return this.modalService.show(popupContainer, { ignoreBackdropClick: true, animated: false, ...props });
    }

    public setFileConfig(value) {
        this.uploadMaxFilesize = value;
    }
    public getFileConfig() {
        return this.uploadMaxFilesize;
    }

    public setCurrentMenu(value) {
        this.currentMenu = value;
    }

    public getCurrentMenu() {
        return this.currentMenu;
    }
    public setMenuActions(value) {
        this.currentActions = value.split(',');
    }
    public getMenuActions() {
        return this.currentActions;
    }
    public isMenuAccess(menuid) {
        if (this.currentActions && this.currentActions.length > 0) {
            if (this.currentActions.find((b) => {
                return b === menuid;
            })) {
                return true;
            }
        }
        return false;
    }


    public getConfig(): ConfigModel {
        return this.config;
    }
    public getVersion(): any {
        //  return packageg.default.version;
    }
    public setVersion(version: any): any {
        return this._version = version;
    }

    public getUser(): UserModel {

        const _us = localStorage.getItem('user');
        if (_us != null) {
            this.user = JSON.parse(_us);
        } else {
            this.user = {};
        }
        return this.user;
    }


    public getBackURL() {

        return this.backUrl;
    }

    public setBackurl(url) {
        this.backUrl = url;
    }


    public setUser(value: UserModel) {
        this.user = value;
        localStorage.setItem('user', JSON.stringify(value));
    }
   public removeUser() {
    localStorage.removeItem('user');
    }

    public setEnvData(value: EnvData) {
        this.env = value;
        localStorage.setItem('env', JSON.stringify(value));
    }
    public getEnvData(): EnvData {
        const _env = localStorage.getItem('env');
        if (_env !== 'undefined') {
            this.env = JSON.parse(_env);
        } else {
            this.env = null;
        }
        return this.env === null ? this.defaultEnv : this.env;
    }




    public clearUser() {
        this.user = {};
        //if (localStorage.getItem('mainUser')) {
        localStorage.removeItem('mainUser');
        localStorage.removeItem('dispid');
        localStorage.removeItem('masterdata');
        localStorage.removeItem('domainenv');
        localStorage.removeItem('user');
        localStorage.removeItem('compid');

        //}
        //localStorage.setItem('user', JSON.stringify({}));
    }

    public getLang(): any {
        return (localStorage.getItem('lang')) || 'en';
    }
    public formatDate(date: any) {
        if (date === '' || date === null) {
            //return '';// 22-01-2019
            return null;
        }
        const year = date.getFullYear();
        let month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        let day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        return year + '-' + month + '-' + day;

    }

    public make_datepicker_format() {
        let format = this.getEnvData().dateformat;
        switch (format) {
            case 'dd-MM-yyyy': return 'dd-mm-yy';
                break;
            case 'MM-dd-yyyy': return 'mm-dd-yy';
                break; 0
            case 'yyyy-MM-dd': return 'yy-mm-dd';
                break;
            default: return 'dd-mm-yyyy';
                break;
        }
    }

    public makeDate(inpDate) {
        return moment(inpDate).toDate();
    }

    /**
     * 
     * @param item 
     * 
     * This method will be used for default option selection for usertype 3,4.
     * BOA selection
     */
    public defaultSelection(item) {
        return new Promise((resolve, reject) => {
            if (item.length == 1) {
                resolve(item[0]);
            }
            else {
                reject();
            }
        });
    }

    public replaceString(inputString, replaceTo = '') {
        let result = "";
        if (inputString != null && inputString != '') {
            result = inputString.replace(/(\r\n|\n|\r|\s|\t)/gm, replaceTo);
            return result.replace(/(\')/gm, "");
        }
        return inputString;
    }


    //10719
    public setSaveGridFilter(data, flag, gridControlName) {
        this.gridFilterData = data;
        this.isSaveFilter = flag;
        this.gridControlName = gridControlName
    }

    public getSaveGridFilter() {
        return [this.gridFilterData, this.isSaveFilter];
    }

    public getGridControlName() {
        return this.gridControlName;
    }

    public formatDecimal(value, decimals) {
        return parseFloat(value).toFixed(decimals);
    }


    openPopWindow(url, height = undefined, width = undefined) {
        var left = (screen.width / 2) - ((width || 700) / 2);
        var top = (screen.height / 2) - ((height || 600) / 2);
        // window.open('https://sites.google.com/ideas2tech.com/barsrevisionhistory/home', 'winname', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,height=' + (screen.height - 200) + ',width=700, top=' + top + ', left=' + left);
        window.open(url, 'winname', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,height=' + (screen.height - 200) + ',width=700, top=' + top + ', left=' + left);
    }

    public setDisp(id) {
        localStorage.setItem('dispid', id);
    }

    public getDisp(): string {
        const _us = localStorage.getItem('dispid');
        if (_us != null) {
            return _us;
        } else {
            return '';
        }
    }

    public setCompany(comp) {
        if (comp.id == 'sys') {
            comp.id = '0';
        }
        this.selectedCompany = comp;
        localStorage.setItem('compid', JSON.stringify(comp));
    }

    public getCompany(original?: boolean) {
        const _us1 = localStorage.getItem('compid');
        let _us: any = {};
        if (_us1 != null) {
            try {
                _us = JSON.parse(_us1);
            } catch (error) {

            }
        }

        if (original) {
            if (_us.id) {
                return _us.id;
            }
            return "0";
        }

        if (_us.id) {
            return (_us.id == "0" ? 'sys' : _us.id);
        } else {
            return 'sys';
        }
    }

    public getCompanyLogo() {
        const _us1 = localStorage.getItem('compid');
        let _us: any = {};
        let logo = this.defaultLogo();
        if (_us1 != null) {
            _us = JSON.parse(_us1);
            logo = _us.logo;
        }
        return logo;
    }

    public defaultLogo() {
        return './assets/img/default.png';
    }

    public getCompanyInfo() {
        const _us1 = localStorage.getItem('compid');
        let _us: any = {};
        if (_us1 != null) {
            try {
                _us = JSON.parse(_us1);
            } catch (error) {

            }
        }
        this.selectedCompany = _us;
        return _us;
    }

    public validate(value, type) {
        let result: any;
        if (type == 'integer') {
            result = (value == "") ? 0 : value;
        }
        else if (type == 'decimal') {
            result = (value == "") ? 0 : parseFloat(value);
        }
        else if (type == 'array') {
            result = (value == "") ? [] : value;
        }
        else if (type == 'date') {
            result = (value == "" || value == null) ? null : new Date(value);
        }
        return result;
    }

    public setDispORCompIdDDL(data) {
        localStorage.removeItem('masterdata');
        localStorage.setItem('masterdata', JSON.stringify(data));
    }
    public getDispORCompIdDDL() {
        let _us = localStorage.getItem('masterdata');
        if (_us != null) {
            this.companyDispData = JSON.parse(_us);
        } else {
            this.companyDispData = null;
        }
        return this.companyDispData;
    }

    public makeJSON(str) {
        if (str == null || str == '{}') {
            return [];
        }
        let a = str.replace('{', '');
        a = a.replace('}', '');
        a = a.split(",");
        return a;
    }

    public setDefault(value, setTo) {
        if (value == null) {
            return setTo;
        }
        else if (value == "") {
            return setTo;
        }
        else {
            return value;
        }
    }

    public formatTime(date: any) {

        if (!(date instanceof Object)) {
            return date;
        }
        if (date === '' || date === null) {
            //return '';// 22-01-2019
            return null;
        }
        return moment(date).format('HH:mm')
        // let hour = new Date(date).getHours().toString();
        // hour = hour.length > 1 ? hour : '00';
        // let minutes = new Date(date).getMinutes().toString();
        // minutes = minutes.length > 1 ? minutes : '00';
        // return hour + ':' + minutes;

    }

    public setDomainEnvData(value: DomainEnv) {
        this.domainenv = value;
        sessionStorage.setItem('domainenv', JSON.stringify(value));
    }
    public getDomainEnvData(): DomainEnv {
        const _env = sessionStorage.getItem('domainenv');
        let domainenvs = null;
        if (_env !== 'undefined') {
            domainenvs = JSON.parse(_env);
        } else {
            domainenvs = null;
        }
        this.domainenv = domainenvs === null ? { cloudinary_url: '', doc_path: '' } : domainenvs;

        environment.document_path = this.domainenv.doc_path || '';
        environment.cloudinary_url = this.domainenv.cloudinary_url || '';

        return this.domainenv;
    }

    defaultDomainEnv: DomainEnv = {
        cloudinary_url: '',
        doc_path: ''
    };

    public getSelectedDispensaryData() {
        let data = this.getDispORCompIdDDL();
        if (data != null) {
            let found = data.find((a) => {
                return a.id == this.getDisp();
            });
            return found;
        }
        return undefined;
    }

    public imgParentPath() {
        return this.cmplogo;
    }

    envUpdated_subscribe(): Observable<any> {
        return this._envupdated.asObservable();
    }

    public envUpdated() {

        this._envupdated.next(true);
    }


}
