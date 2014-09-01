**Elastic search has finally introduced snapshot this year, this tool is no longer supported**

> http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/modules-snapshots.html


---------------------


This tool requires node.js and ElasticSearch.

Run this first:

``$ npm install``

Usage: 

``$ node index.js -h [host] -p [port] -i [index_name] -m [mapping] -f [file_name]``

For exmaple 

``$ node index.js -h localhost -p 9200 -i big-data -m magic-cards -f test.json``

Should backup the magic-cards into a file called "test.json" 

when -i is not inputted, it will back up the entire database

``$ node index.js``

This will backup entire database into "backup.json" 
