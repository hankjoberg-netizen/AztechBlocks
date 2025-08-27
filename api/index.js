// Wrap Express app as a Vercel Serverless Function
const serverless = require('serverless-http');
const app = require('../server');
module.exports = serverless(app);
