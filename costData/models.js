const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      moment = require('moment');

mongoose.Promise = global.Promise;

const transactionsSchema = new Schema({
    amount: Number,
    createdAt: Number,
    place: String
});

const costDataSchema = new Schema({
  description: String,
  userId: String,
  history: [transactionsSchema]
});

const CostData = mongoose.model('costData', costDataSchema);

module.exports = { CostData };
