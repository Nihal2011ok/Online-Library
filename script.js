let books = JSON.parse(localStorage.getItem('books')) || [
    { title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960 },
    { title: "1984", author: "George Orwell", year: 1949 },
    { title: "Pride and Prejudice", author: "Jane Austen", year: 1813 },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", year: 1925 },
    { title: "The Catcher in the Rye", author: "J.D. Salinger", year: 1951 }
];

const bookList = document.getElementById("book-list");
const searchInput = document.getElementById("search-input");
const addBookForm = document.getElementById("add-book-form");

function displayBooks(booksToShow) {
    bookList.innerHTML = "";
    booksToShow.forEach((book, index) => {
        const li = document.createElement("li");
        li.classList.add("book-item");
        li.innerHTML = `
            <div class="book-info">
                <strong>${book.title}</strong> by ${book.author} (${book.year})
            </div>
            <button class="remove-btn" data-index="${index}">Remove</button>
        `;
        bookList.appendChild(li);
    });
}

function searchBooks() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.year.toString().includes(searchTerm)
    );
    displayBooks(filteredBooks);
}

function addBook(event) {
    event.preventDefault();
    const title = document.getElementById("title-input").value;
    const author = document.getElementById("author-input").value;
    const year = parseInt(document.getElementById("year-input").value);

    books.push({ title, author, year });
    saveBooks();
    displayBooks(books);
    event.target.reset();
}

function removeBook(index) {
    books.splice(index, 1);
    saveBooks();
    displayBooks(books);
}

function saveBooks() {
    localStorage.setItem('books', JSON.stringify(books));
}

searchInput.addEventListener("input", searchBooks);
addBookForm.addEventListener("submit", addBook);

bookList.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-btn")) {
        const index = parseInt(event.target.getAttribute("data-index"));
        removeBook(index);
    }
});

// Initial display of all books
displayBooks(books);