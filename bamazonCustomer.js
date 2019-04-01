const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "iast433g",
    database: "bamazon_db"
})

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
})

function afterConnection() {
    connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
        if (err) throw err;
        console.table(res);
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

let purchaseID = 0;
function purchasePrompt() {
  inquirer.prompt([
      {
        type: "input",
        message: "Enter the item_id of what you would like to purchase: ",
        name: "purchaseID",
      }
  ]).then(function(answers) {
      purchaseID = parseInt(answers.purchaseID);
        inquirer.prompt([
            {
            type: "input",
            message: "How many would you like to buy?",
            name: "quantity"
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
            console.log("Insufficient quantity!")
            actionQuery();
        } else {
            let newQuantity = stock - purchaseAmt;

            let total = purchaseAmt * cost;
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
                console.log("Your total is $" + total + "\nThank you for your purchase!");
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