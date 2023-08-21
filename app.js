
class Post{
  constructor(id, photo, caption){
    this.id = id;
    this.photo = photo;
    this.caption = caption
  }
} 
class App {
  constructor(){
 // Initialize the FirebaseUI Widget using Firebase.
 this.posts = [];
 this.userId = "";
 this.pseudo = ""; 
 this.ui = new firebaseui.auth.AuthUI(auth);
  this.myAuth = document.querySelector('#firebaseui-auth-container');
  this.app = document.querySelector('#app');
  this.name = document.querySelector('.name');
  this.username = document.querySelector('.username');
  this.logout = document.querySelector('.logout');
  this.myPost = document.querySelector(".posts");
  this.closeOptions = document.querySelector(".close-options");
  this.optionContainer = document.querySelector(".option-container");
  this.options = document.querySelector(".my-options");
  this.edit = document.querySelector(".edit");
  this.delete = document.querySelector(".delete");
  this.handleAuth();
this.logout.addEventListener('click', () => {
  this.handleLogout()
});

//close options
this.optionContainer.addEventListener('click', (e) => {
  if(e.target.classList.contains("close-options") || e.target.classList.contains("option-container")) {
     this.optionContainer.classList.add("d-none")
  } else {
    this.optionContainer.classList.remove("d-none");
  }
});

this.myForm = document.querySelector('.myForm');

// Add an event listener to the form submission
this.myForm.addEventListener('submit', (e) => {
 e.preventDefault();
const photo = this.myForm.photo.files[0];;
const caption = this.myForm.caption.value; 
this.updateMssg = document.querySelector(".updateMssg");

if (!photo || !caption) {
  console.error("Please select an image and provide a caption.");
  return;
}

  // Create a storage reference
  var storageRef = firebase.storage().ref();
  var imageRef = storageRef.child("images/" + photo.name);

  // Upload the file to Firebase Storage
  imageRef.put(photo)
    .then(function(snapshot) {
      // Get the download URL of the uploaded image
      return snapshot.ref.getDownloadURL();
    })
    .then((downloadURL) => {
      console.log(downloadURL)
      // Save the image URL and caption to Firestore
      const db = firebase.firestore();
    //  Add data to Firestore collection
      this.addPost({downloadURL, caption });
    })
    .catch(function(error) {
      console.error("Error uploading image: ", error);
    });
  
    this.updateMssg.innerHTML = `<h6 style="color: chartreuse;" class="my-2">Your images has been uploaded successfully</h6>` 
    setTimeout(() =>  this.updateMssg.innerText = '', 3000);
  this.myForm.reset();
});
  }

  addPost({ downloadURL, caption }) {
    if (downloadURL != "") {
      const newPost = { id: cuid(), downloadURL, caption};
      this.posts = [...this.posts, newPost];
      this.savePost();
      this. displayPosts();
    
    }
  }

  savePost() {
    console.log("This post is for this user id", this.userId);
    db.collection("users").doc(this.userId).set({
      posts: this.posts
   
     
  })
      .then(() => {
        console.log("Document successfuly written");
      })
      .catch((Error) => {
        console.log("Error writting Document", Error)
      }); 
  }

  fetchPostsFromDB() {
    var docRef = db.collection("users").doc(this.userId);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data().posts);
          this.posts = doc.data().posts;
          this.displayPosts();
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
          db.collection("users")
            .doc(this.userId)
            .set({
              posts: [],
            })
            .then(() => {
              console.log("User successfully created!");
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            });
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }

  displayPosts(){
    console.log(this.posts);
    const renderedPosts = this.posts.map((post) => `
        <div class="post"  data-id="${post.id}">
        <div class="header">
          <div class="profile-area">
            <div class="post-pic">
              <img
                alt="jayshetty's profile picture"
                class="_6q-tv"
                data-testid="user-avatar"
                draggable="false"
                src="assets/akhil.png"
              />
            </div>
            <span class="profile-name">${this.pseudo}</span>
          </div>
          <div class="options">
            <div
              class="Igw0E rBNOH YBx95 _4EzTm"
              style="height: 24px; width: 24px"
            >
              <svg
                aria-label="More options"
                class="_8-yf5"
                fill="#262626"
                height="16"
                viewBox="0 0 48 48"
                width="16"
              >
                <circle
                  clip-rule="evenodd"
                  cx="8"
                  cy="24"
                  fill-rule="evenodd"
                  r="4.5"
                ></circle>
                <circle
                  clip-rule="evenodd"
                  cx="24"
                  cy="24"
                  fill-rule="evenodd"
                  r="4.5"
                ></circle>
                <circle
                  clip-rule="evenodd"
                  cx="40"
                  cy="24"
                  fill-rule="evenodd"
                  r="4.5"
                ></circle>
              </svg>
            </div>
          </div>
        </div>
        <div class="body">
          <img
            alt="Photo by Jay Shetty on September 12, 2020. Image may contain: 2 people."
            class="FFVAD"
            decoding="auto"
            sizes="614px"
            src="${post.downloadURL}"
            style="object-fit: cover"
          />
        </div>
        <div class="footer">
          <div class="user-actions">
            <div class="like-comment-share">
              <div>
                <span class=""
                  ><svg
                    aria-label="Like"
                    class="_8-yf5"
                    fill="#262626"
                    height="24"
                    viewBox="0 0 48 48"
                    width="24"
                  >
                    <path
                      d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"
                    ></path></svg
                ></span>
              </div>
              <div class="margin-left-small">
                <svg
                  aria-label="Comment"
                  class="_8-yf5"
                  fill="#262626"
                  height="24"
                  viewBox="0 0 48 48"
                  width="24"
                >
                  <path
                    clip-rule="evenodd"
                    d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z"
                    fill-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <div class="margin-left-small">
                <svg
                  aria-label="Share Post"
                  class="_8-yf5"
                  fill="#262626"
                  height="24"
                  viewBox="0 0 48 48"
                  width="24"
                >
                  <path
                    d="M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 3.5.1 4S0 5.2.4 5.7l15.9 15.6 5.5 22.6c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2 6.1h35.5L18 18.7 5.2 6.1zm18.7 33.6l-4.4-18.4L42.4 8.6 23.9 39.7z"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="bookmark">
              <div class="QBdPU rrUvL">
                <svg
                  aria-label="Save"
                  class="_8-yf5"
                  fill="#262626"
                  height="24"
                  viewBox="0 0 48 48"
                  width="24"
                >
                  <path
                    d="M43.5 48c-.4 0-.8-.2-1.1-.4L24 29 5.6 47.6c-.4.4-1.1.6-1.6.3-.6-.2-1-.8-1-1.4v-45C3 .7 3.7 0 4.5 0h39c.8 0 1.5.7 1.5 1.5v45c0 .6-.4 1.2-.9 1.4-.2.1-.4.1-.6.1zM24 26c.8 0 1.6.3 2.2.9l15.8 16V3H6v39.9l15.8-16c.6-.6 1.4-.9 2.2-.9z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
         
          <span class="caption">
            <span class="caption-username"><b>${this.pseudo}</b></span>
            <span class="caption-text">
              ${post.caption}
              </span
            >
          </span>
          <span class="posted-time">5 HOURS AGO</span>
        </div>
        <div class="add-comment">
          <input type="text" placeholder="Add a comment..." />
          <a class="post-btn">Post</a>
        </div>
      </div>
      `).join(""); // Join the array of post strings into a single string
      this.myPost.innerHTML = renderedPosts;
      const postsWrapper = this.myPost;
   
      //  Select the options div for each post
     this.optionsDivs =  postsWrapper.querySelectorAll('.post .options');
     this.optionsDivs.forEach((optionsDiv) => {
    optionsDiv.addEventListener('click', () => {
      // logic for handling the options div click
      this.optionContainer.classList.remove("d-none");
      const postElement = event.target.closest('.post');
    
    if (postElement) {
      // Extract the post ID from the data-id attribute
      const postId = postElement.getAttribute('data-id');
      console.log('Clicked on options for post with ID:', postId);
      this.posts.map((post) => {
         if(post.id === postId){
          this.edit.style.color = "red";
          this.delete.style.color = "red";
         }
      });
    }
    });
  });

  }

  handleAuth(){
  auth.onAuthStateChanged((user) => {
    if (user) {
       this.userId = user.uid;
      this.name.innerHTML = user.displayName;
      this.pseudo = user.displayName.replace(/\s+/g, '');
       this.username.innerHTML = this.pseudo;
      this.redirectToApp();
    
    } else {
      this.redirectToAuth();
    };  
  
  });
} 

redirectToApp() {
  this.myAuth.style.display = "none";
  this.app.style.display = "block";
  this.fetchPostsFromDB();

}

redirectToAuth() {
  this.myAuth.style.display = "block";
  this.app.style.display = "none";
  this.ui.start('#firebaseui-auth-container', {
    callbacks: {
      signInSuccessWithAuthResult: (authResult, redirectUrl) => {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        this.userId = authResult.user.uid;
        this.$authUserText.innerHTML = user.displayName;
        this.redirectToApp();
      },
    },
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

class Upload{
  constructor(){
    this.uploadContainer = document.querySelector('.upload-container');
    this.uploadContent = document.querySelector('.upload-content');
    this.uploadButton = document.querySelector('.upload');
    this.contentContainer = document.querySelector('.content-container');
    this.closeContainer = document.querySelector('.close-button');
    this.uploadContainer2 = document.querySelector('.upload-container2');
    this.uploadContent2 = document.querySelector('.upload-content2');
    this.editButton = document.querySelector('.upload2');
    this.contentContainer2 = document.querySelector('.content-container2');
    this.closeContainer2 = document.querySelector('.close-button2');
    this.myAuth = document.querySelector('#firebaseui-auth-container');
     this.mainContainer = document.querySelector('.main-container');
    
    this.closeContainer.addEventListener('click', () => {
      this.uploadContainer.classList.add('d-none');
    });
    this.closeContainer.addEventListener('click', () => {
      this.uploadContainer.classList.add('d-none');
    });
   this.uploadContainer.addEventListener('click', e => {
    if(!e.target.classList.contains('upload-content') && !e.target.classList.contains('myForm') && !e.target.classList.contains('form-control') && !e.target.classList.contains('uploading') && !e.target.classList.contains('btn')){
          this.uploadContainer.classList.add('d-none');
          this.mainContainer.style.display = "block";
    } 
   });

    this.uploadButton.addEventListener('click', e => {
      this.uploadContainer.classList.toggle('d-none');
      this.mainContainer.style.display = "none";
     
      // }
    });
  }


}
new App();
new Upload();

