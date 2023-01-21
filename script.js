class Library {
  books = [];
  constructor(books) {
    if(books) {
      for (let book of books) {
        this.books.push(book);
      }
    }
  }
  addBook(book) {
    this.books.push(book);
  }
}

class Book {
  constructor(title, author, pages, isRead, cover) {
    this.title = title,
    this.author = author,
    this.pages = pages,
    this.isRead = isRead,
    this.cover = cover
  }
}

class Screen {
  displayBooks(books) {
    const content = document.querySelector(".content");
    for(const i in books) {
      const card = this.#buildCard(books[i]);
      console.log(i == 0);
      if(i == 0) {
        card.classList.add("selected");
      }
      card.addEventListener("click", this);
      content.append(card);
    }
  }

  handleEvent(event) {
    if (event.type === "click") {
      const target = event.currentTarget;
      console.log(target.className);
      if (target.className === "card") {
        const selected = document.querySelector(".content .selected");
        if (selected) {
          selected.classList.remove("selected");
        }
        target.classList.add("selected");
      } else if (target.className === "card selected") {
        target.classList.remove("selected");
      }
    };
  }

  #buildCard(book) {
    const indicator = this.#buildIndicator(book);
    const cover = this.#buildCover(book);
    const details = this.#buildDetails(book);
    const card = document.createElement("div");
    card.className = "card";
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


const screen = new Screen();
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

screen.displayBooks(books);