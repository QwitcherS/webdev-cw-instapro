import { now } from "./index.js";

const personalKey = "ramzil-khalimov";
const baseHost = "https://wedev-api.sky.pro";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((responseData) => {
      const appPosts = responseData.posts.map((post) => {
        const user = post.user;
        const likes = post.likes;
        return {
          id: post.id,
          imageUrl: post.imageUrl,
          createdAt: now(post.date),
          description: post.description,
          user: {
            id: user.id,
            name: user.name,
            login: user.login,
            imageUrl: user.imageUrl,
          },
          likes: [
            {
              id: user.id,
              name: user.name,
            },
          ],
          isLiked: false,
        };
      });

      return appPosts;
    });
}
export function getUserPosts({ userId, token }) {
  return fetch(postsHost + `/user-posts/${userId}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw Error('Ошибка');
      }
    })
    .then((data) => {
      return {
        user: data.user,
        posts: data.posts,
      }
    });
}
export function addPosts(description, imageUrl, token) {
  //const token = localStorage.getItem('token');
  return fetch(postsHost, {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: JSON.stringify({
      description: description,
      imageUrl: imageUrl,
    }),

  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Ошибка в добавлении");
    }
    return response.json();
  });
};

// https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md#%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%D1%81%D1%8F
export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
};
export const likeApi = ({ postId, token }) => {
  return fetch(`${postsHost}/${postId}/like`,
    {
      method: "POST",
      headers: {
        Authorization: token,
      }
    })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw Error('Лайк не поставлен')
      }
    });
};

export const dislikeApi = ({ postId, token }) => {
  return fetch(`${postsHost}/${postId}/dislike`,
    {
      method: "POST",
      headers: {
        Authorization: token,
      }
    })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw Error('Лайк не поставлен')
      }
    });
};

