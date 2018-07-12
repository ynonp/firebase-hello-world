import Painter from './components/painter.js';
import Login from './components/login.js';

const db = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
db.settings(settings);
const main = document.querySelector('#main');

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        const painter = new Painter();
        painter.init(main);
    } else {
        const login = new Login();
        login.init(main);
    }
});







