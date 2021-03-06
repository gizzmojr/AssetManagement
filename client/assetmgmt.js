// Globals
var url = "http://localhost:8000";
var filterSelection = "";
var filterValue = "";

var rootDom = "#assetMgmt";
var dateColumns = [
    "created",
    "lastUpdate",
    "warrantyStart",
    "warrantyEnd"
];
var filters = [
    "status",
    "category",
    "location",
    "type",
    "account"
];

function initAssetMgmt() {
    initUI();
}

function addHeader(response) {
    var table = document.querySelector(".table-fill");
    var thead = document.createElement("thead");
    var tr = document.createElement("tr");

    table.appendChild(thead);

    var keys = Object.keys(response);
    keys.forEach(function(key) {
        var title = document.createElement("th");
        title.innerHTML = key;
        title.className = "table-title";

        tr.appendChild(title);
        thead.appendChild(tr);

        return tr;
    });
}

function addRows(response) {
    var table = document.querySelector(".table-fill");
    var tbody = document.createElement("tbody");

    table.appendChild(tbody);

    response.forEach(function(asset) {
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

function clearFilters() {
    filters.forEach(function(filter) {
        var select = document.querySelector("select#text" + filter);
        while (select.options.length > 0) {
            select.remove(0);
        }
    });
}

function clearTable() {
    var table = document.querySelector("#table");
    var filters = document.querySelector("#filters");
    if (table) {
        table.remove();
        filters.remove();
    }
}

function createNav() {
    var nav = document.createElement("div");
    nav.id = "nav";
    var btnAll = document.createElement("button");
    btnAll.id = "btnAll";
    btnAll.innerHTML = "All";
    btnAll.onclick = function() {
        clearTable();
        httpGet("/all", function(response) {
            showTable(response);
        }, function(error) {
            alert(error.message);
        });
    };
    var btnClear = document.createElement("button");
    btnClear.id = "btnClear";
    btnClear.innerHTML = "Clear Board";
    btnClear.onclick = clearTable;

    nav.appendChild(btnAll);
    nav.appendChild(btnClear);
    document.querySelector(rootDom).appendChild(nav);
}

function fillFilters() {
    var unique = [];
    var rows = getTableRows(".table-fill tbody");
    filters.forEach(function(filter) {
        unique = [];
        rows.forEach(function(row) {
            var value = row.children[filter].innerHTML;
            if (unique.indexOf(value) == -1) {
                unique.push(value);
            }
        });
        unique.sort();

        var select = document.querySelector("select#text" + filter);
        var option = document.createElement("option");
        option.text = option.value = "Select a filter";
        option.disabled = option.selected = true;
        select.add(option);

        unique.forEach(function(value) {
            option = document.createElement("option");
            option.text = option.value = value;
            select.add(option);
            select.disabled = false;
        });

        if (select.length == 2) {
            // One actual option, first is disabled "Select" text
            select.children[1].selected = true;
        }
    });
}

function filterTable(filter) {
    filterValue = document.getElementById("text" + filter).value;
    var rows = getTableRows(".table-fill tbody");
    var toDelete = [];
    rows.forEach(function(row) {
        if (!(row.children[filter].innerHTML == filterValue)) {
            toDelete.push(row);
        }
    });
    var table = document.querySelector(".table-fill tbody");
    toDelete.forEach(function(row) {
        table.removeChild(row);
    });
    clearFilters();
    fillFilters();
}

function getTableRows(table) {
    var node = document.querySelector(table);
    var nodeList = node.childNodes;
    return nodeList;
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
    var filterDiv = document.createElement("div");
    filterDiv.id = "filters";
    document.querySelector(rootDom).appendChild(filterDiv);

    filters.forEach(function(filter) {
        var span = document.createElement("span");

        var filterLabel = document.createElement("label");
        filterLabel.innerHTML = filter;

        var filterList = document.createElement("select");
        filterList.id = "text" + filter;
        filterList.name = filter;
        filterList.disabled = false; // until content is loaded

        filterList.addEventListener("change", function() {
            filterTable(this.name);
        });

        span.appendChild(filterLabel);
        span.appendChild(filterList);
        document.querySelector('#filters').appendChild(span);
    });

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
    fillFilters();
}
