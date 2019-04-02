require('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');
const chalk = require('chalk');

const divider = "---------------------------------------------------------------------------\n";

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "bamazon_db"
})

connection.connect(function(err) {
    if (err) throw err;
    afterConnection();
})

function afterConnection() {
    inquirer.prompt ([
        {
            type: "list",
            message: "Choose an action:",
            choices: ["View Products for Sale", "View Low Inventory", "Add New Product", "Exit"],
            name: "managerAction"
        }
    ]).then (function(response) {
        if (response.managerAction === "View Products for Sale") {
            viewProducts();
        } else if (response.managerAction === "View Low Inventory") {
            viewLowInventory();
            
        } else if (response.managerAction === "Add New Product") {
            addProduct();
        } else {
            connection.end();
        }
    });
    
}

function viewProducts() {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res) {
      if (err) throw err;
      console.log(divider);
      console.table(res);
      console.log(divider);
      afterConnection();
    });
}

function viewLowInventory() {
    let lowInvArr = [];
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res) {
        if (err) throw err;
        console.log(divider);
        for (let i=0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                console.table(res[i]);
                lowInvArr.push(res[i].product_name);
            }
        }
        console.log(divider);
        inquirer.prompt([
            {
                type: "confirm",
                message: "Add to Inventory?",
                name: "confirm",
                default: false
            }
        ]).then (function(answer) {
            if (answer.confirm) {
                increaseStock(lowInvArr);
            } else {
                afterConnection();
            }
        });
    });
}

function increaseStock(arr) {
    inquirer.prompt([
        {
            type: "list",
            message: "Pick a Product:",
            choices: arr,
            name: "prodUpdate"
        },
        {
            type: "input",
            message: "How many would you like to add?",
            name: "incAmount",
            validate: function(value) {
                if (isNaN(value) === false && value >= 0) {
                  return true;
                }
                return false;
            }
        }
    ]).then(function(response) {
        let newAmt;
        connection.query("Select stock_quantity FROM products WHERE product_name = ?", response.prodUpdate, function(err, numRes) {
            if (err) throw err;
            newAmt = numRes[0].stock_quantity + parseInt(response.incAmount);
            connection.query("UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: newAmt
                },
                {
                    product_name: response.prodUpdate
                }
            ],
            function(error,data){
                if (error) throw error;
                console.log(chalk.black.bgGreen(response.prodUpdate, " has been updated!"));
                afterConnection();
            });
        });
    });
}

let deptArr = [];

function getDepartments() {
    connection.query("SELECT department_name FROM departments", function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            deptArr.push(res[i].department_name);
        }
    });
}

function addProduct() {
    getDepartments();
    inquirer.prompt([
        {
            type: "input",
            message: "What is the product name?",
            name: "name"
        },
        {
            type: "list",
            message: "What department it this product being added to?",
            choices: deptArr,
            name: "department"
        },
        {
            type: "input",
            message: "What is the unit price?",
            name: "price",
            validate: function(value) {
                if (isNaN(value) === false && value >= 0) {
                  return true;
                }
                console.log(chalk.red("  Must be a valid number"));
                return false;
            }
        },
        {
            type: "input",
            message: "How many are being added?",
            name: "quantity",
            validate: function(value) {
                if (isNaN(value) === false && value >= 0) {
                  return true;
                }
                console.log(chalk.red("  Must be a valid number"));
                return false;
            }
        }
    ]).then(function(response) {
        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: response.name,
                department_name: response.department,
                price: parseInt(response.price),
                stock_quantity: parseInt(response.quantity)
            },
            function(err, res) {
                if (err) throw err;
            console.log(chalk.black.bgGreen(response.name, "was added to products!"));
            afterConnection();
            }
        );
    });
}
