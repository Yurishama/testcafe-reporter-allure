const createCallsiteRecord = require('callsite-record');

try {
  throw new Error('Create error');
} catch (err) {
  module.exports = createCallsiteRecord({ forError: err });
}