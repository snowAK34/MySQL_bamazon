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
    connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
        if (err) throw err;
        console.log(divider);
        console.table(res);
        console.log(divider);
        actionQuery();
    });
}

function actionQuery() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["Make a Purchase", "Exit"],
            name: "customerAction"
        }
    ]).then(function(answer) {
        if (answer.customerAction === "Make a Purchase") {
            purchasePrompt();
        } else {
            connection.end();
        }
    });
}

let idArr = [];
function getCurrentIds() {
    connection.query("SELECT item_id FROM products", function(err, res) {
        if (err) throw err;
        for (res.item_id in res) {
            idArr.push(res.item_id);
        }
    });
}

let purchaseID = 0;
function purchasePrompt() {
    getCurrentIds();
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the item_id of what you would like to purchase:",
            name: "purchaseID",
            validate: function(value) {
                if (value <= idArr.length && value > 0) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function(answers) {
        purchaseID = parseInt(answers.purchaseID);
        inquirer.prompt([
            {
            type: "input",
            message: "How many would you like to buy?",
            name: "quantity",
            validate: function(value) {
                if (isNaN(value) === false && value >= 0) {
                  return true;
                }
                console.log(chalk.red("  Must be a valid number"));
                return false;
            }
            }
        ]).then(function(amt){
            productPurchase(amt.quantity);
        });
    });
}

function productPurchase(amt){
    connection.query("SELECT item_id,stock_quantity,price FROM products", function(err, res){
        if (err) throw err;
        let cost = 0;
        let stock = 0;
        let purchaseAmt = parseInt(amt);
        for (let i=0; i < res.length; i++) {
                if (res[i].item_id === purchaseID) {
                    stock = res[i].stock_quantity;
                    cost = res[i].price;
                }
        }
        if (purchaseAmt > stock) {
            console.log(chalk.bgRed("Insufficient quantity!"));
            actionQuery();
        } else {
            let newQuantity = stock - purchaseAmt;

            let total = (purchaseAmt * cost).toFixed(2);
            connection.query("UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: newQuantity
                },
                {
                    item_id: purchaseID
                }
             ],
             function(error, data){
                if (error) throw error;
                console.log(chalk.black.bgCyan("Your total is $" + total + "\nThank you for your purchase!"));
                updateSalesTable(res.item_id, purchaseAmt);
                actionQuery();
            });
        }
    })
}

function updateSalesTable(itemId, sold) {
    connection.query("UPDATE sales SET ? WHERE ?",
        [
            {
                number_sold: sold
            },
            {
                item_id: itemId
            }

        ],
        function(err, res) {
            if (err) throw err;
        }
    )

}