$(document).ready(function(){
	"use strict";

	var root = 'http://localhost:3000';


	function handleError(error) {
		console.error("error", error, arguments);
	}
/*
	function appendToList(list, post) {
		var newElement = $("<li/>");
		newElement.text(post.name + "  |  "+ post.id);
		// newElement.text(post.id);
		list.append(newElement);
	}
	
	function processResponse(response) {
		var list = $('ul#ul1');

		var i=0;
		$.each(response, function(){
			// response[i]
			console.log(this.name);
			appendToList(list, this);

			// if (++i >= 5) {
				// return false;
			// }

		});
	}
*/


	// Add category ---
		$("button#button1").click(function() {

			$.ajax({
			  url: root + '/password',
			  method: 'GET'
			}).then(addCategory);

		});


		function addCategory(response) {
			var user_pass = prompt("Enter password", "");

			$.each(response, function(){
				
				if (user_pass == this.password) {
					
					var input_val = $("input#input1").val();

					
					// Insert category
					$.ajax('http://localhost:3000/categories', {
			  			method: 'POST',
			  			data: {
			    			name: input_val
			  			}		  			
					}).then(function(data) {
			  			console.log(data);
					});


					// Empty the div
					$("div.categories select#categories").empty();


					// Get the new list of categories
					$.ajax({
						url: root + '/categories',
						method: 'GET'
					}).then(processCategoryResponse, handleError);

				} else {
					alert("Wrong password");
				}

			});
		}

	// END of Add category ---






	// List and Edit categories ---

		$.ajax({
			url: root + '/categories',
		  	method: 'GET'
		}).then(processCategoryResponse, handleError);



		var h=0;
		function appendCatagory(list, post) {
			list = $("div.categories select#categories");
			var newElement = $("<option value="+post.id+">");

			// newElement.text(post.name + "  |  "+ post.id);
			newElement.text(post.name);
			// newElement.value = post.id;
			// newElement.text(post.id);
			list.append(newElement);
			
			h++;
			if (h==1) {

				list = $('div.categories');

				// var newElement = $("<button class=delete id=del"+post.id+">X</button>");
				var newElement = $("<button class=delete >X</button>");
				list.append(newElement);

				// var newElement = $("<button class=edit id=edit"+post.id+">/</button>");
				var newElement = $("<button class=edit >/</button>");
				list.append(newElement);
			}

		}



		function processCategoryResponse(response) {
			var list = $('div.categories');

			var c=0;
			var last_id=0;
			$.each(response, function(){
				c++;
				last_id = this.id;
			
				appendCatagory(list, this);
			});

				
			// Delete category
			
		    var str1 = $("button.delete");

			$(str1).on("click", function() { 

				$.ajax({
				  	url: root + '/password',
					method: 'GET'
				}).then(function (response){


					var user_pass = prompt("Enter password", "");

					$.each(response, function(){
							
						if (user_pass == this.password) {


							var val = $("div.categories select#categories").val();
							// alert(val);
							console.log("Delete cat with name="+ val);


							$.ajax({
								url: root + '/categories/'+ val,
								method: 'DELETE'
							});

							//  ------------

				    		var str3 = $("div.categories option[value='"+val+"']");
						    str3.remove();				


					    } else {
							alert("Wrong password");
						}

					});
				
				});

			});


		// Edit category
		    var str1 = "button.edit";

			$(str1).on("click", function() {

				var val = $("div.categories select#categories").val();
				// console.log("Edit cat with name="+ val);


				$.ajax({
				  url: root + '/categories/'+val,
				  method: 'GET'
				}).then(function(data) {

					var categoryName = data.name;


					var list = $('div.categories');

					var newElement = $("<input value="+categoryName+" class='editCategoryField' >");
					var newElement2 = $("<input type=button value=save class=saveEdit >");
					// newElement.value(e.data.name);
					// newElement.value = val;
					// newElement.text(post.id);
					list.append(newElement);
					list.append(newElement2);


					$("input.saveEdit").on("click", function() {
				
						$.ajax({
				  			url: root + '/password',
							method: 'GET'
						}).then(function (response){


							var user_pass = prompt("Enter password", "");

							$.each(response, function(){
							
								if (user_pass == this.password) {



									var newVal = $("input.editCategoryField").val();
						

									// Insert edited category
									$.ajax({
										url: root + '/categories/'+data.id,
							  			method: 'PUT',
							  			data: {
							    			name: newVal,
							    		}
						
									}).then(function(data) {
										console.log(data);

										// Empty the div
										$("div.categories select#categories").empty();


										// Get the new list of categories
										$.ajax({
											url: root + '/categories',
											method: 'GET'
										}).then(processCategoryResponse, handleError);

									});

							    } else {
									alert("Wrong password");
								}


							});
						
						});
					});


				});

			});			
		
	}


	// END of List and Edit categories ---
		




});