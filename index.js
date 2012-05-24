/**
 * Module dependencies.
 */
var
//es = require('com.izaakschroeder.elasticsearch'),
    es = require('./elasticsearch'),
    fs = require('fs');

var
    config = process.argv[2] || "-m",
    default_index = "big-data",
    default_mapping = "magic-cards",
    default_port = "9200",
    default_filename = "backup.json"; //default is export mapping

var host, index_name, mapping_name, port, file_name;

if (config == "-m") {

    index_name = process.argv[3] || default_index, mapping_name = process.argv[4] || default_mapping, port = process.argv[5] || default_port, file_name = process.argv[6] || default_filename;
} else if (config == "-i") {
    console.log("here");
    index_name = process.argv[3] || default_index, port = process.argv[4] || default_port, file_name = process.argv[5] || default_filename;
}


var db = es.connect("localhost", port),
    index = db.index(index_name),
    mapping = index.mapping(mapping_name);

var target = config == "-m"? mapping:index;


console.log("To back an index, use:");
console.log("   -i INDEX_NAME PORT_NUMBER FILE_NAME");

console.log("To back a mapping, use:");
console.log("   -m INDEX_NAME MAPPING_NAME PORT_NUMBER FILE_NAME");

backup();

function backup() {
    target.count(countCallback);

}

function query_builder(size) {
    var q = {
        "query": {
            "match_all": {}
        }
    };
    q.size = size;
    return q;

}

function countCallback(response, obj) {
    if (obj.count) {
        var count = JSON.stringify(obj.count);

        var q = query_builder(count);

        target.search(q, searchCallback);
    }


}

function searchCallback(response, obj) {
    if (obj.hits) {
        //TODO: Remove unused information from the JSON
        var data = JSON.stringify(obj.hits.hits);
        exportFromEs(data, file_name);
    }



}



function exportFromEs(data, f_name) {
    fs.writeFile(f_name, data, function (err) {
        if (err) {
            console.error("Could not open file: %s", err);
            process.exit(1);
        } else {
            console.log("\n The file was saved to " + f_name);
        }
    });
}