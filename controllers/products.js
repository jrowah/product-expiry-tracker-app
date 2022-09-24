const cloudinary = require("../middleware/cloudinary");
const Product = require("../models/Product");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const products = await Product.find({ user: req.user.id });
      res.render("profile.ejs", { products: products, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const products = await Product.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { products: products });
    } catch (err) {
      console.log(err);
    }
  },
  getProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      res.render("products.ejs", { product: product, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createProduct: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Product.create({
        name: req.body.name,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        description: req.body.description,
        user: req.user.id,
      });
      console.log("Product has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  deleteProduct: async (req, res) => {
    try {
      // Find product by id
      let product = await Product.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(product.cloudinaryId);
      // Delete product from db
      await Product.remove({ _id: req.params.id });
      console.log("Deleted Product");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
