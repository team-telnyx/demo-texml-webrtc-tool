
module.exports.toBase64 = data => (new Buffer.from(data)).toString('base64');
module.exports.fromBase64 = data => (new Buffer.from(data, 'base64')).toString();