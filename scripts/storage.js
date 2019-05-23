'use strict';

const storage = (function() {

  let items = [];
  let adding = false;
  let sortNumber = null;
  let error = null;

  const setError = function(error) {
    this.error = error;
  };

  const addItem = function(item) {
    const obj = Object.assign(item, { expanded: false, isEditing: false });
    this.items.push(obj);
  };

  const findById = function(id) {
    return this.items.find(item => item.id === id);
  };

  const findAndDelete = function(id) {
    this.items = this.items.filter(item => item.id !== id);
  };

  const sortFilter = function(num) {
    this.sortNumber = num;
    return this.items.filter(item => item.rating >= num);
  };

  const addingBookmark = function() {
    this.adding = !this.adding;
  };

  const expandBookmark = function(id) {
    const item = this.findById(id);
    item.expanded = !item.expanded;
  };

  const editBookmark = function(id) {
    const item = this.findById(id);
    item.isEditing = !item.isEditing;
  };

  const updateBookmark = function(id, updateData) {
    const item = this.findById(id);
    Object.assign(item, updateData);
  };


  return {
    setError,
    addItem,
    error,
    findById,
    findAndDelete,
    sortFilter,
    addingBookmark,
    expandBookmark,
    editBookmark,
    updateBookmark,
    items,
    adding,
    sortNumber
  };
}());
