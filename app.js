//  // Initialize the FirebaseUI Widget using Firebase.
//  var ui = new firebaseui.auth.AuthUI(auth);

// const myAuth = document.querySelector('#firebaseui-auth-container');
// const app = document.querySelector('#app');
// let name = document.querySelector('.name');
// let username = document.querySelector('.username');
// const logout = document.querySelector('.logout');
// app.style.display = 'none';
// handleAuth();
// function handleAuth(){
//   auth.onAuthStateChanged((user) => {
//     if (user) {
//       console.log(user.displayName);
//       name.innerHTML = user.displayName;
//       let myUsername = user.displayName.replace(/\s+/g, '');
//        username.innerHTML = myUsername;
//       redirectToApp();
//     } else {
//       redirectToAuth();
//     }
//   });
  
// }



// function redirectToApp() {
//   myAuth.style.display = "none";
//   app.style.display = "block";
// }

// function redirectToAuth() {
//   myAuth.style.display = "block";
//   app.style.display = "none";
//   ui.start('#firebaseui-auth-container', {
//     signInOptions: [
//       firebase.auth.EmailAuthProvider.PROVIDER_ID,
//       firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//     ],
//     // Other config options...
//   });
// }

// function handleLogout() {
//   auth
//     .signOut()
//     .then(() => {
//       this.redirectToAuth();
//     })
//     .catch((error) => {
//       console.log("ERROR OCCURED", error);
//     });
// }

// logout.addEventListener('click', () => {
//   handleLogout()
// });

class Auth {
  constructor(){
     // Initialize the FirebaseUI Widget using Firebase.
     this.ui = new firebaseui.auth.AuthUI(auth);
  this.myAuth = document.querySelector('#firebaseui-auth-container');
  this.app = document.querySelector('#app');
  this.name = document.querySelector('.name');
  this.username = document.querySelector('.username');
  this.logout = document.querySelector('.logout');
  // this.app.style.display = 'none';
  this.handleAuth();
this.logout.addEventListener('click', () => {
  this.handleLogout()
});
  }
 
  handleAuth(){
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log(user.displayName);
      this.name.innerHTML = user.displayName;
       this.username.innerHTML = user.displayName.replace(/\s+/g, '');
      this.redirectToApp();
    } else {
      this.redirectToAuth();
    }
  });
  
}

redirectToApp() {
  this.myAuth.style.display = "none";
  this.app.style.display = "block";
}

redirectToAuth() {
  this.myAuth.style.display = "block";
  this.app.style.display = "none";
  this.ui.start('#firebaseui-auth-container', {
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    // Other config options...
  });
}

handleLogout() {
  auth
    .signOut()
    .then(() => {
      this.redirectToAuth();
    })
    .catch((error) => {
      console.log("ERROR OCCURED", error);
    });
}

}

new Auth();

