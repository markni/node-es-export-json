This tool requires node.js and ElasticSearch.

Run this first:

``$ npm install``

Usage: 

``$ node index.js -h [host] -p [port] -i [index_name] -m [mapping] -f [file_name]``

For exmaple 

``$ node index.js -h localhost -p 9200 -i big-data -m magic-cards -f test.json``

Should backup the magic-cards into a file called "test.json" 

Only -i is required

``$ node index.js -i big-data``

This will backup big-data index to "backup.json" 