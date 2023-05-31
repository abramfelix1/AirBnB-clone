"use strict";

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Spots";
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: "123 Address",
        city: "City1",
        state: "State1",
        country: "Country1",
        lat: 1.0,
        lng: 1.0,
        name: "User 1 spot name",
        description: "User 1 description",
        price: 1.0,
      },
      {
        ownerId: 2,
        address: "123 Address",
        city: "City2",
        state: "State2",
        country: "Country2",
        lat: 2.0,
        lng: 2.0,
        name: "User 2 spot name",
        description: "User 2 description",
        price: 2.0,
      },
      {
        ownerId: 3,
        address: "123 Address",
        city: "City3",
        state: "State3",
        country: "Country3",
        lat: 3.0,
        lng: 3.0,
        name: "User 3 spot name",
        description: "User 3 description",
        price: 3.0,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    return queryInterface.bulkDelete(options, null, {});
  },
};
