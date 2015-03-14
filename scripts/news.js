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






			// Edit news
			    var edit_button = "button#edit";

				$(edit_button).on("click", function() {

					var val = $("div.edit_news select#news").val();
					console.log("Edit news with name="+ val);

					$.ajax({
					  url: root + '/news/'+val,
					  method: 'GET'
					}).then(function(data) {

					var titleName = data.title;
					var categoryId = data.categoryId;
					var content_val = data.content;
					var url_val = data.url;


					// Clear the div for each button press
					$("div#edit_content_news").empty();
					var c=0;


					// Get category Name from category Id
					$.ajax({
						url: root + '/categories',
			  			method: 'GET'
					}).then(function(response){

						$.each(response, function(list,post){

							console.log(post.name);
							console.log(post.id);
						
							var categoryName = post.name;


							var list = $('div#edit_content_news select#categories');
							
							$('select#categories').css("visibility","visible");


							var Category_Element;

							Category_Element = $("<option value="+post.id+">");
							Category_Element.text(post.name);
							list.append(Category_Element);
					
						});

						// Set selected value for dropdown menu - categories
						$("select#categories option[value='"+categoryId+"']").attr("selected", "selected");

					});



						var list = $('div#edit_content_news');
					

						var save_button_Element = $("<input type='button' value='Save' id='saveEdit' class='btn btn-primary' style='float:right; margin-bottom:5px;' >");
						var title_Element = $("<label for='title' id='TitleLabel' style='display:block;margin-top:30px;'> Title</label>		<input value='"+titleName+"' id='title' class='form-control' style='display:block;'>");
						var content_Element = $("<label for='content' id='ContentLabel' style='display:block;margin-top:15px;'> Content</label>		<textarea  id='content' class='form-control' >"+content_val+"</textarea>");
						var url_Element = $("<label for='url' id='UrlLabel' style='display:block;margin-top:15px;'> Url</label>		<input value='"+url_val+"' id='url' class='form-control' >");
						var Category_Element_label = $("<label for='categories' id='CategoryLabel' style='display:block;margin-top:15px;'> Category</label>");
						

						// Append elements
						list.append(save_button_Element);
						list.append(title_Element);
						list.append(content_Element);
						list.append(url_Element);
						list.append(Category_Element_label);

						
						$("input#saveEdit").on("click", function() {
						
							$.ajax({
					  			url: root + '/password',
								method: 'GET'
							}).then(function (response){


								var user_pass = prompt("Enter password", "");

								$.each(response, function(){
								
									if (user_pass == this.password) {
						
										var new_title = $("input#title").val();
										var new_categoryId = $("select#categories").val();
										var new_content = $("textarea#content").val();
										var new_url = $("input#url").val();
										

										// Insert edited values
										$.ajax({
											url: root + '/news/'+data.id,
								  			method: 'PUT',
								  			data: {
								    			title: new_title,
								    			categoryId: new_categoryId,
								    			content: new_content,
								    			url: new_url
								    		}
							
										}).then(function(data) {
											console.log(data);
											
											// Empty the div
											$("div.edit_news select#news").empty();
											$("div#edit_content_news").empty();
											$('select#categories').css("visibility","hidden");


											// Get the new list of news
											$.ajax({
												url: root + '/news',
												method: 'GET'
											}).then(processNewsEditResponse, handleError);

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
		
	// END of Delete and Edit news ---




});
