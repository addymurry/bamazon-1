//dependencies 
var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require("chalk");
var columnify = require("columnify");

//creating the connection information for sql
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Akatzer1!",
    database: "bamazonDB"
});

//connecting to the server and the database
connection.connect(function (err) {
    if (err) throw err;
    console.log("connnect as id " + connection.threadId);
    afterConnection();
})

//runs the showItems function
function afterConnection() {
    showItems();
}

//outputs the contents of the database and runs the makeSelection function
function showItems() {
    connection.query("SELECT item_id, product_name, department_name price FROM products", function (err, res) {
        if (err) throw err;
        var columns = columnify(res)
        console.log(chalk.green("\n\n***************Available Products***************"))
        console.log(columns + "\n\n");
        makeSelection();
    });
}

//gives you a list of selections to either buy, check stock, or disconnect from the server
function makeSelection() {
    //prompt to make a selection
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

        //calls the functions based off of the selection from the inquirer prompt above
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

//allows user to select a product and quantity of the product to buy
function buyProduct() {

    //query the DB for all the products
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        //prompt to buy a product
        inquirer
            //ask for product ID and quantity
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
            //take the input from above and find that ID in the table and subtract the quantity from the inventory if there is enough in stock.
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
                        //logs the results
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

//allows the user to check stock of a specific item
function checkStock() {
    //selects all products from the table
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        //prompt to check stock
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
            //takes the input from above and displays the stock level of the ID chosen
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
//ends the server connection
function disconnect() {
    connection.end()
}


