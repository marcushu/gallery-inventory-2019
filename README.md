# gallery-inventory-2019
An inventory taking and analysis app used to collect information in early 2019 for an art gallery.  This is a specialized application, not intended to be a general inventory solution.

The Project consists of a front end web interface, and a REST api backend.  Data is persisted to MySql.

**Features**

Data Input

Graphical analysis

Generated pdf reports

**Database**


A MySql database with the following tables is used to store the data:


*inventory*

| Tables_in_inventory |
|---------------------|
| artists             |
| artwork             |


*artists*

| Field     | Type        | Null | Key | Default | Extra          |
------------|-------------|------|-----|---------|----------------|
| id        | int(11)     | NO   | PRI | NULL    | auto_increment |
| firstName | varchar(20) | NO   |     | NULL    |                |
| lastName  | varchar(25) | NO   |     | NULL    |                |


*artwork*


| Field        | Type        | Null | Key | Default             | Extra          |
|--------------|-------------|------|-----|---------------------|----------------|
| id           | int(11)     | NO   | PRI | NULL                | auto_increment |
| created_at   | timestamp   | NO   |     | current_timestamp() |                |
| prodId       | varchar(15) | NO   | UNI | NULL                |                |
| title        | varchar(45) | NO   |     | NULL                |                |
| price        | float       | YES  |     | NULL                |                |
| consign      | tinyint(1)  | YES  |     | NULL                |                |
| sculptHeight | int(11)     | YES  |     | NULL                |                |
| sulptWidth   | int(11)     | YES  |     | NULL                |                |
| artistId     | int(11)     | NO   |     | NULL                |                |
