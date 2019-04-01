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
      console.table(res);
      afterConnection();
    });
}

function viewLowInventory() {
    let lowInvArr = [];
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res) {
        if (err) throw err;
        for (let i=0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                console.table(res[i]);
                lowInvArr.push(res[i].product_name);
            }
        }
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
            name: "incAmount"
        }
    ]).then(function(response) {
        let newAmt;
        console.log("Product to update: ", response);
        connection.query("Select stock_quantity FROM products WHERE product_name = ?", response.prodUpdate, function(err, numRes) {
            if (err) throw err;
            console.log(numRes);
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
                console.log(response.prodUpdate, " has been updated!");
                afterConnection();
            });
        });
    });
}

function addProduct() {
    console.log("insert product!")
    inquirer.prompt([
        {
            type: "input",
            message: "What is the product name?",
            name: "name"
        },
        {
            type: "input",
            message: "What department it this product being added to?",
            name: "department"
        },
        {
            type: "input",
            message: "What is the unit price?",
            name: "price"
        },
        {
            type: "input",
            message: "How many are being added?",
            name: "quantity"
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
            console.log(response.name, "was added to products!");
            afterConnection();
            }
        );
    });
}
