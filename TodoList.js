/*
 * Author: noob247365
 * Date Modified: 2016/02/14
 * File: TodoList.js
 * Description: Managing the todo list functionality in one place
 */

var TodoList = function(creation_callback) {
    // For easier lookup and consistency for DOM elements
    this.uuid = 1;
    
    // Use to create an element visually
    // Form: new_item => void
    this.cb = (typeof creation_callback == "function") ? creation_callback : false;
    
    // Storage
    this.items = [];
    
    // PRIVATE METHOD
    // Creates, and adds, a new item to the list
    // No error checking done
    var create = function(self, title, completed, id) {
        // Create the data object
        var item = {
            // How the user typed it (the first time)
            value: title,
            
            // In lowercase, for searching case-insensitive
            valueL: title.toLowerCase(),
            
            // Completion status
            completed: completed,
            
            // UUID for better lookup options
            uuid: id,
        };
        
        // Add to storage
        self.items.push(item);
        
        // If callback given, call with new item
        if (self.cb) {
            self.cb(item);
        }
    };
    
    // Find index of item based on title or uuid
    // (title or uuid) => SUCCESS
    this.find = function(key) {
        // Searching for TITLE (given as string)
        if (typeof key == "string") {
            // Format search term
            key = key.trim().toLowerCase();
            
            // No empty strings allowed
            if (key.length == 0) {
                return -1;
            }
            
            // Search for the item with matching 'valueL' property
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].valueL == key) {
                    return i;
                }
            }
            
            // Not found
            return -1;
        } else
        
        // Searching for UUID (given as positive integer)
        if (typeof key == "number") {
            // Verify positive integer
            if (key <= 0 || key != Math.floor(key)) {
                return -1;
            }
            
            // Search for the item with matching 'uuid' property
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].uuid == key) {
                    return i;
                }
            }
            
            // Not found
            return -1;
        }
        
        // Invalid search parameter
        return -1;
    };
    
    // Adds an item
    // Handles error checking
    // (title, completed, id) => SUCCESS
    this.add_item = function(title, completed, id) {
        // Validate title
        title = (typeof title == "string") ? title.trim() : "";
        
        // Only allow non-empty titles
        if (title.length == 0) {
            return false;
        }
        
        // No duplicates
        if (this.find(title) > -1) {
            return false;
        }
        
        // Give default value to completed: false
        completed = (typeof completed == "boolean") ? completed : false;
        
        // Give default value to id: this.uuid [and increment it]
        id = (typeof id == "number" && id > 0 && id == Math.floor(id)) ? id : this.uuid++;
        
        // Create the item
        create(this, title, completed, id);
        
        // Success
        return true;
    };
    
    // Remove and item
    // (title or uuid) => SUCCESS
    this.remove_item = function(key) {
        // Find the location (handles title vs uuid)
        var loc = this.find(key);
        
        // Can't remove if not found
        if (loc < 0) {
            return false;
        }
        
        // Remove
        this.items.splice(loc, 1);
        
        // Success
        return true;
    };
    
    // Stores if localStorage is usable
    // Source: http://stackoverflow.com/a/11214467
    var storage_enabled = (function() {
        var tes = "testing_purposes";
        try {
            localStorage.setItem(tes, tes);
            localStorage.removeItem(tes);
            return true;
        } catch(e) {
            return false;
        }
    })();
    
    // Save to localStorage
    // (storage_key) => SUCCESS
    this.save_storage = function(key) {
        // No localStorage means no saving
        if (!storage_enabled) {
            return false;
        }
        
        // Make sure this doesn't break
        try {
            // Store to localStorage with the given key
            localStorage.setItem(key, JSON.stringify(this.items));
            
            // Store the uuid
            localStorage.setItem(key + "_uuid", this.uuid);
            
            // Success
            return true;
        }
        
        // Error
        catch(e) {
            return false;
        }
    };
    
    // Load from localStorage
    // (storage_key) => SUCCESS
    this.load_storage = function(key) {
        // No localStorage means no loading
        if (!storage_enabled) {
            return false;
        }
        
        // Don't break the code
        try {
            // Read from localStorage
            var items = localStorage.getItem(key);
            
            // No previous value -> not a string
            if (typeof items != "string") {
                return false;
            }
            
            // Parse to a variable
            items = JSON.parse(items);
            
            // Make sure if was an array
            if (!(items instanceof Array)) {
                return false;
            }
            
            // Clear out the items
            this.items.slice(0, this.items.length);
            
            // Add each item from the stored list
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                this.add_item(item.value, item.completed, item.id);
            }
            
            // Load the uuid
            this.uuid = parseInt(localStorage.getItem(key + "_uuid"));
            
            // Success, presumably
            return true;
        }
        
        // Error
        catch(e) {
            return false;
        }
    };
};