
var ElasticSearchExport =  function () {
    /**
     * Module dependencies.
     */

    //var es = require('com.izaakschroeder.elasticsearch'),
    //not using here because I modified the elasticsearch lib, added two new method
    var es = require('./elasticsearch');
    var fs = require('fs');


    //options phrasing with optimist
    var argv = require('optimist').usage('Usage: $0 -h [host] -p [port] -i [index_name] -m [mapping] -f [file_name]').default({ h:"localhost", p:9200, f:"backup.json" }).argv;


    var db = es.connect(argv.h, argv.p);

    var index, mapping, target;

    //if no index input, we assume user wants to backup entire database.
    if (argv.i){

        index = db.index(argv.i);
        mapping = index.mapping(argv.m);
        //if -m is inputed, we backup the specific mapping
        target = (argv.m) ? mapping : index;
    }
    else{

        target = db.index("");
    }






    this.main = function () {
        target.count(countCallback);

    }

    var query_builder = function (size) {
        var q = {
            "query":{
                "match_all":{}
            }
        };
        q.size = size;
        return q;

    }

    var countCallback = function (response, obj) {
        //the obj is the data we want!
        if (obj.count) {
            var count = JSON.stringify(obj.count);

            var q = query_builder(count);

            target.search(q, searchCallback);
        }


    }

    var searchCallback = function (response, obj) {
        if (obj.hits) {
            //TODO: Remove unused information from the JSON
            var data = JSON.stringify(obj.hits.hits);
            //TODO: make default file name a unique name (like generated with current time)
            exportFromEs(data, argv.f);
        }

    }


    var exportFromEs = function (data, f_name) {
        fs.writeFile(f_name, data, function (err) {
            if (err) {
                console.error("Could not open file: %s", err);
                process.exit(1);
            } else {
                console.log("\n The file was saved to " + f_name);
            }
        });
    }
}

var ese = new ElasticSearchExport();
ese.main();