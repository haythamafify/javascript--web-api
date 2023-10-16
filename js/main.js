let currentpage = 1;
let lastpage = 1;

const baseUrl = "https://tarmeezacademy.com/api/v1";
function getPosts(reload = true, page = 1) {
  loaderToggle(true);
  axios.get(`${baseUrl}/posts?limit=50&page=${page}`).then((response) => {
    if (response != null) {
      loaderToggle(false);

      const posts = response.data.data;
      lastpage = response.data.meta.last_page;
      // Clear div posts from any Data
      if (reload) {
        if (document.getElementById("posts") != null) {
          document.getElementById("posts").innerHTML = "";
        }
      }
      for (const post of posts) {
        let buttonEditPost = ``;
        let buttonDeletePost = ``;
        let currentUser = getCurrentUser().id;
        let matchUser = currentUser != null && currentUser == post.author.id;
        if (matchUser) {
          buttonEditPost = `   <button class="edit btn btn-secondary" id="edit" onclick="editPostBtnClicked('${encodeURIComponent(
            JSON.stringify(post)
          )}')">
                 Edit</button>`;
          buttonDeletePost = `<button class="delete btn btn-danger" id="delete"onclick="deletePostBtnClicked('${encodeURIComponent(
            JSON.stringify(post)
          )}')" > Delete</button>`;
        }

        let content = `<div class="card shadow my-3">
                <div class="card-header">
                <div class="user-profile-click" onclick="userClicked(${post.author.id})">  <img
                    class="img-user rounded-circle border border-3"
                    src="${post.author.profile_image}"
                    alt=""
                  />
                  <b>${post.author.username}</b></div>
                  ${buttonDeletePost}
                  ${buttonEditPost}

               </div>
                <div class="card-body"  onclick="postClicked(${post.id})">
                  <img class="w-100" src="${post.image}" alt="" />
                  <h6 class="text-secondary mt-2">${post.created_at}</h6>
                  <h2>${post.title}</h2>
                  <p>
                  ${post.body}.
                  </p>
                  <hr />
                    <div class="comments">
                    <!-- <i class="fa-solid fa-comment"></i> -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-pencil"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"
                      />
                    </svg>
                    (${post.comments_count})comment
                    <span id="post-tags-${post.id}" class="tag">
                  
                  </span>
                                
                  </div>
                </div>
              </div>`;
        if (document.getElementById("posts") != null) {
          document.getElementById("posts").innerHTML += content;
        }

        document.getElementById(`post-tags-${post.id}`).innerHTML = "";

        for (tag of post.tags) {
          let tagscontent = `
        <button class="btn btn-sm rounded-5 bg-secondary text-white ms-1 text-center">
           ${tage.name}
        </button>`;
          document.getElementById(`post-tags-${post.id}`).innerHTML +=
            tagscontent;
        }
      }
    }
  });
}
setupUI();
if (document.getElementById("posts") != null) {
  getPosts(true);
}

// handle eventlistener
window.addEventListener("scroll", function () {
  const endOfPage =
    window.innerHeight + window.scrollY >= document.body.scrollHeight;

  if (endOfPage && currentpage < lastpage) {
    currentpage = currentpage + 1;

    if (document.getElementById("posts") != null) {
      getPosts(false, currentpage);
    }
  }
});

function btnlogninclick() {
  const userName = document.getElementById("recipient-name");
  const upassword = document.getElementById("recipient-password");
  loaderToggle(true);
  axios
    .post(
      `${baseUrl}/login?username=${userName.value}&password=${upassword.value}`
    )
    .then((response) => {
      loaderToggle(false);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      // close modal
      hideModal("loginModal");
      showAlert("You are successfully logged in", "success");
      setupUI();
    })
    .catch((err) => {
      showAlert(err.response.data.message, "danger");
    });
}

function showAlert(customMessage, type = "success") {
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");
    alertPlaceholder.append(wrapper);
  };
  const alertTrigger = document.getElementById("button-modal-login");
  if (alertTrigger) {
    appendAlert(customMessage, type);
  }

  const alertmaodal = document.getElementById("#liveAlertPlaceholder");
  const alertinstance = bootstrap.Alert.getOrCreateInstance(alertmaodal);

  // Hide the modal after 2 seconds
  setTimeout(() => {
    // alertinstance.Alert("hide");
  }, 2000);
}

function setupUI() {
  const token = localStorage.getItem("token");
  const divLogin = document.getElementById("login-div");
  const divlogout = document.getElementById("logout-div");
  const divbtndAdd = document.getElementById("btnd-add");
  // const edit = document.getElementById("edit");
  if (token == null) {
    divLogin.setAttribute("style", "display: flex !important;");
    divlogout.setAttribute("style", "display: none !important;");
    if (divbtndAdd != null) {
      divbtndAdd.setAttribute("style", "display: none !important;");
    }

    // edit.setAttribute("style", "display: none !important;");
  } else {
    // edit.setAttribute("style", "display: flex !important;");

    divLogin.setAttribute("style", "display: none !important;");
    divlogout.setAttribute("style", "display: flex !important;");
    if (divbtndAdd != null) {
      divbtndAdd.setAttribute("style", "display: block !important;");
    }
    const userProfile = document.getElementById("user-name-profile");
    const userProfileImg = document.getElementById("user-profile-img");
    if (userProfile != null) {
      userProfile.innerHTML = getCurrentUser().username;
    }
    if (userProfileImg != null && getCurrentUser().profile_image != null) {
      userProfileImg.src = getCurrentUser().profile_image;
    }
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showAlert("You are successfully logged out", "success");
  setupUI();
}
function registerBtnClicked() {
  const usernameRegister = document.getElementById("username-register").value;
  const userPassword = document.getElementById("password-register").value;
  const name = document.getElementById("name-register").value;
  const email = document.getElementById("email-register").value;
  const profileImage = document.getElementById("profile-image").files[0];
  const token = localStorage.getItem("token");
  let bodyfromData = new FormData();
  bodyfromData.append("username", usernameRegister);
  bodyfromData.append("password", userPassword);
  bodyfromData.append("name", name);
  bodyfromData.append("email", email);
  bodyfromData.append("image", profileImage);

  // const parms = {
  //   username: usernameRegister,
  //   password: userPassword,
  //   name: name,
  //   email: email,
  //   image: profileImage,
  // };
  loaderToggle(true);

  const url = `${baseUrl}/register`;
  axios
    .post(url, bodyfromData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      loaderToggle(false);

      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      hideModal("registerModal");
      showAlert("You are successfully Register", "success");
      setupUI();
    })
    .catch((err) => {
      showAlert(err.response.data.message, "danger");
    });
}
function newPostClicked() {
  // declare varaible
  let postId = document.getElementById("post-id-input").value;
  let isCreate = postId == null || postId == "";
  const bodyPost = document.getElementById("post-body-input").value;
  const titlePost = document.getElementById("post-tittle").value;
  const postImageInput = document.getElementById("post-image-input").files[0];
  let url = "";
  const token = localStorage.getItem("token");
  let bodyformData = new FormData();
  bodyformData.append("body", bodyPost);
  bodyformData.append("title", titlePost);
  bodyformData.append("image", postImageInput);
  if (isCreate) {
    loaderToggle(true);

    url = `${baseUrl}/posts`;
    axios
      .post(url, bodyformData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        loaderToggle(false);

        showAlert("new Post has been Created", "success");
        hideModal("createNewPost");
        if (document.getElementById("posts") != null) {
          getPosts();
        }
      })
      .catch((err) => {
        showAlert(err.response.data.message, "danger");
      });
  } else {
    loaderToggle(true);

    bodyformData.append("_method", "put");
    url = `${baseUrl}/posts/${postId}`;
    axios
      .post(url, bodyformData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        loaderToggle(false);

        hideModal("createNewPost");
        showAlert("new Post has been Updated", "success");
        if (document.getElementById("posts") != null) {
          getPosts();
        }
      })
      .catch((err) => {
        showAlert(err.response.data.message, "danger");
      });
  }
}

function hideModal(ElementById) {
  const modal = document.getElementById(ElementById);
  const instancemodel = bootstrap.Modal.getInstance(modal);
  instancemodel.hide();
}

function getCurrentUser() {
  let user = null;
  const userStorage = localStorage.getItem("user");
  if (userStorage != null) {
    user = JSON.parse(userStorage);
  }
  return user;
}
function postClicked(postID) {
  window.location = `postdetails.html?postid=${postID}`;
}
const urlparms = new URLSearchParams(window.location.search);
const urlId = urlparms.get("postid");
function getpost() {
  if (urlId != null) {
    const url = `${baseUrl}/posts/${urlId}`;
    axios.get(url).then((response) => {
      const post = response.data.data;
      const comments = response.data.data.comments;
      author = post.author;
      document.getElementById("author-Post").innerHTML = author.username;
      document.getElementById("name").innerHTML = author.name;
      document.getElementById("profile_image").src = author.profile_image;
      document.getElementById("post-image").src = post.image;
      document.getElementById("created_at").innerHTML = post.created_at;
      document.getElementById("title").innerHTML = post.title;
      document.getElementById("body").innerHTML = post.body;
      document.getElementById("comments_count").innerHTML = post.comments_count;
      let commentContentet = ` <div class="comments-show " id="comments">   </div> `;

      for (const comment of comments) {
        commentContentet += `  
             
        <div class="comment p-3 ms-3 me-3">
          <img
            src="${comment.author.profile_image}"
            alt=""
            class="img-circle rounded-circle"
            id="img-circle"
          />
        </div>
        <div class="comment-body ms-3 me-3">
          <b>${comment.author.username}</b>
          <p>
            ${comment.body}
          </p>
        </div>
    
     </div>`;
      }

      document.getElementById("comments").innerHTML = commentContentet;
    });
  }
}

getpost();

function createCommentClicked() {
  let textComment = document.getElementById("text-comment").value;

  let parms = {
    body: textComment,
  };
  let token = localStorage.getItem("token");
  //{{baseUrl}}/posts/2/comments
  let url = `${baseUrl}/posts/${urlId}/comments`;
  axios
    .post(url, parms, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      getpost();

      showAlert("Your comment successfully add ", "success");
    })
    .catch((err) => {
      const errorMessage = err.response.data.message;
      console.log(errorMessage);
    });
}
function editPostBtnClicked(postobject) {
  document.getElementById("createNewPostLabel").innerHTML = "Edit New Post ";
  let post = JSON.parse(decodeURIComponent(postobject));
  document.getElementById("post-id-input").value = post.id;
  document.getElementById("post-tittle").value = post.title;
  document.getElementById("post-body-input").value = post.body;
  document.getElementById("neworeditpost").textContent = "Update";
  let editPostMoadl = new bootstrap.Modal(
    document.getElementById("createNewPost"),
    "options"
  );
  editPostMoadl.toggle();
}

function changeButtonName() {
  document.getElementById("createNewPostLabel").textContent = "Create New Post";
  document.getElementById("neworeditpost").textContent = "Create";
}
//deletePostBtnClicked
function deletePostBtnClicked(postobject) {
  let post = JSON.parse(decodeURIComponent(postobject));
  let id = post.id;
  document.getElementById("post-delete-input").value = id;
  let deletePostMoadl = new bootstrap.Modal(
    document.getElementById("DletePost"),
    "options"
  );
  deletePostMoadl.toggle();
}
function confirmDeletePost() {
  let postId = document.getElementById("post-delete-input").value;
  let url = `${baseUrl}/posts/${postId}`;
  let token = localStorage.getItem("token");
  axios
    .delete(url, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      hideModal("DletePost");
      showAlert("The Post has been Deleted Successfully", "success");
      if (document.getElementById("posts-user") != null) {
        profileUserNameposts();
      }
      getPosts();
    });
}

function profileUserNameInfo() {
  let user = localStorage.getItem("user");
  let urlprofile = new URLSearchParams(window.location.search);
  let useridProfile = urlprofile.get("userid");
  let userid = useridProfile;
  const url = `${baseUrl}/users/${userid}`;
  let token = localStorage.getItem("token");

  axios.get(url).then((response) => {
    const userInfo = response.data.data;
    const email = userInfo.email;
    const username = userInfo.username;
    const name = userInfo.name;
    const Id = userInfo.ID;
    const profile_image = userInfo.profile_image;
    const comments_count = userInfo.comments_count;
    const posts_count = userInfo.posts_count;
    if (
      document.getElementById("profile-image-pic") != null &&
      profile_image != null
    ) {
      document.getElementById("profile-image-pic").src = profile_image;
    }
    if (document.getElementById("profile-main-info-username") != null) {
      document.getElementById("profile-main-info-username").textContent =
        username;
    }
    if (document.getElementById("profile-main-info-name") != null) {
      document.getElementById("profile-main-info-name").textContent = name;
    }
    if (document.getElementById("profile-main-info-email") != null) {
      document.getElementById("profile-main-info-email").textContent = email;
    }

    if (document.getElementById("comments_count") != null) {
      document.getElementById("comments_count").textContent = comments_count;
    }
    if (document.getElementById("posts_count") != null) {
      document.getElementById("posts_count").textContent = posts_count;
    }
    if (document.getElementById("author-Post") != null) {
      document.getElementById("author-Post").textContent = username;
    }
  });
}
function profileUserNameposts() {
  loaderToggle(true);

  let userid = getCurrentUserId();

  const url = `${baseUrl}/users/${userid}/posts`;

  if (userid != null) {
    axios.get(url).then((response) => {
      loaderToggle(false);

      let posts = response.data.data;
      if (document.getElementById("posts-user") != null) {
        document.getElementById("posts-user").innerHTML = "";
      }
      for (const post of posts) {
        let buttonEditPost = ``;
        let buttonDeletePost = ``;
        let currentUser = getCurrentUser().id;
        let matchUser = currentUser != null && currentUser == post.author.id;
        if (matchUser) {
          buttonEditPost = `   <button class="edit btn btn-secondary" id="edit" onclick="editPostBtnClicked('${encodeURIComponent(
            JSON.stringify(post)
          )}')">
                 Edit</button>`;
          buttonDeletePost = `<button class="delete btn btn-danger" id="delete"onclick="deletePostBtnClicked('${encodeURIComponent(
            JSON.stringify(post)
          )}')" > Delete</button>`;
        }

        let content = `<div class="card shadow my-3">
                <div class="card-header">
                  <img
                    class="img-user rounded-circle border border-3"
                    src="${post.author.profile_image}"
                    alt=""
                  />
                  <b>${post.author.username}</b>
                  ${buttonDeletePost}
                  ${buttonEditPost}

               </div>
                <div class="card-body"  onclick="postClicked(${post.id})">
                  <img class="w-100" src="${post.image}" alt="" />
                  <h6 class="text-secondary mt-2">${post.created_at}</h6>
                  <h2>${post.title}</h2>
                  <p>
                  ${post.body}.
                  </p>
                  <hr />
                    <div class="comments">
                    <!-- <i class="fa-solid fa-comment"></i> -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-pencil"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"
                      />
                    </svg>
                    (${post.comments_count})comment
                    <span id="post-tags-${post.id}" class="tag">
                  
                  </span>
                                
                  </div>
                </div>
              </div>`;
        document.getElementById("posts-user").innerHTML += content;
        document.getElementById(`post-tags-${post.id}`).innerHTML = "";

        for (tag of post.tags) {
          let tagscontent = `
        <button class="btn btn-sm rounded-5 bg-secondary text-white ms-1 text-center">
           ${tage.name}
        </button>`;
          document.getElementById(`post-tags-${post.id}`).innerHTML +=
            tagscontent;
        }
      }
    });
  }
}

function userClicked(userid) {
  window.location = `/profile.html?userid=${userid}`;
}
profileUserNameInfo();
profileUserNameposts();
function profileClicked() {
  const userid = getCurrentUser().id;
  window.location = `/profile.html?userid=${userid}`;
}

function loaderToggle(show = true) {
  if (show) {
    document.getElementById("spinner-box").style.visibility = "visible";
  } else {
    document.getElementById("spinner-box").style.visibility = "hidden";
  }
}

function getCurrentUserId() {
  let urlprofile = new URLSearchParams(window.location.search);
  let useridProfile = urlprofile.get("userid");
  return useridProfile;
}
