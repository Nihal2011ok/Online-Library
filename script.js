let books = JSON.parse(localStorage.getItem('books')) || [
    { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960, category: "Fiction", description: "A novel about racial injustice in the American South.", cover: "https://example.com/mockingbird.jpg", rating: 4.5, reviews: [] },
    { id: 2, title: "1984", author: "George Orwell", year: 1949, category: "Fiction", description: "A dystopian novel set in a totalitarian society.", cover: "https://example.com/1984.jpg", rating: 4.3, reviews: [] },
    { id: 3, title: "Pride and Prejudice", author: "Jane Austen", year: 1813, category: "Fiction", description: "A romantic novel of manners set in Georgian England.", cover: "https://example.com/pride.jpg", rating: 4.2, reviews: [] },
    { id: 4, title: "The Great Gatsby", author: "F. Scott Fitzgerald", year: 1925, category: "Fiction", description: "A novel about the American Dream in the Roaring Twenties.", cover: "https://example.com/gatsby.jpg", rating: 4.0, reviews: [] },
    { id: 5, title: "A Brief History of Time", author: "Stephen Hawking", year: 1988, category: "Science", description: "A book about cosmology for a general audience.", cover: "https://example.com/brief-history.jpg", rating: 4.1, reviews: [] }
];

const bookList = document.getElementById("book-list");
const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category-select");
const sortSelect = document.getElementById("sort-select");
const addBookForm = document.getElementById("add-book-form");
const paginationDiv = document.getElementById("pagination");
const modal = document.getElementById("modal");
const closeModal = document.getElementsByClassName("close")[0];
const darkModeToggle = document.getElementById("dark-mode-toggle");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const userNameSpan = document.getElementById("user-name");
const minRating = document.getElementById("min-rating");
const maxRating = document.getElementById("max-rating");

const BOOKS_PER_PAGE = 8;
let currentPage = 1;
let currentUser = null;

function displayBooks(booksToShow) {
    bookList.innerHTML = "";
    const start = (currentPage - 1) * BOOKS_PER_PAGE;
    const end = start + BOOKS_PER_PAGE;
    const paginatedBooks = booksToShow.slice(start, end);

    paginatedBooks.forEach((book) => {
        const bookDiv = document.createElement("div");
        bookDiv.classList.add("book-item");
        bookDiv.innerHTML = `
            <img src="${book.cover}" alt="${book.title} cover" class="book-cover">
            <div class="book-info" data-id="${book.id}">
                <strong>${book.title}</strong>
                <p>${book.author} (${book.year})</p>
                <p>Rating: ${book.rating.toFixed(1)}</p>
            </div>
            <button class="remove-btn" data-id="${book.id}">Remove</button>
        `;
        bookList.appendChild(bookDiv);
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
    const categories = Array.from(categorySelect.selectedOptions).map(option => option.value);
    const sortBy = sortSelect.value;
    const minRatingValue = parseFloat(minRating.value);
    const maxRatingValue = parseFloat(maxRating.value);

    let filteredBooks = books.filter(book => 
        (book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.year.toString().includes(searchTerm)) &&
        (categories.length === 0 || categories.includes(book.category)) &&
        (book.rating >= minRatingValue && book.rating <= maxRatingValue)
    );

    switch (sortBy) {
        case "title":
            filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case "author":
            filteredBooks.sort((a, b) => a.author.localeCompare(b.author));
            break;
        case "year":
            filteredBooks.sort((a, b) => b.year - a.year);
            break;
        case "rating":
            filteredBooks.sort((a, b) => b.rating - a.rating);
            break;
    }

    displayBooks(filteredBooks);
}

addBookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newBook = {
        id: books.length + 1,
        title: document.getElementById("title-input").value,
        author: document.getElementById("author-input").value,
        year: parseInt(document.getElementById("year-input").value),
        category: document.getElementById("category-input").value,
        description: document.getElementById("description-input").value,
        cover: document.getElementById("cover-input").value || 'default-cover.jpg',
        rating: 0,
        reviews: []
    };

    books.push(newBook);
    localStorage.setItem("books", JSON.stringify(books));
    filterAndSortBooks();
    addBookForm.reset();
});

bookList.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
        const bookId = parseInt(e.target.dataset.id);
        books = books.filter(book => book.id !== bookId);
        localStorage.setItem("books", JSON.stringify(books));
        filterAndSortBooks();
    } else if (e.target.classList.contains("book-info")) {
        const bookId = parseInt(e.target.dataset.id);
        openModal(bookId);
    }
});

function openModal(bookId) {
    const book = books.find(book => book.id === bookId);
    if (book) {
        document.getElementById("modal-title").innerText = book.title;
        document.getElementById("modal-cover").src = book.cover;
        document.getElementById("modal-author").innerText = `Author: ${book.author}`;
        document.getElementById("modal-year").innerText = `Published: ${book.year}`;
        document.getElementById("modal-category").innerText = `Category: ${book.category}`;
        document.getElementById("modal-description").innerText = book.description;
        document.getElementById("modal-rating").innerText = `Rating: ${book.rating.toFixed(1)}`;

        const reviewsDiv = document.getElementById("modal-reviews");
        reviewsDiv.innerHTML = "";
        book.reviews.forEach(review => {
            const reviewP = document.createElement("p");
            reviewP.innerText = `${review.text} - Rating: ${review.rating}`;
            reviewsDiv.appendChild(reviewP);
        });

        modal.style.display = "block";
    }
}

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

document.getElementById("review-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const bookId = books.find(book => book.title === document.getElementById("modal-title").innerText).id;
    const newReview = {
        text: document.getElementById("review-text").value,
        rating: parseFloat(document.getElementById("review-rating").value)
    };
    const book = books.find(book => book.id === bookId);
    book.reviews.push(newReview);
    book.rating = (book.reviews.reduce((acc, review) => acc + review.rating, 0) / book.reviews.length).toFixed(1);

    localStorage.setItem("books", JSON.stringify(books));
    openModal(bookId);
    document.getElementById("review-form").reset();
});

darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

loginBtn.addEventListener("click", () => {
    currentUser = prompt("Please enter your name:", "Guest");
    if (currentUser) {
        userNameSpan.innerText = `Hello, ${currentUser}`;
        loginBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";
        localStorage.setItem("currentUser", currentUser);
    }
});

logoutBtn.addEventListener("click", () => {
    currentUser = null;
    userNameSpan.innerText = "";
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    localStorage.removeItem("currentUser");
});

window.addEventListener("DOMContentLoaded", () => {
    filterAndSortBooks();
    currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
        userNameSpan.innerText = `Hello, ${currentUser}`;
        loginBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";
    }
});
