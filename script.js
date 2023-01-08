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
  constructor(title, author, isRead) {
    this.title = title,
    this.author = author,
    this.isRead = isRead
  }
}