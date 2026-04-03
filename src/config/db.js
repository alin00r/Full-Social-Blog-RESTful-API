const mongoose = require('mongoose');
const userModel = require('../models/userModel');

const LOCALDB = process.env.LOCAL_DATABASE;
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);

const dbConnection = () => {
  mongoose.connect(DB || LOCALDB).then((conn) => {
    userModel.findOne({ email: process.env.ADMIN_EMAIL }).then((admin) => {
      if (!admin) {
        userModel.create({
          name: process.env.ADMIN_NAME,
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
          role: 'super-admin',
        });
        console.log('Admin user created successfully!');
      }
      console.log(`Database Connection successful!:${conn.connection.host} `);
    });
  });
};
module.exports = dbConnection;
