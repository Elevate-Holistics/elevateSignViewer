import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import * as $ from 'jquery';
import { Table } from 'primeng/table';
import { SalesrecipesService } from '../../../service/salesrecipes.service';
@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css']
})
export class IngredientsComponent implements OnInit {
  ingredientsCols: any[];
  ingredientreuired: boolean = false;
  ingrdientrequiredmsg: any;
  filterItem: any[];
  ingedit: boolean = false;
  selectedIng: object;
  ingeditindex: any;
  selectedIngItem: any = [];
  itemUnitLst: any[];
  selectedItemUnit: string;
  ingunitdisable: boolean = true;
  ingredient: any = { itemid: '', description: '', quantity: '', unitid: '', unitname: '' };
  ingredientsdata: any = [];
  ingredientsfieldarray: any[];
  invenalldb: boolean = true;

  @Input() itemsearchinp: any;
  @Input() sp_flag: any;
  // @Input() ingrdeientsvalidation: any;
  @Input() ingredientdata: any;
  @Output() onAction = new EventEmitter<any>();

  constructor(
    private salesrecipesService: SalesrecipesService
  ) { }

  ngOnInit(): void {
    this.ingredientsdata = this.ingredientdata;
    // if (this.ingrdeientsvalidation) {
    //   this.ingredientreuired = this.ingrdeientsvalidation.ingredientreuired;
    //   this.ingrdientrequiredmsg = this.ingrdeientsvalidation.ingrdientrequiredmsg;
    // }
    // console.log(this.itemsearchinp);
    this.ingredientsCols = [
      // { field: 'blacklist', header: 'Blacklist', jstyle: '10%' },
      { field: 'action', header: 'Action', jstyle: '48px', textjson: 'center' },
      { field: 'name', header: 'Name', jstyle: '120px', textjson: 'left' },
      { field: 'quantity', header: 'Quantity', jstyle: '43px', textjson: 'right' },
      { field: 'unit', header: 'Unit', jstyle: '43px', textjson: 'left' },
    ];

    this.ingredientsfieldarray = JSON.parse(JSON.stringify(this.ingredientsCols));
  }

  funAddIngredient(ingr) {
    ingr.itemid = this.selectedIngItem.id;
    ingr.description = this.selectedIngItem.description;
    if (this.selectedItemUnit) {
      ingr.unitid = this.selectedItemUnit;
      let unitdata = this.itemUnitLst.filter(a => a.id == this.selectedItemUnit);
      ingr.unitname = unitdata[0].shortdescription;
    }

    if (ingr.description == "" || ingr.description == undefined) {
      this.ingredientreuired = true;
      this.ingrdientrequiredmsg = "Please Enter Name";
      $("#ingname").focus();
    } else if (ingr.quantity == "") {
      this.ingredientreuired = true;
      this.ingrdientrequiredmsg = "Please Enter Quantity";

      $("#ingqty").focus();
    } else if (ingr.unitid == "") {
      this.ingredientreuired = true;
      this.ingrdientrequiredmsg = "Please Select Unit";
      $("#ingunit").focus();
    } else {
      this.ingredientreuired = false;
      this.ingrdientrequiredmsg = "";
      this.ingredientsdata.unshift(ingr);
      this.ingredient = { itemid: '', description: '', quantity: '', unitid: '', unitname: '' };
      // this.selectedItem = [];
      this.filterItem = [];
      // this.itemlist = [];
      this.selectedIng = {};
      this.selectedIngItem = [];
      // this.itemUnitLst = [];
      this.selectedItemUnit = "";
      this.ingunitdisable = true;
      this.onAction.emit(this.ingredientsdata);
    }

    //console.log(this.ingredients);
  }

  funUpdateIng(ingr) {
    if (this.selectedIngItem.description == "" || this.selectedIngItem.description == undefined) {
      this.ingredientreuired = true;
      this.ingrdientrequiredmsg = "Please Enter Name";
      $("#ingname").focus();
    } else if (this.ingredient.quantity == "") {
      this.ingredientreuired = true;
      this.ingrdientrequiredmsg = "Please Enter Quantity";

      $("#ingqty").focus();
    } else if (this.selectedItemUnit == "" || this.selectedItemUnit == undefined) {
      this.ingredientreuired = true;
      this.ingrdientrequiredmsg = "Please Select Unit";
      $("#ingunit").focus();
    } else {
      let unitdata = this.itemUnitLst.filter(a => a.id == this.selectedItemUnit);
      let unitname = unitdata[0].shortdescription;
      this.ingredientsdata[this.ingeditindex].itemid = this.selectedIngItem.id;
      this.ingredientsdata[this.ingeditindex].description = this.selectedIngItem.description;
      this.ingredientsdata[this.ingeditindex].quantity = this.ingredient.quantity;
      this.ingredientsdata[this.ingeditindex].unitid = this.selectedItemUnit;
      this.ingredientsdata[this.ingeditindex].unitname = unitname;
      this.filterItem = [];
      // this.itemlist = [];
      this.selectedIng = {};
      this.selectedIngItem = [];
      this.ingredient.quantity = "";
      this.ingredient.unit = "";
      this.ingedit = false;
      this.selectedItemUnit = "";
      this.ingunitdisable = true;
      this.ingredientreuired = false;
      this.ingrdientrequiredmsg = "";

    }
    // this.ingredientsdata[this.ingeditindex].ite = ingr;
  }

  onSelectItem(event: any) {
    this.selectedIngItem = event;
    this.funGetItemUnit(event.id, "");
  }
  funGetItemUnit(itemid, itemunitid) {
    this.salesrecipesService.getItemUnitByItemId({ "itemid": itemid }).subscribe((data: any[]) => {
      this.itemUnitLst = data;
      this.ingunitdisable = false;
      // this.itemdtl["lstitemsize"] = data;
      if (itemunitid == "") {
        this.selectedItemUnit = this.itemUnitLst.length == 0 ? null : this.itemUnitLst[0].id;
      } else {
        this.selectedItemUnit = itemunitid;
      }
    });
  }

  funEditIngredient(ingr, i) {
    this.selectedIngItem.id = ingr.itemid;
    this.selectedIngItem.description = ingr.description;
    this.ingredient.itemid = ingr.itemid
    this.ingredient.description = ingr.description;
    this.ingredient.quantity = ingr.quantity;
    this.ingredient.unitid = ingr.unitid;
    this.ingredient.unitname = ingr.unitname;
    this.ingedit = true;
    this.ingeditindex = i;
    this.selectedIng = { id: ingr.itemid, description: ingr.description };
    this.ingunitdisable = true;
    this.funGetItemUnit(ingr.itemid, ingr.unitid);
  }

  funFilterItem(event) {
    let query = event.query;
    this.salesrecipesService.searchItemByName({ "itemname": event.query, 'sp_flag': this.sp_flag }).subscribe((data: any[]) => {
      // this.itemlist[index].itemLst = data;
      this.filterItem = data;
    });
    // this.countryService.getCountries().then(countries => {
    //   this.filterItem = this.filterCountry(query, countries);
    // });
  }

  removeingredient(ingr, i) {
    this.ingredientsdata.splice(i, 1);
    console.log(this.ingredientsdata);
  }


}
