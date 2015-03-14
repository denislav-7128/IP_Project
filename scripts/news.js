$(document).ready(function(){
	"use strict";

	var root = 'http://localhost:3000';


	function handleError(error) {
		console.error("error", error, arguments);
	}
/*
	function appendToList(list, post) {
		var newElement = $("<li/>");
		newElement.text(post.title + "  |  "+ post.id);
		// newElement.text(post.id);
		list.append(newElement);
	}
	
	function processResponse(response) {
		var list = $('ul#ul1');

		var i=0;
		$.each(response, function(){
			// response[i]
			console.log(this.title);
			appendToList(list, this);

			// if (++i >= 5) {
				// return false;
			// }

		});
	}
*/



	// List categories ---
		$.ajax({
			url: root + '/categories',
		  	method: 'GET'
		}).then(processCategoryResponse, handleError);


		function appendCatagory(list, post) {
			list = $("select#categories");
			var newElement = $("<option value="+post.id+">");

			newElement.text(post.name);
			
			list.append(newElement);
		}


		function processCategoryResponse(response) {
			var list = $('div.categories');
			
			$.each(response, function(){
				appendCatagory(list, this);
			});

		}

	// END of List categories ---






	// Add news ---
		$("button#button1").click(function() {
				
			$.ajax({
			  url: root + '/password',
			  method: 'GET'
			}).then(addNews);

		});


		function addNews(response) {
			var user_pass = prompt("Enter password", "");

			$.each(response, function(){
				
				if (user_pass == this.password) {
					
					var input_val = $("input#input1").val();
					
					var content_val = $("textarea#content").val();

					var category = $("select#categories").val();

					var url_val = $("input#add_news_url").val();

					// Insert news
					$.ajax('http://localhost:3000/news', {
			  			method: 'POST',
			  			data: {
			    			title: input_val,
			    			categoryId: category,
			    			content: content_val,
			    			url: url_val
			  			}
					}).then(function(data) {
			  			console.log(data);
					});


					// Empty the div
					$("div.news").empty();

					// Get the new list of news
					$.ajax({
						url: root + '/news',
						method: 'GET'
					}).then(processNewsResponse, handleError);

				} else {
					alert("Wrong password");
				}

			});
		}

	// END of Add news ---





	// List news ---

		$.ajax({
			url: root + '/news',
		  	method: 'GET'
		}).then(processNewsResponse, handleError);


		function processNewsResponse(response) {
			var list = $('div.news');

			var li_Element;
			var span_Element;
			var p_Element;
			var p2_Element;
			var img_Element;


			$.each(response, function(){

				// var newsId = this.id;
				var newsTitle = this.title;
				var categoryId = this.categoryId;
				var content = this.content;
				var image_url = this.url;

				$.ajax({
					url: root + '/categories/'+this.categoryId,
					method: 'GET'
				}).then(function(data) {

					var categoryName = data.name;

					list = $("div.news");		
					
					li_Element = $("<li/>");
					span_Element = $("<span id=news_title />");
					p_Element = $("<p id='news_content'/>");
					p2_Element = $("<p id='news_category'/>");
					img_Element = $("<img id='news_image' style='width:110px; height:100px' />");
					

					span_Element.text(newsTitle);
					p_Element.text(content);
					p2_Element.text("Category: "+categoryName);
					img_Element.prop("src", image_url);


					// Append elements
					list.append(span_Element);
					list.append(p2_Element);
					list.append(p_Element);

					if (image_url.length != 0) {
						list.append(img_Element);
					}

				});

			});
																		
		}

	// END of List news ---






// Delete and Edit news ---

		$.ajax({
			url: root + '/news',
		  	method: 'GET'
		}).then(processNewsEditResponse, handleError);


		var h=0;
		function appendNews(list, post) {

			list = $("div.edit_news select#news");

			var newElement = $("<option value="+post.id+">");
			newElement.text(post.title);
			list.append(newElement);
			
			// Delete and edit buttons
			h++;
			if (h==1) {
				list = $('div.edit_news');

				var newElement = $("<button id='edit' class='btn btn-default' style='margin-left: 10px;' title='Edit' > <img src='images/pencil.png'> </button>");
				list.append(newElement);

				var newElement = $("<button id='delete' class='btn btn-danger' style='margin-left: 10px;' title='Delete' >X</button>");
				list.append(newElement);
			}

		}


		function processNewsEditResponse(response) {
			var list = $('div.edit_news');

			var c=0;
			var last_id=0;
			$.each(response, function(){
				c++;
				last_id = this.id;
				appendNews(list, this);
			});


	
			// Delete news
			    var delete_button = $("button#delete");

				$(delete_button).on("click", function() { 

					$.ajax({
					  	url: root + '/password',
						method: 'GET'
					}).then(function (response){

						var user_pass = prompt("Enter password", "");

						$.each(response, function(){
								
							if (user_pass == this.password) {

								var val = $("div.edit_news select#news").val();
								console.log("Delete news with name="+ val);

								$.ajax({
									url: root + '/news/'+ val,
									method: 'DELETE'
								});

								//  ------------

					    		var currentOption = $("div.edit_news option[value='"+val+"']");
							    currentOption.remove();			
								$("div#edit_content_news").empty();
								$('select#categories').css("visibility","hidden");


						    } else {
								alert("Wrong password");
							}

						});
					
					});

				});


		}


});
