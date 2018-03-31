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
  description: {type: String, unique: true},
  history: [transactionsSchema]
});


// virtual property to return date formated with moment.js
costDataSchema.virtual('date').get(function() {
  return moment(this.createdAt).format('MMMM Do, YYYY');
});

const CostData = mongoose.model('costData', costDataSchema);
const Transactions = mongoose.model('transactions', transactionsSchema);

module.exports = { CostData, Transactions };
