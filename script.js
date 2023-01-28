class Library {
  #nextId = 1;
  #books = [];
  constructor(books) {
    if(books) {
      for (const book of books) {
        this.addBook(book);
      }
    }
    this.screen = new Screen(this);
  }
  addBook(book) {
    book.id = this.#nextId;
    this.#books.push(book);
    this.#nextId++;
    return book;
  }
  getBook(id) {
    if(typeof id === "number") {
      return this.#books.filter(book => book.id === id)[0];
    } else {
      return this.#books;
    }
  }
  getBlankBook() {
    const book = new Book('Book', 'Author', 5, false, './assets/cover.jpg');
    book.id = 0;
    return book;
  }
  deleteBook(id) {
    const index = this.#books.findIndex(book => book.id === id);
    if (index !== -1) {
      this.#books.splice(index, 1);
    }
  }
}

class Book {
  cover = "";
  constructor(title, author, pages, isRead, cover) {
    this.title = title,
    this.author = author,
    this.pages = pages,
    this.isRead = isRead,
    this.cover = cover
  }
}

class Screen {
  #selectedCardId = null;
  constructor(library) {
    this.library = library;
    const books = library.getBook();
    for(const i in books) {
      const card = this.insertCard(books[i]);
      if(i == 0) {
        this.selectCard(card);
      }
    }
    this.initializeActions();
  }

  handleEvent(event) {
    if (event.type === "click") {
      const target = event.currentTarget;
      if (target.className === "card") {
        this.selectCard(target);
      } else if (target.className === "action delete"){
        this.deleteCard(this.#selectedCardId);
      } else if (target.className === "action add"){
        this.addCard();
      } else if (target.className === "action info"){
        console.log("info");
      }
    };
  }

  initializeActions() {
    const actions = document.querySelectorAll(".action");
    actions.forEach(action => action.addEventListener("click", this));
  }

  insertCard(book) {
    const content = document.querySelector(".content");
    const card = this.#buildCard(book);
    card.addEventListener("click", this);
    content.append(card);
    return card;
  }

  addCard() {
    const emptyCard = document.querySelector(`[id='0']`);
    const card = emptyCard ? emptyCard : this.insertCard(this.library.getBlankBook());
    this.selectCard(card);
  }

  selectCard(card) {
    this.displayCardDetails(card);
    const selected = document.querySelector(".content .selected");
    if (selected) {
      selected.classList.remove("selected");
    };
    card.classList.add("selected")
    this.#selectedCardId = card.id;
    return card;
  }

  displayCardDetails(card) {
    const cardId = parseInt(card.id);
    const libraryBook = this.library.getBook(cardId);
    const book = libraryBook ? libraryBook : this.library.getBlankBook();
    const coverImg = document.getElementById("cover-img");
    coverImg.src = book.cover;
    const cover = document.getElementById("cover");
    cover.value = book.cover;
    const title = document.getElementById("title");
    title.value = book.title;
    const author = document.getElementById("author");
    author.value = book.author;
    const pages = document.getElementById("pages");
    pages.value = book.pages;
    const isReadTrue = document.getElementById("true");
    const isReadFalse = document.getElementById("false");
    if(book.isRead) {
      isReadTrue.checked = true;
    } else {
      isReadFalse.checked = true;
    }

  }

  deleteCard(cardId) {
    this.library.deleteBook(cardId);
    const card = document.querySelector(`[id='${cardId}']`);
    const sibling = card.nextElementSibling ? card.nextElementSibling : card.previousElementSibling;
    card.remove();
    if(sibling) {
      this.selectCard(sibling);
    }
  }

  #buildCard(book) {
    const indicator = this.#buildIndicator(book);
    const cover = this.#buildCover(book);
    const details = this.#buildDetails(book);
    const card = document.createElement("div");
    card.className = "card";
    card.id = book.id;
    card.append(indicator, cover, details);
    return card;
  }

  #buildIndicator(book) {
    if (!book.isRead) return document.createElement("span");
    const indicator = document.createElement("img");
    indicator.className = "indicator";
    indicator.src = "./assets/check.svg";
    indicator.alt = "Done reading";
    return indicator;
  }

  #buildCover(book) {
    const cover = document.createElement("img");
    cover.className = "cover";
    cover.src = book.cover;
    cover.alt = book.title;
    return cover;
  }

  #buildDetails(book) {
    const title = document.createElement("p");
    title.className = "title";
    title.textContent = book.title;
    const author = document.createElement("p");
    author.className = "author";
    author.textContent = book.author;
    const details = document.createElement("div");
    details.className = "details";
    details.append(title, author);
    return details;
  }
}


const books = [
  new Book(
    "Alice's Adventures in Wonderland", 
    "Lewis Carroll", 
    300, 
    true, 
    "https://github.com/standardebooks/lewis-carroll_alices-adventures-in-wonderland_john-tenniel/blob/master/images/cover.jpg?raw=true"
  ),
  new Book(
    "Pride and Prejudice", 
    "Jane Austen", 
    300, 
    false, 
    "https://github.com/standardebooks/jane-austen_pride-and-prejudice/blob/master/images/cover.jpg?raw=true"
  ),
  new Book(
    "The Adventures of Huckleberry Finn", 
    "Mark Twain", 
    500, 
    true, 
    "https://github.com/standardebooks/mark-twain_the-adventures-of-huckleberry-finn/blob/master/images/cover.jpg?raw=true"
  ),
  new Book(
    "The Mysterious Island", 
    "Jules Verne", 
    600, 
    true, 
    "https://github.com/standardebooks/jules-verne_the-mysterious-island_stephen-w-white/blob/master/images/cover.jpg?raw=true"
  )
];
const library = new Library(books);