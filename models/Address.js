var mongoose = require('mongoose');
var addressSchema = require('../schemas/address.js');

module.exports = mongoose.model('Address',addressSchema);