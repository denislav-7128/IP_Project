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



	// ADD IMAGE ---
		$("button#button1").click(function() {

			$.ajax({
			  url: root + '/password',
			  method: 'GET'
			}).then(addImage);

		});


		function addImage(response) {
			var user_pass = prompt("Enter password", "");

			$.each(response, function(){

				if (user_pass == this.password) {
					
					var input_val = $("input#input1").val();

					
					// Insert image
					$.ajax('http://localhost:3000/imgs', {
			  			method: 'POST',
			  			data: {
			    			url: input_val
			  			}
					}).then(function(data) {
			  			console.log(data);
					});


					// Empty the div
					$("div.images").empty();


					// Get the new list of images
					$.ajax({
						url: root + '/imgs',
						method: 'GET'
					}).then(processImageResponse, handleError);

				} else {
					alert("Wrong password");
				}

			});
		}

	// END of ADD IMAGE ---


	

	// LIST and DELETE IMAGES ---

		$.ajax({
			url: root + '/imgs',
		  	method: 'GET'
		}).then(processImageResponse, handleError);


		function appendImage(list, post) {
			// var newElement = $("<span id="+post.id+"/>");
			// newElement.text(post.url + "  |  "+ post.id);

			var newElement = $("<button class=delete id=del"+post.id+">X</button>");
			list.append(newElement);

			var img = new Image(100,100); // width and height
			img.src = post.url;
			img.id = "img"+(post.id);
			list.append(img);
		}


		function processImageResponse(response) {
			var list = $('div.images');

			var c=0;
			var last_id=0;
			$.each(response, function(){
				c++;
				last_id = this.id;
				// response[i]
				// console.log(this.title);
				appendImage(list, this);
			});

			if (c<last_id) {c = last_id; }

				
			// Delete image
			for (var i=1; i<=c; i++) {
				    
			    var str1 = "button#del";
				var butt = str1.concat(i);


				$(butt).on("click", {id: i} ,function(e) {

					$.ajax({
					  url: root + '/password',
					  method: 'GET'
					}).then(function (response){


						var user_pass = prompt("Enter password", "");

						$.each(response, function(){
							
							if (user_pass == this.password) {

								console.log("Delete image #"+ e.data.id);

								$.ajax({
									url: root + '/imgs/'+e.data.id,
									method: 'DELETE'
								});

								//  ------------

							    var str1 = $("div.images #img"+e.data.id);
							    str1.remove();

							    var str1 = $("div.images button#del"+e.data.id);
								    str1.remove();
						    } else {
								alert("Wrong password");
							}

						});

					});

				});			
			}


		}

	// END of LIST and DELETE IMAGES ---





});


  
	 

