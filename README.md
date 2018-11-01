Bamazon Application

Overview:
Bamazon is an amazon-like storefront using Node.js and MySql. The application has two modes, customer and manager. The customer mode will allow the user to make an order from the store. That order will deplete the available stock of the purchased item in the database. The user will also be able to check the stock of any of the items in the store. The manager mode allows the user to view everything currently in inventory, view items that have a stock level below 5 pieces, add inventory to a specific item, and add a completely new item to the store.

Initial Setup:
-	Clone the GitHub repository (https://github.com/akatzer/bamazon.git).
-	Once you have terminal opened up navigate to this new repo and open it in your terminal.
-	run a npm install to ensure you have all the necessary packages installed to run the application properly.

MySQL Setup:
-	Open your MySQL editor of choice and use the contents of the bamazonSeeds.sql file as a script to set up the database, table, and initial inventory values.

Customer Application:
-	Open the bamazonCustomer.js file in terminal.
-	Type node bamazonCustomer.js in the command line.
-	The customer application should now be running. Use the arrow keys to make your selections and enter ID and order quantities when prompted.

Manager Application:
-	Open the bamazonCustomer.js file in terminal
-	Type node bamazonManager.js in the command line.
-	The manager application should now be running. Use the arrow keys to make your selections and enter product information when prompted.

[Bamazon Video Example](https://drive.google.com/file/d/1N9C_lBV0gV3T4RQfFpBqZjO7XW5UQs2c/view)

