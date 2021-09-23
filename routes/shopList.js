const ShopList = require("../models/ShopList");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  new ShopList(req.body).save()
    .then((item) => res.status(200).json(`ShopList ${item.title} created...`))
    .catch((err) => res.status(500).json(err));;
});

//UPDATE
router.put("/:id", verifyToken, async (req, res) => {
  ShopList
    .findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          pending:{
            $each: [ req.body ]
          },
        },
      }
    )
  .then((item) => res.status(200).json(`ShopList ${item.title} updated...`))
  .catch((err) => res.status(500).json(err));
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  ShopList.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json("ShopList has been deleted..."))
    .catch((err) => res.status(500).json(err));
});

//GET ShopList BY ID
router.get("/find/:id", verifyToken, async (req, res) => {
  const slice = req.query.all
              ? {}
              : { pending: { $slice: -3 }, checked: { $slice: -3 } };

  ShopList.findById(req.params.id, slice) 
    .then((item) => res.status(200).json(item))
    .catch((err) => res.status(500).json(err));
});

//GET ALL ShopListS
router.get("/", verifyToken, async (req, res) => {
  const { new: qNew, search } = req.query;
  // console.log(req.query);

  // query -> params
  const where = qNew ? {}
              : search ? { title: { $regex: search, $options: 'i' } }
              : {};
  const fields = {_id: 1, title: 1, createdAt: 1 };
  const sort = { createdAt: -1 };
  const limit = qNew ?  1 : 0;

  // query -> return
  ShopList.find(where, fields)
    .sort(sort)
    .limit(limit)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(500).json(err))
});

module.exports = router;
