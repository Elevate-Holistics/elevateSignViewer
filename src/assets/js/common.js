util = {};
util.focus = function (elementid) {
  document.getElementById(elementid).focus();
}


const common = {};
common.menusForSearch = [];
common.menubind = function (list) {

  common.menusForSearch = [];
  var map = {},
    node, roots = [],
    i;
  for (i = 0; i < list.length; i += 1) {
    map[list[i].id] = i; // initialize the map
    // initialize the children
  }
  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (node.parentid !== 0) {
      if (list[map[node.parentid]] !== undefined) {
        // if you have dangling branches check that map[node.parentid] exists
        if (list[map[node.parentid]].children === undefined) {
          list[map[node.parentid]].children = []
        }
        list[map[node.parentid]].children.push(node);
        if (node.isclickable == 1) {
          var parent = list[map[node.parentid]];
          node.namex = (node.name || node.label) + ' < ' + (parent.name || parent.label);
          common.menusForSearch.push(node);
        }
      }
    } else {
      if (node.isclickable == 1) {
        node.namex = node.name || node.label;
        common.menusForSearch.push(node);
      }
      roots.push(node);
    }
  }
  let rootmenu = [];
  for (var k in roots) {
    const mainmenu = roots[k]
    if (mainmenu.isclickable != 0) {
      rootmenu.push(mainmenu);
      continue;
    }
    let child = mainmenu.children;
    if (child !== undefined) {
      rootmenu.push(mainmenu);
    }

    // while (child) {
    //   for (let i = 0; i < child.length; i++) {
    //     let element = child[i];
    //     if (element.isclickable == 0) {
    //       console.log(parantname);
    //       parantname += ' > ' + element.label;
    //     } else {
    //       let action = element.action.split(',');
    //       var d = [];
    //       for (let l = 0; l < action.length; l++) {
    //         const act = action[l];
    //         d.push({
    //           act: false,
    //           val: act
    //         });

    //       }
    //       element.action = d;
    //       element.act = false;
    //       element.parant = parantname;
    //       menun.push(element);
    //     }
    //   }
    //   child = child.children;
    // }
  }

  return rootmenu;
}



common.TreeBind = function (list) {
  var f = [];
  var group = {};
  var indexx = -1;
  var map = {},
    node, roots = [],
    i;
  for (i = 0; i < list.length; i += 1) {
    map[list[i].id] = i; // initialize the map
    // initialize the children
  }
  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (node.action !== undefined && node.action != '') {
      var action = node.action.split(',');
      var d = [];
      for (let index = 0; index < action.length; index++) {
        const act = action[index];
        d.push({
          act: false,
          val: act
        });

      }
      node.action = d;
      node.act = false;
      // if (node.parentid !== 0) {
      //     node.action = d;
      // }
      // else {
      //     node.action = [];
      // }

      var par_id = node.parentid;
      var s = undefined;
      while (par_id !== undefined) {

        var s = list.find((a) => {
          return a.id == par_id
        })
        if (s === undefined) {
          par_id = undefined
        } else {
          par_id = s.parentid;
          node.parant = (node.parant === undefined ? s.label : s.label + ' > ' + node.parant);
        }
      }
      indexx += 1

      if (group[node.parant] === undefined) {

        group[node.parant] = {
          index: indexx,
          size: 1
        }
      } else {
        let g = group[node.parant];
        group[node.parant].size = g.size + 1
      }
      f.push(node);

    }
    // if (node.parentid !== 0) {
    //     if (list[map[node.parentid]] !== undefined) {
    //         // if you have dangling branches check that map[node.parentid] exists
    //         if (list[map[node.parentid]].children === undefined) {
    //             list[map[node.parentid]].children = []
    //         }
    //         list[map[node.parentid]].children.push(node);
    //     }
    // } else {
    //     roots.push(node);
    // }
  }
  return [f, group];
}

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
  //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
  var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

  var CSV = '';
  //Set Report title in first row or line

  CSV += ReportTitle + '\r\n\n';

  //This condition will generate the Label/Header
  if (ShowLabel) {
    var row = "";

    //This loop will extract the label from 1st index of on array
    for (var index in arrData[0]) {

      //Now convert each value to string and comma-seprated
      row += index + ',';
    }

    row = row.slice(0, -1);

    //append Label row with line break
    CSV += row + '\r\n';
  }

  //1st loop is to extract each row
  for (var i = 0; i < arrData.length; i++) {
    var row = "";

    //2nd loop will extract each column and convert it in string comma-seprated
    for (var index in arrData[i]) {
      row += '"' + arrData[i][index] + '",';
    }

    row.slice(0, row.length - 1);

    //add a line break after each row
    CSV += row + '\r\n';
  }

  if (CSV == '') {
    alert("Invalid data");
    return;
  }

  //Generate a file name
  var fileName = "";
  //this will remove the blank-spaces from the title and replace it with an underscore
  fileName += ReportTitle.replace(/ /g, "_");

  //Initialize file format you want csv or xls
  var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

  // Now the little tricky part.
  // you can use either>> window.open(uri);
  // but this will not work in some browsers
  // or you will not get the correct file extension    

  //this trick will generate a temp <a /> tag
  var link = document.createElement("a");
  link.href = uri;

  //set the visibility hidden so it will not effect on your web-layout
  link.style = "visibility:hidden";
  link.download = fileName + ".csv";

  //this part will append the anchor tag and remove it after automatic click
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


common.setDefaultVal = function (field, defaultval) {
  if (field == null || field == '0' || !field) {
    return defaultval;
  }
  return field;
}

common.load = function (id, text) {
  $(id).waitMe({ 'effect': 'pulse', 'text': text });
}


common.hideload = function (id) {
  $(id).waitMe('hide');
}

defcom = {};
defcom.imgerror = function (img) {
  img.onerror = "";
  img.src = "./assets/img/no-image-selected.png";
  return true;
}