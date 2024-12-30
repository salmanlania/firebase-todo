import { getdata, addData, delData } from './firebase.js';

console.log('doc.data()', getdata());

// getdata.map((doc, index) => {
//     console.log(`Document ${index + 1}:`, doc.email); // Log each document's data
// });

const form = document.getElementById('registration-form');
const cardContainer = document.getElementById('card-container');
const pagination = document.getElementById('pagination');
const pageNumberDisplay = document.getElementById('page-number');

const cardsPerPage = 2;
let currentPage = 1;
let usersData = [];

document.addEventListener('DOMContentLoaded', async() => {
    try {
        // Fetch data from Firebase
        usersData = await getdata(); // Ensure `getdata` returns a Promise
        renderCards();
    } catch (error) {
        console.error('Error loading initial data:', error);
    }
});

const handleDelete = async (docId) => {
    try {
        await delData(docId); // Call the delete function from firebase.js
        usersData = usersData.filter((user) => user.id !== docId); // Remove from local array
        alert('User deleted successfully!');
        renderCards(); // Re-render the cards
    } catch (e) {
        console.error('Error deleting user:', e);
    }
};


// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form values
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const age = document.getElementById('age').value;
    const email = document.getElementById('email').value;

    // Get gender value from radio buttons
    const gender = document.querySelector('input[name="gender"]:checked') ?
        document.querySelector('input[name="gender"]:checked').value : 'Not specified';

    // Get "Is Experienced" value from radio buttons
    const isExperienced = document.querySelector('input[name="is-experienced"]:checked') ?
        document.querySelector('input[name="is-experienced"]:checked').value : 'Not specified';

    // Get "Has Laptop" value from radio buttons
    const hasLaptop = document.querySelector('input[name="has-laptop"]:checked') ?
        document.querySelector('input[name="has-laptop"]:checked').value : 'Not specified';

    // Create user object and add to usersData
    const user = {
        firstName,
        lastName,
        age,
        email,
        gender,
        isExperienced,
        hasLaptop
    };


    try {
        await addData(user)
        alert('User added successfully:', user);
        usersData.push(user);
        renderCards();
    } catch (e) {
        console.log('Error adding user:', error);
    }
});
// return console.log(usersData)
// Render cards based on current page and cardsPerPage
function renderCards() {
    // Clear existing cards
    cardContainer.innerHTML = '';

    // Calculate starting and ending index for current page
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;

    const currentPageData = usersData.slice(startIndex, endIndex);

    currentPageData.forEach(user => {
        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
            <h4>${user.firstName} ${user.lastName}</h4>
            <p>Age: ${user.age}</p>
            <p>Email: ${user.email}</p>
            <p>Gender: ${user.gender}</p>
            <p>Experienced: ${user.isExperienced}</p>
            <p>Has Laptop: ${user.hasLaptop}</p>
            <button class="delete-button" data-id="${user.id}">Delete</button>
        `;

        cardContainer.appendChild(card);
    });
    const totalCards = usersData.length;
    const totalPages = Math.ceil(totalCards / cardsPerPage);

    pagination.style.display = totalCards > cardsPerPage ? 'flex' : 'none';
    pageNumberDisplay.textContent = `Page ${currentPage}`;

    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach((button) =>
        button.addEventListener('click', async (e) => {
            const docId = e.target.getAttribute('data-id');
            await handleDelete(docId);
        })
    );
}

// Change page number when navigating
function changePage(direction) {
    const totalCards = usersData.length;
    const totalPages = Math.ceil(totalCards / cardsPerPage);
    currentPage += direction;

    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;

    renderCards();
}

// Add event listeners for pagination buttons
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

prevButton.addEventListener('click', () => changePage(-1));
nextButton.addEventListener('click', () => changePage(1));