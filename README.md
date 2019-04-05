# MySQL_bamazon

## Description

Making use of a MySQL database, back end node applications view, create, and update data in products, departments, and sales tables within the database.

## Install

* Clone this respository
* Dependencies are listed in the package.json file.  Run `npm install` to install necessary dependencies.
* Setup .env file with your MySQL connection information
* Run `source bamazon.sql` in MySQL to setup database.

## Usage

The database is used by three applications.

**Customer**

Products are shown in a table for the customer, and the customer is able to purchase a product by entering item id and quantity.  Program will alert `Insufficient Quantity!` if quantity exceeds stock amount.

![App gif](https://github.com/snowAK34/MySQL_bamazon/blob/master/gifs/customer_view.gif?raw=true)

**Manager**

Managers are able to view products, add a new product, or view low inventory and then add to the inventory of those products.

![App gif](https://github.com/snowAK34/MySQL_bamazon/blob/master/gifs/manager_view_and_add.gif?raw=true)

![App gif](https://github.com/snowAK34/MySQL_bamazon/blob/master/gifs/manager_low_inventory.gif?raw=true)

**Supervisor**

Managers can view a sales table to show product sales by department or add a new department.

![App gif](https://github.com/snowAK34/MySQL_bamazon/blob/master/gifs/supervisor_view.gif?raw=true)

## NPM Packages Used

* [dotenv](https://www.npmjs.com/package/dotenv)
* [mysql](https://www.npmjs.com/package/mysql)
* [inquirer](https://www.npmjs.com/package/inquirer)
* [console.table](https://www.npmjs.com/package/console.table)
* [chalk](https://www.npmjs.com/package/chalk)
