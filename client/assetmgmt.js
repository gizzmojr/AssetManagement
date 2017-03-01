// Globals
var url = "http://";

var rootDom = "#assetMgmt";

function initAssetMgmt() {
    initUI();
}

function addRows(resObj) {
    var table = document.getElementById("table");

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

function createHeader(resObj) {
    var table = document.getElementById("table");
    var tr = document.createElement("tr");

    var keys = Object.keys(resObj);
    keys.forEach(function(key) {
        var title = document.createElement("th");
        title.innerHTML = key;
        title.class = "table-title";
        tr.appendChild(title);

        document.getElementById("table").appendChild(tr);

        return tr;
    });
}

function createTable() {
    var tableDiv = document.createElement("div");
    tableDiv.id = "tableDiv";
    var table = document.createElement("table");
    table.id = "table";
    table.className = "table-fill";

    tableDiv.appendChild(table);
    document.querySelector(rootDom).appendChild(tableDiv);
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
    createTable();
// Following would get called from a NAV element
    httpGet("/all", function(response) {
        createHeader(response[0]);
        addRows(response);
    }, function(error) {
        alert(error.message);
    });
}
