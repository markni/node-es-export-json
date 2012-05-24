This tool requires node.js and ElasticSearch.


To backup an index, use:

``node index.js -i INDEX_NAME PORT_NUMBER FILE_NAME``

To backup a mapping, use:

``node index.js -m INDEX_NAME MAPPING_NAME PORT_NUMBER FILE_NAME``

For exmaple 

``$ node index.js -m big-data magic-cards 9200 test.json``

Should backup the magic-cards into a file called "test.json" 