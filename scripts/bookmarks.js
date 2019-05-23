'use strict';
// store IIFE
/* global $ */
/* global storage */
const bookmarks = (function(){
  
  function generateError(message) {
    return `
    <span class = "error-content">${message}</span>
    `;
  }

  function generateBookmarkElement(item) {
    let itemTitle = `<h3 class = 'bookmark'>Bookmark: ${item.title}</h3><h4 class = 'js-edit-field'>Rating: ${item.rating}</h4>`;
    if (item.expanded) {
      itemTitle = `${itemTitle}
      <p class = 'js-edit-field'><b>Description:</b> ${item.desc}</p>
      <a href = ${item.url} class = 'visit-url-link'> Visit the site here!</a>
      `;}
    if (item.isEditing) {
      itemTitle = `
      <form role = "form" class = "edit-submit-form">
      <h3 aria-label = "Bookmark" class = 'bookmark'>Bookmark: ${item.title}</h3>
      <label for="rating"><b>Rating: </b></label>
      <input name ="rating" type = "number" value = ${item.rating} class = 'js-edit-rating'/><br>
      <label for="description"><b>Description: </b></label>
      <input name ="description" type = "text" class = 'js-edit-description' value = "${item.desc}"/><br>
      <button type = "submit" class = "js-edit-submit-btn">Submit Edits</button>
      </form>
      `;
    } 
    return `
    <li class="js-bookmark-element" id = ${item.id}>
    ${itemTitle}
    <div class="bookmark-inputs">
        <button class="button js-bookmark-edit">
          <span class="button-label">Edit</span>
        </button>
        <button class=" button js-bookmark-delete">
          <span class="button-label">Delete</span>
        </button>
        <button class=" button js-bookmark-expand">
          <span class="button-label">Expand</span>
        </button>
      </div>
    </li>
    `;
  }

  function generateBookmarkItemsString(bookmarks) {
    const items = bookmarks.map((item) => generateBookmarkElement(item));
    return items.join('');
  }

  function renderError() {
    // eslint-disable-next-line no-empty
    if (storage.error) {
      const newError = generateError(storage.error);
      $('.error-container').html(newError);
      setTimeout(function() {
        $('.error-container').empty();
        storage.error = null;
      }, 3000);
    } else {
      $('.error-container').empty();
    }
  }
  
  function render() {
    let items = storage.items;
    if(storage.adding === true) {
      $('.js-input').replaceWith(
        `
    <form role = "form" class="js-add-bookmark js-input">
      <label for="title">Title: </label>
      <input type="text" name="title" class="title" placeholder="Website Name">
      <label for="rating">Rating: </label>
      <input type="number" name="rating" class="rating" placeholder="Website Rating">
      <label for="url">URL: </label>
      <input type="text" name="url" class="url" placeholder="https://www.google.com">
      <label for="description">Description: </label>
      <textarea class = "description" name="description" cols="40" rows="5" placeholder="Enter a description for your bookmark"></textarea> 
      <section class="js-input">
        <button type = "submit" class = "button js-submit-btn">Submit Bookmark</button>
        <button type = "reset" class = "button js-reset-btn">Reset</button>
        <button type = "button" class = "button js-cancel-btn">Cancel</button>
      </section>
    </form>`
      );
    } else {
      $('.js-input').replaceWith(`
      <section class="js-input">
        <button type = "button" class = "button js-add-btn">Add Bookmark</button>
        <label for="dropdown"></label>
        <select id="dropdown" name="ratings" class="button js-ratings-select">
          <option selected disabled>Sort by Ratings</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </section>
        `
      );
    }
    let filteredItems = storage.sortFilter(storage.sortNumber);
    if (storage.sortNumber) {
      const bookmarkListString = generateBookmarkItemsString(filteredItems);
      return $('.bookmark-list').html(bookmarkListString);
    }
    console.log('ran');
    const bookmarkListString = generateBookmarkItemsString(items);
    $('.bookmark-list').html(bookmarkListString);
  }


  function handleAddBookmark() {
    $('body').on('click', '.js-add-btn', function(event) {
      storage.addingBookmark();
      render();
    });
  }

  function handleFormSubmit() {
    // event delegation because we are creating the form from scratch
    $('body').on('submit', '.js-add-bookmark', function(event) {
      event.preventDefault();
      const title = $('.title').val();
      const rating = $('.rating').val();
      const url = $('.url').val();
      const description = $('.description').val();

      api.createItem(title, url, description, rating)
        .then((newItem) => {
          storage.addItem(newItem);
          console.log(newItem);
          
          render();
        })
        .catch(err => {
          storage.setError(err.message);
          renderError();
        });
    });
  }

  function getItemId(item) {
    return $(item).closest('.js-bookmark-element').attr('id');
  }

  function handleExpandBookmark() {
    $('body').on('click', '.js-bookmark-expand', function(event) {
      const id = getItemId(event.currentTarget);
      let item = storage.findById(id);
      console.log(item);
      storage.expandBookmark(id);
      generateBookmarkElement(item);
      render();
    });
  }

  function handleCancelButton() {
    $('body').on('click', '.js-cancel-btn', function(event) {
      storage.addingBookmark();
      render();
    });
  }

  function handleDeleteItem() {
    $('body').on('click', '.js-bookmark-delete', function(event) {
      const id = $(event.currentTarget).closest('.js-bookmark-element').attr('id');
      api.deleteItem(id)
        .then(() => {
          storage.findAndDelete(id);
          render();
        })
        .catch(err => {
          storage.setError(err.message);
          renderError();
        });
    });
  }

  function handleEditBookmark() {
    $('body').on('click', '.js-bookmark-edit', function(event){
      const id = getItemId(event.currentTarget);
      const item = storage.findById(id);
      // item[0].expanded = true;
      storage.editBookmark(id);
      storage.expandBookmark(id);
      console.log(item);
      render();
    });
  }

  function handleEditSubmit() {
    $('body').on('click', '.js-edit-submit-btn', function(event) {
      event.preventDefault();
      const id = getItemId(event.currentTarget);
      const newRating = $('.js-edit-rating').val();
      const newDesc = $('.js-edit-description').val();
      const updatedData = { rating: newRating, desc: newDesc };
      api.editItem(id, updatedData)
        .then(() => {
          Object.assign(updatedData, { isEditing: false });
          console.log(updatedData);
          storage.updateBookmark(id, updatedData);
          render();
        })
        .catch(error => {
          storage.setError(error.message);
          renderError();
        });
    });
  }

  function handleSort() {
    $('body').on('change', '.js-ratings-select', function(event) {
      const sortNumber = parseInt($('.js-ratings-select option:selected').text());
      console.log(sortNumber);
      storage.sortFilter(sortNumber);
      console.log(storage.sortNumber);
      render();
      $('.js-ratings-select').val(sortNumber);
    });
  }

  function bindEventListeners() {
    handleAddBookmark();
    handleFormSubmit();
    handleCancelButton();
    handleDeleteItem();
    handleExpandBookmark();
    handleSort();
    handleEditBookmark();
    handleEditSubmit();
  }

  return {
    bindEventListeners,
    render,
    generateError,
    renderError
  };
}());
