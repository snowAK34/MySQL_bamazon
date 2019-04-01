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
    afterConnection();
})

function afterConnection() {
    inquirer.prompt([
        {
            type: "list",
            message: "Choose an action:",
            choices: ["View Product Sales by Department", "Create New Department", "Exit"],
            name: "superAction"
        }
    ]).then(function(response) {
        if (response.superAction === "View Product Sales by Department") {
            viewSalesTable();
        } else if (response.superAction === "Create New Department") {
            addDepartment();
        } else {
            connection.end();
        }
    });
}

function viewSalesTable() {
    connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, sales.item_id, sales.number_sold, products.item_id, products.price FROM sales LEFT JOIN products ON sales.item_id = products.item_id LEFT JOIN departments ON sales.department_id = departments.department_id", function(err, res) {
        if (err) throw err;
        let grossSales;
        let netSales;
        for (var i = 0; i < res.length; i++) {
            grossSales = parseFloat(res[i].number_sold * res[i].price);
            netSales = grossSales - parseInt(res[i].over_head_costs);
            console.table([
                {
                    department_id: res[i].department_id,
                    department_name: res[i].department_name,
                    over_head_costs: res[i].over_head_costs,
                    product_sales: grossSales,
                    total_profit: netSales
                }
            ]);
        }
        afterConnection();
    });  
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the department to be added?",
            name: "name"
        },
        {
            type: "input",
            message: "What is the overhead cost?",
            name: "cost"
        }
    ]).then(function(response) {
        connection.query(
            "INSERT INTO departments SET ?",
            {
                department_name: response.name,
                over_head_costs: response.cost
            },
            function(err, res) {
                if (err) throw err;
                console.log(response.name, "Department added!");
                afterConnection();
            }
        );
    })  
}