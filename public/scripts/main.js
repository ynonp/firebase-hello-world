$('#status').text('Loading please wait...');

const db = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
db.settings(settings);

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        const name = user.displayName;
        const id   = user.uid;
        $('#status').text(`Welcome! ${name}. Your id is: ${id}`);
        $('#page-signin').show();
    } else {
        // user not signed in, do nothing
        $('#status').text('Please sign in');
        $('#page-not-signed-in').show();
    }
});

$('#btn-signin').on('click', function() {
   var provider = new firebase.auth.GoogleAuthProvider();
   firebase.auth().signInWithPopup(provider);
});

$('#btn-save').on('click', function() {
    text = $('#tagline').val();
    const userid = firebase.auth().currentUser.uid;
    firebase.firestore().collection('taglines').doc(userid).set({
        text,
    });
    $('#tagline').val('');
});

$('#btn-load').on('click', function() {
    const userid = firebase.auth().currentUser.uid;
    firebase.firestore().collection('taglines').doc(userid).get().then((doc) => {
        $('#tagline').val(doc.data().text);
    });
});









