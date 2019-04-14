/* global shoppingList, store, api */

$(document).ready(function(){
    BOOKMARKS.bindEventListeners();
  
    api.getBookmarks()
      .then((bookmarks) => {
        bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
        BOOKMARKS.render();
      })
      .catch(err => console.log(err.message));
  });
