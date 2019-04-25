'use strict';

/* global store, api, htmlGenerators */
// bookmarkItem = { id:cuid(), title, url, description, rating, expanded:false, isEditing:false }

const bookmarksList = ( function() {
  
  function render() {
    let bookmarks = [...store.bookmarks];
    if(store.minRating) {
      bookmarks = bookmarks.filter(bookmark => bookmark.rating <= store.minRating);
    }

    const controlsString = htmlGenerators.generateControlElementString();
    const bookmarksListString = htmlGenerators.generateBookmarksListString(bookmarks);

    $('.js-controls-container').html(controlsString);
    $('.js-bookmarks-list').html(bookmarksListString);
  }

  function handleAddFormShow() {
    $('.js-controls-container').on('click', '.js-add-form-show', event => {
      event.preventDefault();
      store.setAdding(true);
      render();
    });
  }

  function handleAddFormHide() {
    $('.js-controls-container').on('click', '.js-add-form-cancel', event => {
      event.preventDefault();
      store.setAdding(false);
      render();
    });
  }

  function handleNewBookmarkSubmit() {
    $('.js-controls-container').on('submit', '.js-add-bookmark-form', event =>{
      event.preventDefault();
      const bmTitle = $('#add-bookmark-title-input').val();
      const bmUrl = $('#add-bookmark-url-input').val();
      const bmDesc = $('#add-bookmark-desc-textarea').val();
      let bmRating = $('#add-bookmark-rating-dropdown').val();
      if(!bmRating) bmRating = 5;

      $('.js-add-bookmark-form')[0].reset();
      
      api.createBookmark(bmTitle, bmUrl, bmDesc, bmRating)
        .then((newBookmark) => {
          store.addBookmark(newBookmark);
          store.setAdding(false);
          render();
        })
        .catch((err) => {
          alert('error ' + err.message);
        });
    });
  }

  function handleFilterByMinRating() {
    $('.js-controls-container').on('change', '.js-rating-filter', () => {
      const filterRating = Number($('.js-rating-filter').val());
      store.setMinRating(filterRating);
      render();
    });
  }

  function getItemIdfromElement(bookmark) {
    return $(bookmark)
      .closest('.js-bookmark-item')
      .data('item-id');
  }

  function handleBookmarkItemExpandToggle() {
    $('.js-bookmarks-list').on('click', '.js-bookmark-item-header', event =>{
      const id = getItemIdfromElement(event.currentTarget);
      const bookmark = store.findById(id);

      if(bookmark.expanded && !bookmark.isEditing) {
        store.setBookmarkExpanded(id, !bookmark.expanded);
      } else {
        store.setBookmarkExpanded(id, true);
      }

      render();
    });
  }

  function handleBookrmarkItemExpandToggleKeypress() {
    $('.js-bookmarks-list').on('keypress', '.js-bookmark-item-header', event => {
      const key = event.which;
      if(key === 13) {
        event.currentTarget.click();
        return false;
      }
    });
  }

  function handleBookmarkVisit() {
    $('.js-bookmarks-list').on('click', '.js-visit', event => {
      event.preventDefault();
      const id = getItemIdfromElement(event.currentTarget);
      const item = store.findById(id);
      const url = item.url;
      
      window.open(url, '_blank');
    });
  }

  function handleBookmarkRemove() {
    $('.js-bookmarks-list').on('click', '.js-remove', event => {
      event.preventDefault();
      const id = getItemIdfromElement(event.currentTarget);

      api.deleteBookmark(id)
        .then(() => {
          store.findAndDelete(id);
          render();
        });
    });
  }

  function handleBookmarkEditClicked() {
    $('.js-bookmarks-list').on('click', '.js-edit', event => {
      event.stopPropagation();
      const id = getItemIdfromElement(event.currentTarget);
      store.setBookmarkIsEditing(id, true);
      render();
    });
  }

  function handleBookmarkEditSubmit() {
    $('.js-bookmarks-list').on('click', '.js-edit-submit', event => {
      event.preventDefault();

      const id = getItemIdfromElement(event.currentTarget);
      const newDesc = $('.js-expanded-desc').val();
      let newRating = $('.js-edit-rating').val();

      const newData = {
        desc: newDesc,
        rating: newRating
      };
      api.updateBookmark(id, newData)
        .then(() => {
          store.findAndUpdate(id, newData);
          store.setBookmarkIsEditing(id, false);
          render();
        })
        .catch((err) =>{
          alert('error' + err.message);
        });
    });
  }

  function handleBookmarkEditCancel() {
    $('.js-bookmarks-list').on('click', '.js-edit-cancel', event => {
      event.stopPropagation();
      const id = getItemIdfromElement(event.currentTarget);
      store.setBookmarkIsEditing(id, false);
      render();
    });
  }

  function bindEventListeners() {
    handleAddFormShow();
    handleAddFormHide();
    handleNewBookmarkSubmit();
    handleFilterByMinRating();
    handleBookmarkItemExpandToggle();
    handleBookrmarkItemExpandToggleKeypress();
    handleBookmarkVisit();
    handleBookmarkRemove();
    handleBookmarkEditClicked();
    handleBookmarkEditSubmit();
    handleBookmarkEditCancel();
  }

  return {
    bindEventListeners,
    render
  };
}());