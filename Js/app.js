// Book Class: Represent a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
// UI Class: Handle UI Task
class UI {
  // if you don't want to instantiate stuff you create a static class
  static displayBook() {
    const StoredBooks = Store.getBooks();

    const books = StoredBooks;

    books.forEach((book) => {
      UI.addBookToList(book);
    });
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <>${book.isbn}</ td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      // el target the address link that why we use
      // parentElement to go above then we use function remove to remove it
      el.parentElement.parentElement.remove();
    }
  }

  static clearField() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    // Vanishing in 3 seconds
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 3000);
  }
}

// Store Class: Handle Storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBook);

// Event: Add a Books
document.querySelector("#book-form").addEventListener("submit", (e) => {
  //   Prevent actual submit
  e.preventDefault();

  // Get form value
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  //   Validate
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    // Instantiate book
    const book = new Book(title, author, isbn);
    console.log(book);

    //   Add Book
    UI.addBookToList(book);

    // Add boook to store
    Store.addBook(book);

    // Show success message
    UI.showAlert("Book added", "success");
    //   Clear field;
    UI.clearField();
  }
});

// Event: Remove a Books
document.querySelector("#book-list").addEventListener("click", (e) => {
  //display this what is being click using click e.target
  UI.deleteBook(e.target);

  //   Remove book from store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  console.log(e.target.parentElement.previousElementSibling.textContent);

  // Show success message
  UI.showAlert("Book Removed", "success");
});
