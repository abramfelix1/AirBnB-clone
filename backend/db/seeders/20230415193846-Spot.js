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
        address: "user 1 address",
        city: "User 1 city",
        state: "User 1 state",
        country: "User 1 country",
        lat: 1.0,
        lng: 1.0,
        name: "User 1 spot name",
        description: "User 1 description",
        price: 1.0,
      },
      {
        ownerId: 2,
        address: "User 2 address",
        city: "User 2 city",
        state: "User 2 state",
        country: "User 2 country",
        lat: 2.0,
        lng: 2.0,
        name: "User 2 spot name",
        description: "User 2 description",
        price: 2.0,
      },
      {
        ownerId: 3,
        address: "User 3 address",
        city: "User 3 city",
        state: "User 3 state",
        country: "User 3 country",
        lat: 3.0,
        lng: 3.0,
        name: "User 3 spot name",
        description: "User 3 description",
        price: 3.0,
      },
      {
        ownerId: 1,
        address: "user 1 address",
        city: "User 1 city",
        state: "User 1 state",
        country: "User 1 country",
        lat: 1.0,
        lng: 1.0,
        name: "User 1 spot name",
        description: "User 1 description",
        price: 1.0,
      },
      {
        ownerId: 2,
        address: "User 2 address",
        city: "User 2 city",
        state: "User 2 state",
        country: "User 2 country",
        lat: 2.0,
        lng: 2.0,
        name: "User 2 spot name",
        description: "User 2 description",
        price: 2.0,
      },
      {
        ownerId: 3,
        address: "User 3 address",
        city: "User 3 city",
        state: "User 3 state",
        country: "User 3 country",
        lat: 3.0,
        lng: 3.0,
        name: "User 3 spot name",
        description: "User 3 description",
        price: 3.0,
      },
      {
        ownerId: 1,
        address: "user 1 address",
        city: "User 1 city",
        state: "User 1 state",
        country: "User 1 country",
        lat: 1.0,
        lng: 1.0,
        name: "User 1 spot name",
        description: "User 1 description",
        price: 1.0,
      },
      {
        ownerId: 2,
        address: "User 2 address",
        city: "User 2 city",
        state: "User 2 state",
        country: "User 2 country",
        lat: 2.0,
        lng: 2.0,
        name: "User 2 spot name",
        description: "User 2 description",
        price: 2.0,
      },
      {
        ownerId: 3,
        address: "User 3 address",
        city: "User 3 city",
        state: "User 3 state",
        country: "User 3 country",
        lat: 3.0,
        lng: 3.0,
        name: "User 3 spot name",
        description: "User 3 description",
        price: 3.0,
      },
      {
        ownerId: 1,
        address: "user 1 address",
        city: "User 1 city",
        state: "User 1 state",
        country: "User 1 country",
        lat: 1.0,
        lng: 1.0,
        name: "User 1 spot name",
        description: "User 1 description",
        price: 1.0,
      },
      {
        ownerId: 2,
        address: "User 2 address",
        city: "User 2 city",
        state: "User 2 state",
        country: "User 2 country",
        lat: 2.0,
        lng: 2.0,
        name: "User 2 spot name",
        description: "User 2 description",
        price: 2.0,
      },
      {
        ownerId: 3,
        address: "User 3 address",
        city: "User 3 city",
        state: "User 3 state",
        country: "User 3 country",
        lat: 3.0,
        lng: 3.0,
        name: "User 3 spot name",
        description: "User 3 description",
        price: 3.0,
      },
      {
        ownerId: 1,
        address: "user 1 address",
        city: "User 1 city",
        state: "User 1 state",
        country: "User 1 country",
        lat: 1.0,
        lng: 1.0,
        name: "User 1 spot name",
        description: "User 1 description",
        price: 1.0,
      },
      {
        ownerId: 2,
        address: "User 2 address",
        city: "User 2 city",
        state: "User 2 state",
        country: "User 2 country",
        lat: 2.0,
        lng: 2.0,
        name: "User 2 spot name",
        description: "User 2 description",
        price: 2.0,
      },
      {
        ownerId: 3,
        address: "User 3 address",
        city: "User 3 city",
        state: "User 3 state",
        country: "User 3 country",
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
