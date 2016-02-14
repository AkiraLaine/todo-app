$(function() {
    function delete_item() {
        var $item = $(this);
        $item = $item.parents(".item");
        remove_item($item.find(".item-left").text());
        $item.remove();
    }
    
    var todo_items = [];
    var hasStorage = typeof window.localStorage !== "undefined";
    function preload() {
        if (hasStorage) {
            var items = localStorage.getItem("items");
            if (items && items.length > 0) {
                var items = JSON.parse(items);
                for (var i = 0; i < items.length; i++) {
                    todo_items.push(items[i]);
                    add_item(items[i], true);
                }
            } else {
                localStorage.setItem("items", JSON.stringify(todo_items));
            }
        }
    }
    function save_item(item) {
        if (hasStorage) {
            todo_items.push(item);
            localStorage.setItem("items", JSON.stringify(todo_items));
        }
    }
    function remove_item(item) {
        if (hasStorage) {
            var loc = todo_items.indexOf(item);
            if (loc >= 0) {
                todo_items.splice(loc, 1);
                localStorage.setItem("items", JSON.stringify(todo_items));
            }
        }
    }
    
    var $items = $("#items");
    var $amount = $("#amt");
    var item_temp = $("#item-temp").html();
    function add_item(title,once) {
        var item = item_temp.replace("{{ title }}", title);
        var $item = $(item);
        $item.find(".btn-delete").on("click", delete_item);
        $items.append($item);
        if (once != true) {
            save_item(title);
        }
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
