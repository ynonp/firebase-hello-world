export default class Login {
    init(el) {
        el.innerHTML =  `
  <div id="page-login" class="page">
     <button id="btn-signin">Sign In</button>
  </div>        
        `;

        $('#btn-signin').on('click', function() {
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider);
        });

    }
}