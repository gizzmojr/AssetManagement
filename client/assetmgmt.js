// Globals
var url = "http://";

var rootDom = "#assetMgmt";

function initAssetMgmt() {
    initUI();
}

function addRows(resObj) {
    var table = document.querySelector(".table-fill");

    resObj.forEach(function(asset) {
        var row = document.createElement("tr");

        Object.keys(asset).forEach(function(key) {
            var cell = document.createElement("td");
            cell.id = key;
            cell.innerHTML = asset[key];
            row.appendChild(cell);
        });
        table.append(row);
    });
}

function createFilters(th) {
    var filter = document.createElement("span");

    var filterLabel = document.createElement("label");
    filterLabel.innerHTML = th;

    var filterList = document.createElement("select");
    filterList.id = "text" + th;
    filterList.name = th;
    filterList.disabled = "false"; // until content is loaded

    filter.appendChild(filterLabel);
    filter.appendChild(filterList);
    document.querySelector('#filters').appendChild(filter);
}

function createHeader(resObj) {
    var table = document.querySelector(".table-fill");
    var tr = document.createElement("tr");

    var keys = Object.keys(resObj);
    keys.forEach(function(key) {
        createFilters(key);
        var title = document.createElement("th");
        title.innerHTML = key;
        title.class = "table-title";
        tr.appendChild(title);

        table.appendChild(tr);

        return tr;
    });
}

function createNav() {
    var nav = document.createElement("div");
    nav.id = "nav";
    var btnAll = document.createElement("button");
    btnAll.id = "btnNav1";
    btnAll.innerHTML = "All";
    btnAll.onclick = function() {
        httpGet("/all", function(response) {
            createTable();
            createHeader(response[0]);
            addRows(response);
        }, function(error) {
            alert(error.message);
        });
    };
    var btnClear = document.createElement("button");
    btnClear.id = "btnNav2";
    btnClear.innerHTML = "Clear Board";
    btnClear.onclick = function() {
        var table = document.querySelector("#table");
        if (table) {
            table.remove();
        }
    };

    nav.appendChild(btnAll);
    nav.appendChild(btnClear);
    document.querySelector(rootDom).appendChild(nav);
}

function createTable() {
    var filters = document.createElement("div");
    filters.id = "filters";

    var table = document.createElement("div");
    table.id = "table";
    var tableTable = document.createElement("table");
    tableTable.className = "table-fill";

    table.appendChild(filters);
    table.appendChild(tableTable);
    document.querySelector(rootDom).appendChild(table);
}

function httpGet(method, successCallback, errorCallback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var response = xhr.responseText;
            if (response === "") {
                var msg = "No response from site for request " + url;
                console.warn(msg);
                return;
            }

            var obj = JSON.parse(response);
            if (xhr.status == 200) {
                return successCallback(obj);
            }

            if (obj.error !== null) {
                console.error(obj.message);

                if (errorCallback !== undefined) {
                    errorCallback(obj);
                } else {
                    alert(obj.message);
                }
            }
        }
    };
    xhr.open("GET", url + method);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function initUI() {
    createNav();
}
