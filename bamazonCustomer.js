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
    afterConnection();
})

function afterConnection() {
    showItems();
}

function showItems() {
    connection.query("SELECT item_id, product_name, department_name price FROM products", function (err, res) {
        if (err) throw err;
        var columns = columnify(res)
        console.log(columns);
        makeSelection();
    });
}

function makeSelection() {
    inquirer
        .prompt({
            name: "selection",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Buy a product",
                "Check stock on a product",
                "Disconnect"
            ]
        })
        .then(function (answer) {
            switch (answer.selection) {
                case "Buy a product":
                    buyProduct();
                    break;

                case "Check stock on a product":
                    checkStock();
                    break;

                case "Disconnect":
                    disconnect();
                    break;
            }
        });
}

function buyProduct() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "id",
                    type: "input",
                    message: "Enter item ID number of the product you would like to purchase: ",
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
                    message: "Enter how many you would like to buy: ",
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
                for (var i = 0; i < results.length; i++) {
                    if (results[i].item_id == answer.id) {
                        chosenItem = results[i];
                    }
                }
                if (chosenItem.stock_quantity > parseInt(answer.quantity)) {
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: (chosenItem.stock_quantity - answer.quantity)
                            },
                            {
                                stock_quantity: chosenItem.stock_quantity
                            },
                        ],
                        function (err) {
                            if (err) throw err;
                            console.log("\n\n*************************");
                            console.log("Order Placed sucessfully");
                            console.log("Order Total: $" + (answer.quantity * chosenItem.price))
                            console.log("*************************\n\n");
                            afterConnection();
                        }
                    );
                }
                else {
                    console.log("\n\n****************************************")
                    console.log("Not enough stock available. Try again...");
                    console.log("****************************************\n\n")
                    afterConnection();
                }
            })
    })
}

function checkStock() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt(
                {
                    name: "id",
                    type: "input",
                    message: "Enter item ID number of the product you would like to check stock on : ",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },
            )
            .then(function (answer) {
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].item_id == answer.id) {
                        chosenItem = results[i];
                    }
                }
                console.log("\n\n****************************************")
                console.log("Item selected: " + chosenItem.product_name)
                console.log("Total in stock: " + chosenItem.stock_quantity);
                console.log("****************************************\n\n")
                afterConnection();
            })
    })
}

function disconnect() {
    connection.end()
}


