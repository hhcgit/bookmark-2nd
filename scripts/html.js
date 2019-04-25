'use strict';

/* global store */

const htmlGenerators = ( function() {

  function generateControlElementString() {
    const options = generateOptionsByRating(store.minRating);

    if(store.isAdding){
      return `
        <form class="add-bookmark-form js-add-bookmark-form" >
          <h3 class="add-bookmark-heading">Add Bookmark</h3>
          <label for="add-bookmark-title-input">Title:</label>
          <input type="text" name="Title" id="add-bookmark-title-input" placeholder="ex. Google" required>
          <label for="add-bookmark-url-input">URL:</label>
          <input type="url" name="URL" id="add-bookmark-url-input" placeholder="https://" required>
          <label for="add-bookmark-desc-textarea">Description:</label>
          <textarea name="Description" id="add-bookmark-desc-textarea"></textarea>
          <label for="add-bookmark-rating-dropdown">Rating:</label>
          <select name="Rating" class="dropdown rating-select-dropdown" id="add-bookmark-rating-dropdown" aria-label="Select Rating">
            <option value="" disabled selected hidden>Select Rating</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <button type="reset" class="button btn-add-cancel js-add-form-cancel">Cancel</button>
          <button type="submit" class="button btn-add-submit js-bookmark-submit">Submit</button>
        </form>`;
    } else {
      return `
        <form class="controls-form js-controls-form" >
        <button class="button btn-add-form-show js-add-form-show" aria-label="Add Bookmark">Add</button>
        <select name="rating-filter-select" class="dropdown rating-filter-dropdown js-rating-filter" aria-label="Filter by Minimum Rating">
          ${options}
        </select>
        </form>`;
    }
  }

  function generateOptionsByRating(rating) {
    let selectedDefault = '', selected5='', selected4='', selected3='', selected2='', selected1='';

    switch(rating) {
      case 5:
        selected5 = 'selected';
        break;
      case 4:
        selected4 = 'selected';
        break;
      case 3:
        selected3 = 'selected';
        break;
      case 2:
        selected2 = 'selected';
        break;
      case 1:
        selected1 = 'selected';
        break;
      default:
        selectedDefault = 'selected';
    }


    return `
      <option value="" disabled ${selectedDefault} hidden>Select Rating</option>
      <option value="5" ${selected5}>5 Stars</option>
      <option value="4" ${selected4}>4 Stars</option>
      <option value="3" ${selected3}>3 Stars</option>
      <option value="2" ${selected2}>2 Stars</option>
      <option value="1" ${selected1}>1 Star</option>`;
  }

  function generateBookmarkElement(bookmark) {
    let headerTitle = '<div class="bookmark-item-header js-bookmark-item-header" tabindex="0">';
    let bodyTitle = '<form class="expanded-info">';

    let enableDescEdit = 'readonly';

    let buttons = `
      <button type="button" class="button btn-edit js-edit">Edit</button>
      <button type="button" class="button btn-remove js-remove">Remove</button>
      <button type="button" class="button btn-visit js-visit">Visit</button> `;

    let bookmarkHeaderInner = `
      <h4 class="bookmark-item-title">${bookmark.title}</h4>
      <span class="bookmark-item-rating">Rating: ${bookmark.rating} ${bookmark.rating === 1 ? 'Star&nbsp&nbsp;' : 'Stars'}</span>`;
    
    if(bookmark.isEditing) {
      headerTitle = `<form class="js-edit-form">
                       <div class="bookmark-item-header">`;
      bodyTitle = '';
      enableDescEdit = '';
      const options = generateOptionsByRating(Number(bookmark.rating));

      bookmarkHeaderInner = `
        <h4 class="bookmark-item-title">${bookmark.title}</h4>
        <select name="Rating" class="dropdown edit-rating-dropdown js-edit-rating" aria-label="Select Rating">
          ${options}
        </select>`;

      buttons = `
        <button type="reset" class="button btn-remove js-edit-cancel">Cancel</button>
        <button type="submit" class="button btn-edit js-edit-submit">Submit</button>`;
    }

    const bookmarkHeader = `
      <li class="js-bookmark-item" data-item-id="${bookmark.id}">
        ${headerTitle}
            ${bookmarkHeaderInner}
          </div>`;

    let bookmarkBody = '';

    if(bookmark.expanded) {
      bookmarkBody = `
        ${bodyTitle}
          <textarea name="Description" class="js-expanded-desc" cols="30" rows="3" ${enableDescEdit}>${bookmark.desc}</textarea>
          <div class="expanded-controls">
            ${buttons}                  
          </div>
        </form>`;
    }

    return bookmarkHeader + bookmarkBody + '</li>';
  }

  function generateBookmarksListString(bookmarksArray) {
    const bookmarksStringArray = bookmarksArray.map( bookmark => generateBookmarkElement(bookmark) );
    return bookmarksStringArray.join('');
  }

  return {
    generateControlElementString,
    generateBookmarksListString
  };
}());