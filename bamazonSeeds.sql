DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Shoe Lace", "Apparel", 12.35, 200);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Vace", "Home Goods", 20.25, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Milk", "Food", 2.75, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Magnet", "Tools", 7.65, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Playing Cards", "Entertainment", 5.45, 150);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Purse", "Apparel", 59.75, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Scotch Tape", "Office Supplies", .50, 2000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Desk Phone", "Office Supplies", 102.75, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Playstation 4 Pro", "Video Games", 400, 60);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Couch", "Home Goods", 550.75, 0);
