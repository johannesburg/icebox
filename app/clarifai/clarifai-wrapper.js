process.env['CLARIFAI_CLIENT_ID'] = '34EZ1WNwGt7dvL08d-k2BNfutb-ZqqOh8mmdQXNP';
process.env['CLARIFAI_CLIENT_SECRET'] = 'QTU11PsOato83dZz5z_pxzbCapAQbtNAyMeaigIW';

var Clarifai = require('./clarifai_node.js');

Clarifai.initAPI(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

