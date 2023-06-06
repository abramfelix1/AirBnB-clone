"use strict";

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    return queryInterface.bulkInsert(options, [
      {
        review: "TEST Review",
        stars: 1,
      },
      {
        review: "TEST Review",
        stars: 2,
      },
      {
        review: "TEST Review",
        stars: 1,
      },
      {
        review: "TEST Review",
        stars: 3,
      },
      {
        review: "TEST Review",
        stars: 1,
      },
      {
        review: "TEST Review",
        stars: 5,
      },
      {
        review: "User 1 review",
        stars: 1,
      },
      {
        review: "User 2 review",
        stars: 2,
      },
      {
        review: "User 3 review",
        stars: 3,
      },
      {
        review: "User 1 review 2",
        stars: 2,
      },
      {
        review: "User 2 review 2",
        stars: 3,
      },
      {
        review: "User 3 review 2",
        stars: 4,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    return queryInterface.bulkDelete(options, null, {});
  },
};
