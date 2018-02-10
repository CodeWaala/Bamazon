const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  getAllProducts();
});

function getAllProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    //console.log(res);
    for (var i = 0; i < res.length; i++) {
          console.log(
            "Item ID: " +
              res[i].item_id +
              " || Product Name: " +
              res[i].product_name +
              " || Department Name: " +
              res[i].department_name +
              " || Price: " +
              res[i].price +
              " || Quantity: " +
              res[i].stock_quantity
          );
        }
    //connection.end();
    continueShopping();
  });
};

var continueShopping = function() {
    console.log("******************************************************************");
    console.log("Welcome to next gen shopping through Node.js. Please type item id and quantity when prompted for desired product !!");
    console.log("******************************************************************");
    inquirer.prompt([
      {
         name: 'itemId',
         message: 'Enter item Id'
      },
      {
          name: 'quantity',
          message: 'Enter Quantity'
      }
    ]).then(function(answers){
        //console.log(answers);
        checkQuantity(answers.itemId,answers.quantity);
    });
}

function checkQuantity(id,quantity) {
  console.log("Checking quantity..")
  var query = connection.query(
    "Select stock_quantity,price from products where item_id=?", [id],
    function(err, res){
        //console.log(res[0].stock_quantity);
        if(res[0].stock_quantity < quantity){
           console.log("InSufficient Quantity !!");
           continueShopping();
        } else{
           console.log("Checking Out Item for you. Please wait !!");
           //console.log(res[0]);
           updateQuantity(id,res[0].stock_quantity - quantity, res[0].price * quantity);
        }
    }
  );
}

function updateQuantity(id,quantity,total) {
  console.log("Updating items...\n");
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: quantity
      },
      {
        item_id: id
      }
    ],
    function(err, res) {
      console.log(res.affectedRows + " product updated!\n");
      console.log("Your Total: $" + total.toFixed(2));
    }
  );
  connection.end();
}