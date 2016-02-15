/*
 * Authors: noob247365, AkiraLaine
 * Contributors: joshuagollaher
 * Date Modified: 2016/02/14
 * File: main.js
 * Description: Handling the DOM interaction
 */

$(function() {
    function delete_item() {
        var $item = $(this);
        $item = $item.parents(".item");
        remove_item($item.find(".item-left").text());
        $item.remove();
    }
    
    var todo_items = [];
    var hasStorage = typeof window.localStorage !== "undefined";
    function find_item(title) {
        return todo_items.map(item => item.valueL).indexOf(title.toLowerCase());
    }
    function preload() {
        if (hasStorage) {
            var items = localStorage.getItem("items");
            if (items && items.length > 0) {
                var items = JSON.parse(items);
                for (var i = 0; i < items.length; i++) {
                    add_item(items[i].value, items[i]);
                }
            } else {
                localStorage.setItem("items", JSON.stringify(todo_items));
            }
        }
    }
    function create_item(title, completed) {
        return {
            value: title,
            valueL: title.toLowerCase(),
            completed: completed || false
        };
    }
    function save_item(item) {
        if (hasStorage) {
            todo_items.push(item);
            localStorage.setItem("items", JSON.stringify(todo_items));
        }
    }
    function remove_item(title) {
        if (hasStorage) {
            var loc = find_item(title);
            if (loc >= 0) {
                todo_items.splice(loc, 1);
                localStorage.setItem("items", JSON.stringify(todo_items));
            }
        }
    }
    
    var $items = $("#items");
    var item_temp = $("#item-temp").html();
    function add_item(title,obj) {
        if (find_item(title) > -1) { return; }
        obj = obj || create_item(title, false);
        var item = item_temp.replace("{{ title }}", title);
        var $item = $(item);
        $item.find(".btn-delete").on("click", delete_item);
        $items.append($item);
        save_item(obj);
    }
    preload();
    
    var $input = $("#input");
    var $inputBtn = $("#input-btn");
    
    function handle_input() {
        var text = $input.val().trim();
        $input.val("");
        if (text.length > 0) {
            add_item(text);
        }
        $input.focus();
    }
    
    $inputBtn.on('click', handle_input);
    $input.on("keypress", function(e){
        if(e.which == 13) {
            handle_input();
            return false;
        }
    });
    
});
