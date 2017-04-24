
// functions for HTML


// book constructor

function Book(title, author, description, isbn, img, links) {

	var gBookObject = this;

	this.likes = 0;
	this.dislikes = 0;
	this.title = title;
	this.author = author;
	this.description = description;
	this.isbn = isbn;
	this.img = img;
	this.links = links;
	this.bookdivid = {};
	this.bookshelfid = {};




	this.like = function() {

		this.likes++;
	}


	this.dislike = function() {

		this.dislikes++;
	}


	this.hideDiv = function(divid) {

		// book column id (divid) and from which shelf you want to bring the next (shelfid)

		

		if (Object.keys(this.bookshelfid.shelf.queue).length == 0) {

			this.bookshelfid.hideBook(this);
			$('#' + divid).hide(500);


		}

		else {

			this.bookshelfid.hideBook(this);
			this.bookshelfid.nextBook().render(divid);

		}

	}

	this.showDiv = function(divid) {

		$('#' + divid).show(500).render(divid);

	}


	this.render = function(divid) {

		var data = {
			"book": this,
			"divid": divid
		}

		// allocate div name to book

		this.bookdivid = divid;


		// render elements from book to div

		$('#' + divid + ' .img-thumbnail').attr("src", this.img);
		$('#' + divid + ' .title').html(this.title);
		$('#' + divid + ' .author').html(this.author);
		$('#' + divid + ' .description').html(this.description);
		$('#' + divid + ' .lermais').html("Ler mais").attr("href", "");

		// likes & dislikes
		// event and off necessary to avoid repeating events in the function

		$('#' + divid + ' .likebutton').off('click');
		$('#' + divid + ' .likebutton').click(data, function(event) {
			event.data.book.like();
			event.data.book.render(event.data.divid);
			event.preventDefault();

		})

		$('#' + divid + ' .dislikebutton').off('click');
		$('#' + divid + ' .dislikebutton').click(data, function(event) {
			event.data.book.dislike();
			event.data.book.hideDiv(divid);
			event.preventDefault();

		})

		// render elements from book to div

		$('#' + divid + ' .likecounter').html(this.likes);
		$('#' + divid + ' .dislikecounter').html(this.dislikes);
		$('#' + divid + ' .wikipedia').attr("href", this.links[0]);
		$('#' + divid + ' .wook').attr("href", this.links[1]);
		$('#' + divid + ' .amazon').attr("href", this.links[2]);
		$('#' + divid + ' .ebay').attr("href", this.links[3]);

	}

}

function Queue() {

	this.queue = [];

	this.enqueue = function(element) {

		this.queue.push(element);

	}

	this.dequeue = function() {

		return this.queue.shift();
	}


}

function Bookshelf() {

	// shelf has all available books
	// shelfhidden has all the books the user hid

	var gBookshelfObject = this;

	this.shelf = new Queue();
	this.shelfused = new Queue();
	this.shelfhidden = new Queue();

	this.add = function(book) {

		this.shelf.enqueue(book);
		book.bookshelfid = this;

	}

	this.hideBook = function(book) {

		this.shelfhidden.enqueue(book);

	}

	this.removeBook = function() {

		this.shelf.dequeue();
	}

	this.nextBook = function() {

		return this.shelf.queue[0], this.shelf.dequeue();

	}

	this.like = function(book) {
		this.shelf[book].likes++;
	}

	this.dislike = function(book) {
		this.shelf[book].dislikes++;
	}
	
	this.init = function() {

		// _.sample source in underscore.js
		// Randomizes Queue

		var randQueue = _.shuffle(this.shelf.queue)

		this.shelf.queue = randQueue;

		randQueue[0].render('book1');
		randQueue[1].render('book2');
		randQueue[2].render('book3');

		this.shelfused.enqueue(randQueue[0]);
		this.shelfused.enqueue(randQueue[1]);
		this.shelfused.enqueue(randQueue[2]);

		this.shelf.dequeue();
		this.shelf.dequeue();
		this.shelf.dequeue();

	}

	this.getGoogleBook = function(searchInput) {

		var url = "https://www.googleapis.com/books/v1/volumes?q=" + searchInput;

		var gShelf = this;
		var gBook;
		var gBookIndex;
		var gTitle = "N/A";
		var gAuthor = "N/A";
		var gDescription = "N/A";
		var gIsbn13 = "N/A";
		var gImage = "N/A";
		var gLinks = "N/A";

		$.get(url)
			.done(function(googleBooks) {

				for (i = 0; i < googleBooks.items.length; i++) {

					if (googleBooks.items[i].volumeInfo.industryIdentifiers != null &&
						googleBooks.items[i].volumeInfo.industryIdentifiers[1] != null &&
						googleBooks.items[i].volumeInfo.imageLinks != null &&
						googleBooks.items[i].volumeInfo.title != null && 
						googleBooks.items[i].volumeInfo.authors != null && 
						googleBooks.items[i].volumeInfo.description != null && 
						googleBooks.items[i].volumeInfo.imageLinks != null && 
						googleBooks.items[i].volumeInfo.infoLink != null)

						{

						gTitle = googleBooks.items[i].volumeInfo.title;
						gAuthor = googleBooks.items[i].volumeInfo.authors[0];
						gDescription = googleBooks.items[i].volumeInfo.description;
						gIsbn13 = googleBooks.items[i].volumeInfo.industryIdentifiers[1].identifier;
						gImage = googleBooks.items[i].volumeInfo.imageLinks.thumbnail;
						gLinks = googleBooks.items[i].volumeInfo.infoLink;


						gBook = new Book(gTitle, gAuthor, gDescription, gIsbn13, gImage, gLinks)

						console.log(gBook);
						gShelf.add(gBook);

					}

					else {
						i++;
					}

				}

				gShelf.init();

			})

			.fail(function(googleBooks) {

				console.log('Error:' + googleBooks);

			})

	}


	var input = this;

	$("#searchButton").off('click');
	$("#searchButton").click(input, function(event) {

	event.input = $("#inputText").val();
	gBookshelfObject.getGoogleBook(event.input);
	event.preventDefault();


	})

	$("#clearBooks").click(function() {

		for (i = 0; i < gBookshelfObject.shelf.queue.length; i++) {

		gBookshelfObject.removeBook();

		}

		bookPlaceHolder1.render('book1')
		bookPlaceHolder2.render('book2')
		bookPlaceHolder3.render('book3')


	})



}





















		


















