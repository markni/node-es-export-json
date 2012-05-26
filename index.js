/**
 * Module dependencies.
 */
var
//es = require('com.izaakschroeder.elasticsearch'),
    es = require('./elasticsearch'),
    fs = require('fs'),
    argv = require('optimist').usage('Usage: $0 -h [host] -p [port] -i [index_name] -m [mapping] -f [file_name]').demand(['i']).default({ h : "localhost", p : 9200, f : "backup.json" }).argv;




var db = es.connect(argv.h, argv.p),
    index = db.index(argv.i),
    mapping = index.mapping(argv.m);

//if -m is inputed, we backup the specific mapping
var target = (argv.m) ? mapping : index;



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
    //the obj is the data we want!
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
        //TODO: make default file name a unique name (like generated with current time)
        exportFromEs(data, argv.f);
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