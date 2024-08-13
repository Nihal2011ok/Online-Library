const books = [
    { title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960 },
    { title: "1984", author: "George Orwell", year: 1949 },
    { title: "Pride and Prejudice", author: "Jane Austen", year: 1813 },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", year: 1925 },
    { title: "The Catcher in the Rye", author: "J.D. Salinger", year: 1951 }
];

const bookList = document.getElementById("book-list");
const searchInput = document.getElementById("search-input");

function displayBooks(booksToShow) {
    bookList.innerHTML = "";
    booksToShow.forEach(book => {
        const li = document.createElement("li");
        li.classList.add("book-item");
        li.innerHTML = `<strong>${book.title}</strong> by ${book.author} (${book.year})`;
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

searchInput.addEventListener("input", searchBooks);

// Initial display of all books
displayBooks(books);