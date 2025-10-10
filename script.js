document.addEventListener("DOMContentLoaded", () => {
  // ✅ Handle "Book A Trip Now" button click (index.html)
  const bookTripBtn = document.getElementById("bookTripBtn");
  if (bookTripBtn) {
    bookTripBtn.addEventListener("click", () => {
      window.location.href = "booking.html"; // Redirect to booking page
    });
  }

  // ✅ Booking form logic (booking.html)
  const roundTrip = document.getElementById("roundTrip");
  const oneWay = document.getElementById("oneWay");
  const returnGroup = document.getElementById("returnGroup");
  const bookingForm = document.getElementById("bookingForm");

  // Only run these if elements exist (to avoid errors on index.html)
  if (roundTrip && oneWay && returnGroup && bookingForm) {
    // Function to toggle return date visibility
    function toggleReturnDate() {
      if (oneWay.checked) {
        returnGroup.style.display = "none";
      } else {
        returnGroup.style.display = "block";
      }
    }

    // Add event listeners for trip type change
    roundTrip.addEventListener("change", toggleReturnDate);
    oneWay.addEventListener("change", toggleReturnDate);

    // Run once on page load to set the correct state
    toggleReturnDate();

    // Handle form submission
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Redirecting to Flight tab...");
      window.location.href = "flight.html"; // redirect after booking
    });
  }
});
