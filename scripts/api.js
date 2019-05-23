'use strict';
// first, I will set up my api

const api = (function(){
  const baseUrl = 'https://thinkful-list-api.herokuapp.com/hc';

  const errorHandleFetch = function(...args) {
    let error;
    return fetch(...args)
      .then(res => {
        // check to make sure response is okay (in the 200s)
        if (!res.ok) {
          error = { code: res.status };
          // if we are not returned a json object back, we reject the promise and this status text is added to our error object, created above
          if (!res.headers.get('content-type').includes('json')) {
            error.message = res.statusText;
            return Promise.reject(error);
          }
        }
        return res.json();
      })
      .then(data => {
        // if there was an error before, we place the message in our error object with the status of the error
        if (error) {
          error.message = data.message;
          return Promise.reject(error);
        }
        // if no problems, return our json object as per usual
        return data;
      });
  };
  const getBookmarks = function() {
    return errorHandleFetch(`${baseUrl}/bookmarks`);
  };

  const createItem = function(title, url, desc, rating) {
    const newItem = JSON.stringify({ title, url, desc, rating });
    console.log(newItem);
    return errorHandleFetch(`${baseUrl}/bookmarks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: newItem
    });
  };
  // update Data might have a description change OR a rating change
  const editItem = function(id, updateData) {
    const newData = JSON.stringify(updateData);
    return errorHandleFetch(`${baseUrl}/bookmarks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: newData
    });
  };

  const deleteItem = function(id) {
    return errorHandleFetch(`${baseUrl}/bookmarks/${id}`, {
      method: 'DELETE'
    });
  };

  return {
    errorHandleFetch,
    getBookmarks,
    createItem,
    deleteItem,
    editItem
  };
}());
