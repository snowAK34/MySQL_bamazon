DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
    item_id INTEGER(10) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(60) NULL,
    department_name VARCHAR(45) NULL,
    price DECIMAL(10,2) NULL,
    stock_quantity INTEGER(10) NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Red Wine", "Beverages", 25.00, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("White Wine", "Beverages", 20.00, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Cola 12 pack", "Beverages", 4.99, 35);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Green Rider by Kristain Britain", "Books", 15.00, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Harry Potter book 1", "Books", 17.25, 18);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Brave Not Perfect by Reshma Saujani", "Books", 12.95, 9);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Beauty and the Beast BluRay", "Movies", 22.00, 3);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("The Goonies VHS", "Movies", 0.25, 2);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Dog Food", "Pet Supplies", 45.00, 8);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Dog Toy", "Pet Supplies", 5.00, 23);

CREATE TABLE departments (
    department_id INTEGER(10) NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(30) NOT NULL,
    over_head_costs INTEGER(15) NULL,
    PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Beverages", 200), ("Books", 100), ("Movies", 20), ("Pet Supplies", 95);

CREATE TABLE sales (
    sale_id INTEGER(10) AUTO_INCREMENT PRIMARY KEY,
    department_id INTEGER(10) NOT NULL,
    item_id INTEGER(10) NOT NULL,
    number_sold INTEGER(10) NULL
);

INSERT INTO sales (department_id, item_id, number_sold)
VALUES (2, 4, 5), (1, 1, 2);