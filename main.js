/*
 * Authors: noob247365, AkiraLaine
 * Contributors: joshuagollaher
 * Date Modified: 2016/02/14
 * File: main.js
 * Description: Handling the DOM interaction
 */

// Execute on document.ready
$(function() {
	// Create the todo list object
	var todo_list = new TodoList(cb_create_item);

	// Key for localStorage
	var storage_key = "todo_list";

	// DOM cache
	var $item = $(".item");
	var $items = $("#items");
	var item_template = $("#item-temp").html();
	var $input = $("#input");
	var $inputBtn = $("#input-btn");

	// CALLBACK: Create item, given an item object
	function cb_create_item(obj) {
		// Create a new jQuery handlable node from data
		var $item = $(item_template.replace("{{ title }}", obj.value));

		// Add the uuid data attribute
		$item.data("uuid", obj.uuid);

		// Add the event listener for deletion
		$item.find(".btn-delete").on("click", h_delete_item);

		if(obj.completed){
			$item.children(".item-left").addClass("completed");
		}

		// Append to items holder
		$items.append($item);

		$(".item-left").on("click", function(e){
			e.stopImmediatePropagation()
			if(!$(this).hasClass("completed")){
				$(this).addClass("completed");
				var uuid = parseInt($item.data("uuid"));
				todo_list.update_status(uuid, true);
				todo_list.save_storage(storage_key);
			} else {
				$(this).removeClass("completed");
				var uuid = parseInt($item.data("uuid"));
				todo_list.update_status(uuid, false);
				todo_list.save_storage(storage_key);
			}
		});

		$(".btn-sub").on("click", function(){
			$(".sub-group").hide();
			$(this).parent().siblings(".sub-group").show();
		})

		$(".sub-input-btn").on("click", function(e){
			e.stopImmediatePropagation()
			var subItem = "<li>" + $(this).parent().siblings("#sub-input").val() + "</li>";
			$(this).parents(".item").children("#hidden-tasks").append(subItem);
			$(this).parent().siblings("#sub-input").val("");
			$("#hidden-tasks").show();
		})
	}

	// HANDLER: Delete the item
	function h_delete_item() {
		// Grab the whole item
		var $item = $(this).parents(".item");

		// Delete from the todo list based on uuid
		try {
			// Get the uuid
			var uuid = parseInt($item.data("uuid"));

			// Remove from the todo list
			todo_list.remove_item(uuid);
		}

		// Error, delete based on title
		catch(e) {
			// Get the title
			var title = $item.find(".item-left").text();

			// Remove from the todo list
			todo_list.remove_item(title);
		}

		// Save the new list
		todo_list.save_storage(storage_key);

		// Remove from the DOM
		$item.remove();
	}

	// Add an item to the todo list (will call the create_item callback)
	function add_item(title) {
		// Add to the todo list
		todo_list.add_item(title);

		// Save the new list
		todo_list.save_storage(storage_key);
	}

	// HANDLER: Try to add based on input
	function h_add_item() {
		// Get the input
		var text = $input.val().trim();

		// Clear input
		$input.val("");

		// Only allow non-empty input
		if (text.length > 0) {
			// Add the item
			add_item(text);
		}

		// Focus on input
		$input.focus();
	}

	// Add input handler to input button
	$inputBtn.on("click", h_add_item);

	// Allow for enter-to-submit on input field
	$input.on("keypress", function(e) {
		// When pressing enter
		if (e.which == 13) {
			// Handle input
			h_add_item();

			// Prevent default
			e.preventDefault();
			return false;
		}
	});

	// Load from storage
	if (!(todo_list.load_storage(storage_key))) {
		// Save default todo list
		todo_list.save_storage(storage_key);
	}
});
