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
  saveBook(id, book) {
    book.id = parseInt(id);
    const index = this.#books.findIndex(b => b.id === parseInt(id));
    if(index !== -1) {
      this.#books[index] = book;
    }
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
    const book = new Book("", "", 5, false, "");
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
    this.#initializeButtons();
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
        this.showInfo();
      } else if (target.className === "action close"){
        this.closeInfo();
      } else if (target.className === "save") {
        this.saveDetails();
      }
    }
  }

  #initializeButtons() {
    const actions = document.querySelectorAll(".action");
    actions.forEach(action => action.addEventListener("click", this));
    const save = document.querySelector(".save");
    save.addEventListener("click", this);
  }

  showInfo() {
    const mask = document.querySelector(".mask");
    mask.classList.remove("hidden");
  }

  closeInfo() {
    const mask = document.querySelector(".mask");
    mask.classList.add("hidden");
  }

  addCard() {
    const emptyCard = document.querySelector(`[id='0']`);
    const card = emptyCard ? emptyCard : this.insertCard(this.library.getBlankBook());
    this.selectCard(card);
  }

  deleteCard(cardId) {
    this.library.deleteBook(cardId);
    const card = this.getCard(cardId);
    const sibling = card.nextElementSibling ? card.nextElementSibling : card.previousElementSibling;
    card.remove();
    if(sibling) {
      this.selectCard(sibling);
    } else {
      this.addCard();
    }
  }

  getCard(cardId) {
    return document.querySelector(`[id='${cardId}']`);
  }

  saveDetails() {
    const id = parseInt(this.#selectedCardId);
    let card = this.getCard(id);
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const pages = document.getElementById("pages").value;
    const isRead = document.getElementById("true").checked;
    const cover = document.getElementById("cover").value;
    let book = new Book(title, author, pages, isRead, cover);
    const isInputValid = this.validateDetails(book);
    if(isInputValid) {
      if(id === 0) {
        book = this.library.addBook(book);
      } else {
        book = this.library.saveBook(id, book);
      }
      this.#selectedCardId = book.id;
      card = this.refreshCard(card, book);
      this.displayCardDetails(card);
    }
  }

  refreshCard(card, book) {
    card.id = book.id;
    const title = card.querySelector(".title");
    const author = card.querySelector(".author");
    const cover = card.querySelector(".cover");
    title.textContent = book.title;
    author.textContent = book.author;
    cover.src = book.cover ? book.cover : "./assets/cover.jpg";
    let indicator = card.querySelector(".indicator");
    indicator.remove();
    indicator = this.#buildIndicator(book);
    card.append(indicator);
    return card;
  }

  validateDetails(book) {
    const titleLabel = document.querySelector("#title-label");
    const authorLabel = document.querySelector("#author-label");
    const isTitleValid = book.title !== "";
    const isAuthorValid = book.author !== "";
    if(!isTitleValid) {
      titleLabel.classList.add("warn");
    }
    if(!isAuthorValid) {
      authorLabel.classList.add("warn");
    }
    return isTitleValid && isAuthorValid;
  }

  insertCard(book) {
    const content = document.querySelector(".content");
    const card = this.#buildCard(book);
    card.addEventListener("click", this);
    content.append(card);
    return card;
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
    coverImg.src = book.cover ? book.cover : "./assets/cover.jpg";
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
    
    const titleLabel = document.querySelector("#title-label");
    const authorLabel = document.querySelector("#author-label");
    titleLabel.classList.remove("warn");
    authorLabel.classList.remove("warn");
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
    if (!book.isRead) {
      const indicator = document.createElement("span");
      indicator.className = "indicator";
      return indicator;
    };
    const indicator = document.createElement("img");
    indicator.className = "indicator";
    indicator.src = "./assets/check.svg";
    indicator.alt = "Done reading";
    return indicator;
  }

  #buildCover(book) {
    const cover = document.createElement("img");
    cover.className = "cover";
    cover.src = book.cover ? book.cover : "./assets/cover.jpg";
    cover.alt = book.title;
    return cover;
  }

  #buildDetails(book) {
    const title = document.createElement("p");
    title.className = "title";
    title.textContent = book.title ? book.title : "Title";
    const author = document.createElement("p");
    author.className = "author";
    author.textContent = book.author ? book.author : "Author";
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