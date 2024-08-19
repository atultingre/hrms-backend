const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccountKey");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "hrms-6ca56.appspot.com", 
});

const bucket = admin.storage().bucket();

module.exports = { bucket };
