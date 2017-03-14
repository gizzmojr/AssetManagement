// Globals
var url = "http://localhost:8000";

var rootDom = "#assetMgmt";
var dateColumns = [
    "created",
    "lastUpdate",
    "warrantyStart",
    "warrantyEnd"
];

function initAssetMgmt() {
    initUI();
}

function addFilters() {
    var filters = document.createElement("div");
    filters.id = "filters";

    document.querySelector(rootDom).appendChild(filters);
}

function addHeader(resObj) {
    var table = document.querySelector(".table-fill");
    var thead = document.createElement("thead");
    var tr = document.createElement("tr");

    table.appendChild(thead);

    var keys = Object.keys(resObj);
    keys.forEach(function(key) {
        createFilters(key);
        var title = document.createElement("th");
        title.innerHTML = key;
        title.className = "table-title";

        tr.appendChild(title);
        thead.appendChild(tr);

        return tr;
    });
}

function addRows(resObj) {
    var table = document.querySelector(".table-fill");
    var tbody = document.createElement("tbody");

    table.appendChild(tbody);

    resObj.forEach(function(asset) {
        var row = document.createElement("tr");

        Object.keys(asset).forEach(function(key) {
            var cell = document.createElement("td");
            cell.id = key;
            if (dateColumns.indexOf(key) >= 0) { // Is cell in our column lookup
                cell.innerHTML = moment(asset[key], moment.ISO_8601).format("YYYY-MM-DD HH:mm");
            } else {
                cell.innerHTML = asset[key];
            };
            row.appendChild(cell);
        });
        tbody.append(row);
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

function createNav() {
    var nav = document.createElement("div");
    nav.id = "nav";
    var btnAll = document.createElement("button");
    btnAll.id = "btnAll";
    btnAll.innerHTML = "All";
    btnAll.onclick = function() {
        httpGet("/all", function(response) {
            showTable(response);
        }, function(error) {
            alert(error.message);
        });
    };
    var btnClear = document.createElement("button");
    btnClear.id = "btnClear";
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

function fillFilters(resObj) {
    var cols = Object.keys(resObj);

    cols.forEach(function(col) {
        var colValues = new Array();

        document.querySelectorAll(".table-fill tbody tr #" + col).forEach(function(el) {
            colValues.push(el.innerText);
        });
        var uniqueSet = new Set(colValues);
        var uniqueArray = Array.from(uniqueSet);
        uniqueArray.sort();
        uniqueArray.reverse();
        uniqueArray.forEach(function(value) {
            var select = document.querySelector("select#text" + col);
            var option = document.createElement("option");
            option.text = option.value = value;
            select.add(option, 0);
            select.disabled = false;
        });
    });
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

function showTable(response) {
    addFilters();

    var table = document.createElement("div");
    table.id = "table";
    var tableTable = document.createElement("table");
    tableTable.className = "table-fill";
    tableTable.className += " sortable";

    table.appendChild(tableTable);
    document.querySelector(rootDom).appendChild(table);

    addHeader(response[0]);
    addRows(response);
    sorttable.makeSortable(document.querySelector('.table-fill'));
    fillFilters(response[0]);
}
