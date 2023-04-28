const express = require("express");
const router = express.Router();

const { Spot, Image, User, Review, Booking } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const {
  validateSpot,
  validateImage,
  validateReview,
  validateBooking,
  validateQueries,
} = require("../../utils/validation");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const {
  setPreview,
  setQuery,
  changePreview,
  buildReview,
  updateOrCreateSpot,
  updateOrCreateReview,
  buildBookings,
  checkBookingError,
} = require("../../utils/helpers");

const aggregates = {
  numReviews: [
    sequelize.fn("COUNT", sequelize.col("Bookings.Review.id")),
    "numReviews",
  ],
  avgRating: [
    sequelize.fn("AVG", sequelize.col("Bookings.Review.stars")),
    "avgRating",
  ],
};

/* Get All Bookings By Spot Id */
router.get("/:id/bookings", async (req, res, next) => {
  const { user } = req;
  const spotId = req.params.id;
  const spot = await Spot.findByPk(spotId);
  const attributes = {};

  if (!spot) {
    return next({ message: "Spot couldn't be found", status: 404 });
  }

  if (spot.ownerId === user.dataValues.id) {
    attributes.include = [
      { model: User, attributes: ["id", "firstName", "lastName"] },
    ];
  } else {
    attributes.attributes = {
      exclude: ["id", "userId", "reviewId", "createdAt", "updatedAt"],
    };
  }

  const bookings = await Booking.findAll({
    where: { spotId: spotId },
    ...attributes,
  });

  if (!bookings) {
    return next({ message: "No Bookings found", status: 404 });
  }

  if (spot.ownerId === user.dataValues.id) {
    const Bookings = buildBookings(bookings, "isOwner");
    return res.json({ Bookings: Bookings });
  }

  res.json(bookings);
});

/* Create Booking By Spot Id */
// prettier-ignore
router.post( "/:id/bookings", requireAuth, validateBooking, async (req, res, next) => {
    const { startDate, endDate } = req.body;
    const { user } = req;
    const spotId = req.params.id;
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return next({ message: "Spot couldn't be found", status: 404 });
    }

    if(spot.ownerId === user.dataValues.id){
      return next({message: "Cannot book owned spots", status:400})
    }

    const checkBooking = await spot.getBookings({
      where: {
        [Op.or]:{
        startDate: { [Op.between]: [`${new Date(startDate).toISOString()}`,`${new Date(endDate).toISOString()}`]},
        endDate: { [Op.between]: [`${new Date(startDate).toISOString()}`,`${new Date(endDate).toISOString()}`]},
        }
      },
    });

    if (checkBooking.length) {
      return next(checkBookingError(checkBooking, req.body));
    }

    const newBooking = await Booking.create({
      spotId,
      userId: user.id,
      startDate,
      endDate,
    });

    res.json(newBooking);
  }
);

/* Get All Reviews By Spot Id */
router.get("/:id/reviews", async (req, res, next) => {
  const spotId = req.params.id;
  const where = { spotId: spotId };
  const spot = await Spot.findByPk(spotId);

  const reviews = await Review.scope({
    method: ["getAllReviews", where],
  }).findAll();

  if (!spot) {
    return next({ message: "Spot couldn't be found", status: 404 });
  }

  const Reviews = buildReview(reviews, spot);

  res.json({ Reviews: Reviews });
});

/* Create Review By Spot Id */
// prettier-ignore
router.post("/:id/reviews", requireAuth, validateReview, async (req, res, next) => {
    const { review, stars } = req.body;
    const { user } = req;
    const spotId = req.params.id;
    const spot = await Spot.findByPk(spotId);
    const attributes = {userId: user.dataValues.id, ...req.body}

    if (!spot) {
      return next({ message: "Spot couldn't be found", status: 404 });
    }

    if(spot.ownerId === user.dataValues.id){
      return next({message: "Cannot review owned spots", status:400})
    }

    const booking = await Booking.findOne({
      where: {
        spotId: spotId,
        userId: user.dataValues.id,
      },
    });

    if (!booking) {
      return next({ message: "User hasn't booked this spot", status: 403 });
    }

    if (booking.reviewId) {
        return next({
          message: "Review already exists, please edit or delete",
          status: 409,
        });
      }

    const updatedReview = await updateOrCreateReview(
      {booking} ,
      attributes,
      "create"
    );

    await booking.update({
      reviewId:updatedReview.id
    })


    res.json(updatedReview);
});

/* Get All Spots From Current User */
router.get("/current", requireAuth, async (req, res, next) => {
  const { user } = req;
  const where = { ownerId: user.dataValues.id };
  const attributes = {};
  attributes.include = [aggregates.numReviews, aggregates.avgRating];

  const spots = await Spot.scope({
    method: [
      "getAllSpots",
      where,
      attributes,
      {
        group: ["Spot.id", "previewImage.id", "Bookings.Review.id"],
        subQuery: false,
      },
      "Spot",
    ],
  }).findAll();

  if (!spots.length) {
    res.json({ Spots: [] });
  }

  if (spots[0].dataValues.id) {
    setPreview(spots);
    res.json(spots);
  }
});

/* Get Spot By Id */
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  const spot = await Spot.findByPk(id, {
    include: [
      { model: Image, as: "images", attributes: ["id", "url", "preview"] },
      {
        model: Booking,
        attributes: [],
        include: [{ model: Review, attributes: [] }],
      },
      { model: User, attributes: ["id", "firstName", "lastName"], as: "owner" },
    ],
    attributes: {
      include: [aggregates.numReviews, aggregates.avgRating],
    },
    group: ["Spot.id", "images.id", "Bookings.Review.id", "owner.id"],
  });

  if (!spot) {
    return next({
      message: `Spot of id: ${id} couldn't be found`,
      status: 404,
    });
  }

  res.json(spot);
});

/* Get All Spots */
router.get("/", validateQueries, async (req, res, next) => {
  let { page, size } = req.query;
  const where = setQuery(req.query);
  const attributes = {};
  attributes.include = [aggregates.numReviews, aggregates.avgRating];

  // Pagination
  const pagination = { offset: 0, limit: 20 };

  if (page || size) {
    if (page <= 0) page = 1;
    if (size > 20) size = 20;
    pagination.offset = size * (page - 1);
    pagination.limit = size;
  }

  const spots = await Spot.scope({
    method: [
      "getAllSpots",
      where,
      attributes,
      {
        group: ["Spot.id", "previewImage.id"],
        subQuery: false,
        ...pagination,
      },
      "Spot",
    ],
  }).findAll();

  setPreview(spots);

  const totalItems = await Spot.findAll({ where });
  const showing = Math.min(totalItems.length - (page - 1) * size, size);
  const totalPages = Math.ceil(totalItems.length / size);
  const pageDirectory = `${+page || 1} / ${totalPages}`;

  if (page > totalPages) {
    next({ message: "No results found", status: 404 });
  }

  res.json({
    Spots: spots,
    page: pageDirectory,
    size: +size || 10,
    results: totalItems.length,
    showing: showing,
  });
});

/* Create Spot */
router.post("/", requireAuth, validateSpot, async (req, res, next) => {
  const attributes = { ownerId: req.user.dataValues.id, ...req.body };

  const newSpot = await updateOrCreateSpot({}, attributes, "create");

  res.json(newSpot);
});

/* Add Image to a Spot*/
// prettier-ignore
router.post(
  "/:id/image", requireAuth, validateImage, async (req, res, next) => {
    const { url } = req.body;
    let { preview } = req.body;
    const { user } = req;
    const spotId = req.params.id;
    const spot = await Spot.findOne({
      where:{id:spotId},
      include:[{ model: Image, as: "images"}],
      group: ["Spot.id","images.id"],
    });

    if (!spot) {
      return next({ message: "Spot could not be found", status: 404 });
    }

    if (+spot.ownerId !== +user.dataValues.id) {
      return next({ message: "Unauthorized Action", status: 403 });
    }

    if(spot.dataValues.images.length >= 10){
      return next({ message: "10 image limit reached, remove an image to add new image", status: 400 });
    }

    if(spot.dataValues.images.length === 0){
      preview = true
    }


    if(preview === "true") await changePreview(spot)

    const image = await Image.create({
      url,
      preview: preview || false,
      imageableType: "Spot",
      imageableId: spotId,
    });
    const {id} = image.dataValues

    res.json({id,url,preview});
  }
);

/* Edit Spot */
router.put("/:id", requireAuth, validateSpot, async (req, res, next) => {
  const attributes = req.body;
  const { user } = req;
  const spotId = req.params.id;
  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return next({ message: "Spot could not be found", status: 404 });
  }

  if (+spot.ownerId !== +user.dataValues.id) {
    return next({ message: "Unauthorized Action", status: 403 });
  }

  await updateOrCreateSpot(spot, attributes, "update");

  res.json(spot);
});

/* Delete Spot */
router.delete("/:id", requireAuth, async (req, res, next) => {
  const { user } = req;
  const spotId = req.params.id;
  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return next({ message: "Spot could not be found", status: 404 });
  }

  if (+spot.ownerId !== +user.dataValues.id) {
    return next({ message: "Unauthorized Action", status: 403 });
  }

  await spot.destroy();

  res.json({
    message: "Successfully deleted",
    statusCode: 200,
  });
});

module.exports = router;
