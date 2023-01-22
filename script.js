class Library {
  #nextId = 0;
  #books = [];
  constructor(books) {
    if(books) {
      for (const i in books) {
        const book = books[i];
        book.id = parseInt(i) + 1;
        this.#books.push(book);
      }
    }
    this.#nextId = books.length + 1;
    this.screen = new Screen(this);
  }
  addBook(book) {
    book.id = this.#nextId;
    this.#books.push(book);
    const card = this.screen.addBook(book);
    this.screen.selectCard(card);
    this.#nextId;
    return book;
  }
  getBook(i) {
    if(typeof i === "number") {
      return this.#books.filter(book => book.id === i)[0];
    } else {
      return this.#books;
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
  constructor(library) {
    this.library = library;
    const books = library.getBook();
    for(const i in books) {
      const card = this.addBook(books[i]);
      if(i == 0) {
        this.selectCard(card);
      }
    }
  }

  addBook(book) {
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
    return card;
  }

  displayCardDetails(card) {
    const cardId = parseInt(card.id);
    const book = this.library.getBook(cardId);
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

  handleEvent(event) {
    if (event.type === "click") {
      const target = event.currentTarget;
      if (target.className === "card") {
        this.selectCard(target);
      }
    };
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