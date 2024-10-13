// Your code here
document.addEventListener("DOMContentLoaded", () => {
    const baseURL = "http://localhost:3000/films";
    const posterEl = document.getElementById("poster");
    const titleEl = document.getElementById("title");
    const runtimeEl = document.getElementById("runtime");
    const showtimeEl = document.getElementById("showtime");
    const ticketNumEl = document.getElementById("ticket-num");
    const filmInfoEl = document.getElementById("film-info");
    const filmsListEl = document.getElementById("films");
    const buyTicketBtn = document.getElementById("buy-ticket");
  
    let currentMovie;
  
    // Function to load and display movie details
    function displayMovieDetails(movie) {
      posterEl.src = movie.poster;
      titleEl.textContent = movie.title;
      runtimeEl.textContent = `${movie.runtime} minutes`;
      showtimeEl.textContent = movie.showtime;
      ticketNumEl.textContent = `${movie.capacity - movie.tickets_sold} tickets remaining`;
      filmInfoEl.textContent = movie.description;
      currentMovie = movie;
  
      // Check if the movie is sold out
      if (movie.capacity - movie.tickets_sold <= 0) {
        buyTicketBtn.textContent = "Sold Out";
        buyTicketBtn.disabled = true;
      } else {
        buyTicketBtn.textContent = "Buy Ticket";
        buyTicketBtn.disabled = false;
      }
    }
  
    // Function to fetch and display the first movie's details
    function loadFirstMovie() {
      fetch(`${baseURL}/1`)
        .then((res) => res.json())
        .then((movie) => {
          displayMovieDetails(movie);
        })
        .catch((error) => console.error("Error fetching first movie:", error));
    }
  
    // Function to load all movies into the sidebar
    function loadAllMovies() {
      fetch(baseURL)
        .then((res) => res.json())
        .then((movies) => {
          filmsListEl.innerHTML = ""; // Clear the placeholder list item
          movies.forEach((movie) => {
            const li = document.createElement("li");
            li.classList.add("film", "item");
            li.textContent = movie.title;
  
            if (movie.capacity - movie.tickets_sold <= 0) {
              li.classList.add("sold-out");
            }
  
            li.addEventListener("click", () => {
              displayMovieDetails(movie);
            });
  
            filmsListEl.appendChild(li);
          });
        })
        .catch((error) => console.error("Error fetching movies:", error));
    }
  
    // Function to handle ticket purchase
    function buyTicket() {
      if (currentMovie.capacity - currentMovie.tickets_sold > 0) {
        currentMovie.tickets_sold += 1;
  
        // Update the number of available tickets on the server
        fetch(`${baseURL}/${currentMovie.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tickets_sold: currentMovie.tickets_sold,
          }),
        })
          .then((res) => res.json())
          .then((updatedMovie) => {
            displayMovieDetails(updatedMovie);
          })
          .catch((error) => console.error("Error updating tickets:", error));
      }
    }
  
    // Event listener for the "Buy Ticket" button
    buyTicketBtn.addEventListener("click", buyTicket);
  
    // Initial load
    loadFirstMovie();
    loadAllMovies();
  });
  