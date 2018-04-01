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

// const costDataSchema = new Schema({
//   description: {type: String, unique: true},
//   history: [{
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'transactions'
//     }]
// });


const CostData = mongoose.model('costData', costDataSchema);
// const Transactions = mongoose.model('transactions', transactionsSchema);

module.exports = { CostData };
