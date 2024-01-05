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
  try {
    // Retrieve product data from the request body
    const { name, price, quantity } = req.body;

    // Validate product data
    if (!name || !price || !quantity) {
      throw new Error('Invalid product data. Please provide name, price, and quantity.');
    }

    // Generate a new id by incrementing the id of the last product
    const newProductId = products.length ? products[products.length - 1].id + 1 : 1;

    // Create a new product object
    const newProduct = {
      id: newProductId,
      name,
      price,
      quantity,
    };

    // Add the new product to the products array
    products.push(newProduct);

    // Update the products in the JSON file
    fs.writeFileSync(`${__dirname}/data/products.json`, JSON.stringify(products, null, 2));

    // Return the newly created product with a success status
    res.status(201).json({
      status: 'success',
      message: 'Product added successfully',
      data: {
        newProduct,
      },
    });
  } catch (error) {
    // Send an error response if an exception occurs
    res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
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

