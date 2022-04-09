const main = document.querySelector("#main");
const usernameForm = document.querySelector("#username-form");
const usernameInput = document.querySelector("#username");
const usernameSubmit = document.querySelector("#username-submit-btn");
const profileContainer = document.querySelector("#profile");

usernameForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (usernameInput.value) {
    fetch(`https://api.github.com/users/${usernameInput.value}`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        return response;
      })
      .then((response) => response.json())
      .then((data) => {
        displayProfile(data);
        main.className = "successful__fetch";
      })
      .catch((err) => {
        handleError(err);
        main.className = "unsuccessful__fetch";
      });
  } else {
    handleError("No Input");
  }
});

const displayProfile = (data) => {
  const {
    avatar_url,
    bio,
    company,
    email,
    blog,
    followers,
    followers_url,
    following,
    following_url,
    html_url,
    login,
    name,
    location,
    organizations_url,
    public_repos,
    twitter_username,
  } = data;

  document
    .querySelector("#followers-display")
    .classList.remove("followers__container--open");

  const profileImg = document.querySelector("#profile-img");
  const profileLink = document.querySelector("#profile-link");
  const profileLocation = document.querySelector("#profile-location");
  const profileUsername = document.querySelector("#profile-username");
  const profilePosts = document.querySelector("#posts-count");
  const profileFollowersCount = document.querySelector("#followers-count");
  const profileFollowersBtn = document.querySelector("#followers");
  const profileFollowingsCount = document.querySelector("#following-count");
  const profileBio = document.querySelector("#profile-bio");
  const profileBlog = document.querySelector("#profile-blog");
  const profileTwitter = document.querySelector("#profile-twitter");

  profileContainer.classList.add("profile__container--fetched");
  profileImg.src = avatar_url;
  profileLink.href = html_url;
  profileLink.innerText = name;
  profileLocation.innerHTML =
    (location && `<ion-icon name="location-outline"></ion-icon> ${location}`) ||
    "";
  profileUsername.innerText = `@${login}`;
  profilePosts.innerText = public_repos;
  profileFollowersCount.innerText =
    followers < 1000
      ? followers
      : `${Math.floor((followers * 10) / 1000) / 10}K`;
  profileFollowersBtn.addEventListener("click", () => {
    fetch(followers_url)
      .then((response) => response.json())
      .then((data) => {
        document
          .querySelector("#followers-display")
          .classList.add("followers__container--open");

        const container = document.querySelector("#followers-list");
        container.innerText = "";
        data.forEach((person) => displayFollowers(container, person));
      });
  });
  profileFollowingsCount.innerText =
    following < 1000
      ? following
      : `${Math.floor((following * 10) / 1000) / 10}K`;
  profileBio.innerText = bio;
  profileBlog.href = blog;
  profileBlog.innerText = blog;
  //   profileTwitter.href = `https://twitter.com/${twitter_username}`;
};

const displayFollowers = (container, data) => {
  const followerItem = document.createElement("div");
  followerItem.className = "followers__item";

  const element = `
    <div class="img__container">
        <img
        src="${data.avatar_url}"
        alt="follower"
        class="follower__img"
        />
    </div>
    <p class="follower__username">${data.login}</p>
    <div class="follower__btns">
        <button class="follower__btn follower__profile">
            <ion-icon name="person-outline"></ion-icon>
            View Profile
        </button>
        <a href="${data.html_url}" target="_blank" class="follower__btn follower__github">
            <ion-icon name="logo-github"></ion-icon>
            View on Github
        </a>
    </div>
  `;

  followerItem.innerHTML = element;

  followerItem
    .querySelector(".follower__profile")
    .addEventListener("click", () => {
      fetch(data.url)
        .then((response) => response.json())
        .then((data) => {
          displayProfile(data);
        });
    });

  container.appendChild(followerItem);
};

const handleError = (errMessage) => {
  const snackbar = document.getElementById("snackbar");

  switch (String(errMessage)) {
    case "No Input":
      snackbar.innerText = "Enter a username first...";
      break;

    case "Error: 404":
      snackbar.innerText = "Oops! User not found...";
      profileContainer.classList.remove("profile__container--fetched");

      break;

    default:
      break;
  }

  snackbar.classList.add("show");

  setTimeout(() => {
    snackbar.classList.remove("show");
  }, 4000);
};
