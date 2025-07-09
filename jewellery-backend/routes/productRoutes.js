const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage });

const Product = require("../models/Product");

// Add product with image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, price, category } = req.body;

    const product = new Product({
      title,
      description,
      price,
      category,
      imageUrl: req.file.path, // cloudinary URL
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Get all products
router.get("/", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

// Get product by ID
router.get("/:id" , async (req,res)=>{
  try{
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  }catch(error){
    res.status(500).json({ error: "Failed to fetch product" });
  }
})

module.exports = router;
