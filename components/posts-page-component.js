import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";

export function renderPostsPageComponent({ appEl }) {
  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                </ul>
              </div>`;


  appEl.innerHTML = appHtml;
  const postsHTML = document.querySelector(".posts");
  let postHTML = ""

  posts.forEach((post) => {
    let likes = '0';
    if (post.likes.length === 1) {
      likes = post.likes[0].name
    } else if (post.likes.length === 2) {
      likes = `${post.likes[0].name}, ${post.likes[1].name}`;
    } else if (post.likes.length > 2) {
      likes = `${post.likes[0].name}, ${post.likes[1].name} и еще ${post.likes.length - 2} человек`;
    }
    postHTML = `
<li class="post">
<div class="post-header" data-postId="${post.user.id}" >
    <img  src="${post.user.imageUrl}" class="post-header__user-image">
    <p class="post-header__user-name">${post.user.name}</p>
</div>
<div class="post-image-container">
  <img class="post-image" src="${post.imageUrl}">
</div>
<div class="post-likes">
  <button data-postId="${post.id}" class="like-button">
    <img src="./assets/images/like-active.svg">
  </button>
  <p class="post-likes-text">
  Нравится: <strong>${post.likes}</strong>
  </p>
</div>
<p class="post-text">
  <span class="user-name">${post.user.name}</span>
  ${post.description}
</p>
<p class="post-date">
  ${post.date}
</p>
</li>
`;
    postsHTML.innerHTML += postHTML;
  });

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
}
