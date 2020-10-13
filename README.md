# Learnlab

## Requirements
### PostgreSQL (12.4)
Note: You'll need to remember the superuser credentials because they are needed to create the local database!
  * For Windows follow steps 1 and 2 [here](https://www.microfocus.com/documentation/idol/IDOL_12_0/MediaServer/Guides/html/English/Content/Getting_Started/Configure/_TRN_Set_up_PostgreSQL.htm)
  * For MAC make sure to have PostgreSQL installed on your machine

The following command should work if you installed it correctly
```
psql -V
```


## Setup
### Database
To setup the local database:
```
 node server/src/create-db.js superuser_username superuser_password
```
It should output the following:
```
Result {
  command: 'CREATE',
  rowCount: NaN,
  oid: null,
  rows: [],
  fields: [],
  _parsers: [],
  RowCtor: null,
  rowAsArray: false,
  _getTypeParser: [Function: bound ]
}
```
The database is called `learnlab_local`

## Running tests

## Deployment
