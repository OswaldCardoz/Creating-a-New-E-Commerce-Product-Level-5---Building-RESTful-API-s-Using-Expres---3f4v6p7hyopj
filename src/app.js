const fs = require('fs');
const express = require('express');
const app = express();

// Importing products from products.json file
const products = JSON.parse(
    fs.readFileSync(`${__dirname}/data/product.json`)
);

// Middlewares
app.use(express.json())

// Write POST endpoint for creating new product here
// Endpoint /api/v1/products
app.post('/api/v1/products', (req, res) => {
    const newId =  products[products.length - 1].id + 1;;
    const { name, price, quantity } = req.body;
    
    // Validate the product data
    if (!name || !price || !quantity) {
        return res.status(400).json({
            status: 'failed',
            message: 'Invalid product data. Please provide name, price, and quantity.'
        });
    }

    // Create the new product
    const newProduct = {
        id: newId,
        name,
        price,
        quantity
    };

    // Add the new product to the products array
    products.push(newProduct);

    // Update the products.json file with the new data
    fs.writeFileSync(`${__dirname}/data/products.json`, JSON.stringify(products, null, 2));

    // Respond with a success message and the newly created product
    res.status(201).json({
        status: 'Success',
        message: 'Product added successfully',
        data: {
            newProduct
        }
    });
});

// GET endpoint for sending the details of users
app.get('/api/v1/products', (req,res) => {
    res.status(200).json({
    status:'Success',
    message:'Details of products fetched successfully',
    data:{
        products
    }
});
});
app.get('/api/v1/products/:id', (req,res) => {
    let {id} = req.params;
    id *=1;

    const product = products.find(product => product.id===id);
    if(!product){
        return res.status(404).send({status:"failed", message: "Product not found!"});
    }
 
    res.status(200).send({
        status : 'success',
        message : "Product fetched successfully",
        data: {
            product
        }
});
});
    
module.exports = app;

