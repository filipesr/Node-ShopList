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
            $each: [ req.body ]
          },
        },
      }
    )
  .then((item) => res.status(200).json(`Price of ${item.title} updated to ${price}...`))
  .catch((err) => res.status(500).json(err));
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json("Product has been deleted..."))
    .catch((err) => res.status(500).json(err));
});

//GET PRODUCT BY ID
router.get("/find/:id", verifyToken, async (req, res) => {
  const slice = req.query.all
              ? {}
              : { prices: { $slice: -3 } };

  Product.findById(req.params.id, slice) 
    .then((item) => res.status(200).json(item))
    .catch((err) => res.status(500).json(err));
});

//GET PRODUCT BY CODE
router.get("/code/:code", async (req, res) => {
  const slice = req.query.all
              ? {}
              : { prices: { $slice: -3 } };
  Product.findOne({ code: req.params.code }, slice)
    .then((item) => res.status(200).json(item))
    .catch((err) => res.status(500).json(err));
});

//GET ALL PRODUCTS
router.get("/", verifyToken, async (req, res) => {
  const { new: qNew, category, search } = req.query;
  // console.log(req.query);

  // query -> params
  const where = qNew ? {}
              : category ? { category: category } 
              : search ? { title: { $regex: search, $options: 'i' } }
              : {};
  const fields = {_id: 1, code: 1, title: 1, price: 1, size: 1, category: 1 };
  const sort = { createdAt: -1 };
  const limit = qNew ?  1 : 0;

  // query -> return
  Product.find(where, fields)
    .sort(sort)
    .limit(limit)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(500).json(err))
});

module.exports = router;
