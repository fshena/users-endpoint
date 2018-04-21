const firebaseAdmin = require('firebase-admin');

/**
 * Set custom claims to the FireBase token.
 * @param {string} email
 * @param {Object} claims
 */
exports.setFireBaseUserClaims = async (email, claims) => {
    if (!email || !claims) {
        return;
    }
    const fireBaseUser = await firebaseAdmin.auth().getUserByEmail(email);
    if (!fireBaseUser) {
        return;
    }
    firebaseAdmin.auth().setCustomUserClaims(fireBaseUser.uid, claims);
};
