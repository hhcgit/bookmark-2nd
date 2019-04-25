'use strict';

// { id:cuid(), title, url, description, rating, expanded:false, isEditing:false }

const api = (function() {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/hc';

  function createBookmark(title, url, desc, rating) {
    let newBookmark = {
      title,
      url,
      desc,
      rating,
    };

    newBookmark = JSON.stringify(newBookmark);

    return bookmarksApiFetch(BASE_URL + '/bookmarks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: newBookmark
    });
  }

  function readBookmarks() {
    return bookmarksApiFetch(BASE_URL + '/bookmarks');
  }

  function updateBookmark(id, updateData) {
    let data = JSON.stringify(updateData);

    return bookmarksApiFetch(`${BASE_URL}/bookmarks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    });
  }

  function deleteBookmark(id) {
    return bookmarksApiFetch(`${BASE_URL}/bookmarks/${id}`, {
      method: 'DELETE'
    });
  }

  function bookmarksApiFetch(...args) {
    let error;

    return fetch(...args)
      .then(response => {
        if(!response.ok) {
          error = { code: response.status };
        }

        return response.json();
      })
      .then(data => {
        if(error) {
          error.message = data.message;
          return Promise.reject(error);
        }

        return data;
      });
  }

  return {
    createBookmark,
    readBookmarks,
    updateBookmark,
    deleteBookmark
  };
}());