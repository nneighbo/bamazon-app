var mysql = require('mysql');
var inquirer = require('inquirer');

var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon",
    socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
});

con.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + "|" + res[i].price + "|" + res[i].stock_quantity);
    }
});
inquirer.prompt([
    {
        type: "input",
        name: "item_name",
        message: "Id of Item: "
    }
]).then(function (benz) {
    con.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {

            if (benz.item_name === res[i].product_name || parseInt(benz.item_name) === res[i].item_id) {
                ableToBid = true;
            }
        }
        if (ableToBid === true) {
            console.log("How much would you like to purchase?");
            inquirer.prompt([
                {
                    type: "input",
                    name: "purchase_ammount",
                    message: "Purchase Ammount: "
                }
            ]).then(function (ans) {
                var x = parseInt(benz.item_name);
                var y = x - 1;
                if (res[y].stock_quantity > 0) {
                    var newStock = res[y].stock_quantity - ans.purchase_ammount;
                    var where = res[y].product_name;
                    console.log(newStock)
                    console.log(res[y].item_id)
                    console.log("You Purchased: " + ans.purchase_ammount + " " + res[y].product_name + "'s" + " for: $" + ans.purchase_ammount * res[y].price);
                    con.query("UPDATE products SET ? WHERE ?",
                        [{
                            stock_quantity: newStock
                        },
                        {
                            product_name: where
                        }
                        ],
                        function (err, res) {
                            if (err) throw err;
                            con.end();
                        }
                    )
                }
            });
        }
    });
});
