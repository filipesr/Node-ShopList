const Product = require("../models/Product");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  new Product(req.body).save()
    .then((item) => res.status(200).json(`Product ${item.title} created...`))
    .catch((err) => res.status(500).json(err));;
});

//UPDATE
router.put("/:id", verifyToken, async (req, res) => {
  const { price } = req.body;
  Product
    .findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          price: price
        },
        $push: {
          prices:{
            $each: [req.body],
            $position: -1
          },
        },
      },
      { new: true }
    )
  .then((item) => res.status(200).json(`Price of ${item.title} updated to ${item.price}...`))
  .catch((err) => res.status(500).json(err));
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json("Product has been deleted..."))
    .catch((err) => res.status(500).json(err));
});

//GET PRODUCT
router.get("/find/:id", verifyToken, async (req, res) => {
  Product.findById(req.params.id) 
    .then((item) => res.status(200).json(item))
    .catch((err) => res.status(500).json(err));
});

//GET PRODUCT
router.get("/code/:code", async (req, res) => {
  Product.findOne({ code: req.params.code })
    .then((item) => res.status(200).json(item))
    .catch((err) => res.status(500).json(err));
});

//GET ALL PRODUCTS
router.get("/", verifyToken, async (req, res) => {
  const { new: qNew, category, search } = req.query;
  // console.log(req.query);
  if (qNew) {
    Product.find().sort({ createdAt: -1 }).limit(1)
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(500).json(err))
  } else if (category) {
    Product.find({ category: category })
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(500).json(err))
  } else if (search) {
    Product.find({ title: { $regex: search, $options: 'i' } })
      .select({_id: 1, code: 1, title: 1, size: 1, category: 1 })
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(500).json(err));
  } else {
    Product.find()
      .select({_id: 1, code: 1, title: 1, size: 1, category: 1 })
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(500).json(err))
  }
});

module.exports = router;
