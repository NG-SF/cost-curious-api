const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const featuresSchema = new Schema({
    limit: String,
    dataCategory: String
});

const Features = mongoose.model('feature', featuresSchema);

module.exports = { Features };
