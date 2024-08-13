let books = JSON.parse(localStorage.getItem('books')) || [
    { title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960, category: "Fiction", description: "A novel about racial injustice in the American South." },
    { title: "1984", author: "George Orwell", year: 1949, category: "Fiction", description: "A dystopian novel set in a totalitarian society." },
    { title: "Pride and Prejudice", author: "Jane Austen", year: 1813, category: "Fiction", description: "A romantic novel of manners set in Georgian England." },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", year: 1925, category: "Fiction", description: "A novel about the American Dream in the Roaring Twenties." },
    { title: "A Brief History of Time", author: "Stephen Hawking", year: 1988, category: "Science", description: "A book about cosmology for a general audience." }
];

const bookList = document.getElementById("book-list");
const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category-select");
const sortSelect = document.getElementById("sort-select");
const addBookForm = document.getElementById("add-book-form");
const paginationDiv = document.getElementById("pagination");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalAuthor = document.getElementById("modal-author");
const modalYear = document.getElementById("modal-year");
const modalCategory = document.getElementById("modal-category");
const modalDescription = document.getElementById("modal-description");
const closeModal = document.getElementsByClassName("close")[0];

const BOOKS_PER_PAGE = 5;
let currentPage = 1;

function displayBooks(booksToShow) {
    bookList.innerHTML = "";
    const start = (currentPage - 1) * BOOKS_PER_PAGE;
    const end = start + BOOKS_PER_PAGE;
    const paginatedBooks = booksToShow.slice(start, end);

    paginatedBooks.forEach((book, index) => {
        const li = document.createElement("li");
        li.classList.add("book-item");
        li.innerHTML = `
            <div class="book-info" data-index="${start + index}">
                <strong>${book.title}</strong> by ${book.author} (${book.year}) - ${book.category}
            </div>
            <button class="remove-btn" data-index="${start + index}">Remove</button>
        `;
        bookList.appendChild(li);
    });

    displayPagination(booksToShow.length);
}

function displayPagination(totalBooks) {
    const pageCount = Math.ceil(totalBooks / BOOKS_PER_PAGE);
    paginationDiv.innerHTML = "";

    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement("button");
        button.innerText = i;
        button.classList.add("page-btn");
        if (i === currentPage) {
            button.classList.add("active");
        }
        button.addEventListener("click", () => {
            currentPage = i;
            filterAndSortBooks();
        });
        paginationDiv.appendChild(button);
    }
}

function filterAndSortBooks() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categorySelect.value;
    const sortBy = sortSelect.value;

    let filteredBooks = books.filter(book => 
        (book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.year.toString().includes(searchTerm)) &&
        (category === "" || book.category === category)
    );

    filteredBooks.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return -1;
        if (a[sortBy] > b[sortBy]) return 1;
        return 0;
    });

    displayBooks(filteredBooks);
}

function addBook(event) {
    event.preventDefault();
    const title = document.getElementById("title-input").value;
    const author = document.getElementById("author-input").value;
    const year = parseInt(document.getElementById("year-input").value);
    const category = document.getElementById("category-input").value;
    const description = document.getElementById("description-input").value;

    books.push({ title, author, year, category, description });
    saveBooks();
    filterAndSortBooks();
    event.target.reset();
}

function removeBook(index) {
    books.splice(index, 1);
    saveBooks();
    filterAndSortBooks();
}

function saveBooks() {
    localStorage.setItem('books', JSON.stringify(books));
}

function showBookDetails(index) {
    const book = books[index];
    modalTitle.textContent = book.title;
    modalAuthor.textContent = `Author: ${book.author}`;
    modalYear.textContent = `Year: ${book.year}`;
    modalCategory.textContent = `Category: ${book.category}`;
    modalDescription.textContent = `Description: ${book.description}`;
    modal.style.display = "block";
}

searchInput.addEventListener("input", filterAndSortBooks);
categorySelect.addEventListener("change", filterAndSortBooks);
sortSelect.addEventListener("change", filterAndSortBooks);
addBookForm.addEventListener("submit", addBook);

bookList.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-btn")) {
        const index = parseInt(event.target.getAttribute("data-index"));
        removeBook(index);
    } else if (event.target.classList.contains("book-info")) {
        const index = parseInt(event.target.getAttribute("data-index"));
        showBookDetails(index);
    }
});

closeModal.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


filterAndSortBooks();