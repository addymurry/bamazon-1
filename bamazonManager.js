var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require("chalk");
var columnify = require("columnify");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Akatzer1!",
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connnect as id " + connection.threadId);
    makeSelection();
})

function makeSelection() {
    inquirer
        .prompt({
            name: "selection",
            type: "list",
            message: "Hello manager what would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        })
        .then(function (answer) {
            switch (answer.selection) {
                case "View Products for Sale":
                    viewProducts();
                    break;

                case "View Low Inventory":
                    viewLowInventory();
                    break;

                case "Add to Inventory":
                    addInventory();
                    break;

                case "Add New Product":
                    addProduct();
                    break;
            }
        });
}

function viewProducts() {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (err, res) {
        if (err) throw err;
        var columns = columnify(res)
        console.log(chalk.green("\n\n***************Available Products***************"))
        console.log(columns + "\n\n");
        makeSelection();
    });

}

function viewLowInventory() {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        var columns = columnify(res)
        console.log(chalk.red("\n\n***************Low Inventory***************"))
        console.log(columns + "\n\n");
        makeSelection();
    });
}

function addInventory() {
    connection.query("SELECT item_id, product_name, stock_quantity FROM products", function (err, res) {
        if (err) throw err;
        var columns = columnify(res)
        console.log(chalk.green("\n\n***************Current Inventory***************"))
        console.log(columns + "\n\n");

        inquirer
            .prompt([
                {
                    name: "id",
                    type: "input",
                    message: "Enter the ID number of the product you would like to add inventory to: ",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "Enter how many you would like to add to stock: ",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }
            ])
            .then(function (answer) {
                var chosenItem;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].item_id == answer.id) {
                        chosenItem = res[i];
                    }
                }
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: (chosenItem.stock_quantity + parseInt(answer.quantity))
                        },
                        {
                            stock_quantity: chosenItem.stock_quantity
                        }
                    ],
                    function (err) {
                        if (err) throw err;
                        console.log("\n\n*****************************");
                        console.log("Inventory updated sucessfully");
                        console.log("*****************************\n\n");
                        makeSelection();
                    }
                )
            })
    });
}

function addProduct() {
    console.log(chalk.green("\n\n***************Add New Product***************"))
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "Enter the product name: ",
                validate: function (value) {
                    if (value.trim() === "") {
                        return false;
                    }
                    return true;
                }
            },
            {
                name: "department",
                type: "input",
                message: "Enter the department name: ",
                validate: function (value) {
                    if (value.trim() === "") {
                        return false;
                    }
                    return true;
                }
            },
            {
                name: "price",
                type: "input",
                message: "Enter the price (no dollar sign): ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "Enter the starting inventory count: ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" + answer.name + "', '" + answer.department + "', '" + answer.price + "', '" + answer.quantity + "')",
                function (err) {
                    if (err) throw err;
                    console.log("\n\n*****************************");
                    console.log("Item added sucessfully");
                    console.log("*****************************\n\n");
                    makeSelection();
                }
            )
        })


}