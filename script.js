document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // INDEX PAGE: Book A Trip Button
  // =========================
  const bookTripBtn = document.getElementById("bookTripBtn");
  if (bookTripBtn) {
    bookTripBtn.addEventListener("click", () => {
      window.location.href = "booking.html";
    });
  }

  // =========================
  // BOOKING PAGE
  // =========================
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    const roundTrip = document.getElementById("roundTrip");
    const oneWay = document.getElementById("oneWay");
    const returnGroup = document.getElementById("returnGroup");

    const toggleReturnDate = () => {
      if (oneWay.checked) returnGroup.classList.add("hidden-return");
      else returnGroup.classList.remove("hidden-return");
    };

    roundTrip.addEventListener("change", toggleReturnDate);
    oneWay.addEventListener("change", toggleReturnDate);
    toggleReturnDate();

    const departEl = document.getElementById("depart");
    const returnEl = document.getElementById("return");
    const today = new Date().toISOString().split("T")[0];
    departEl.min = today;
    returnEl.min = today;

    departEl.addEventListener("change", (e) => {
      returnEl.min = e.target.value;
      if (returnEl.value < e.target.value) {
        returnEl.value = e.target.value;
      }
    });

    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const from = document.getElementById("from").value.trim();
      const to = document.getElementById("to").value.trim();
      const tripType = document.querySelector('input[name="tripType"]:checked').value;
      const departDate = document.getElementById("depart").value;
      const returnDate = tripType === "round" ? document.getElementById("return").value : "";
      const passengers = document.getElementById("passengers").value;

      if (!from || !to || !departDate) {
        alert("Please complete the required fields.");
        return;
      }

      const searchDetails = { from, to, tripType, departDate, returnDate, passengers };
      sessionStorage.setItem("searchDetails", JSON.stringify(searchDetails));

      window.location.href = "flight.html";
    });
  }

  // =========================
  // FLIGHT PAGE
  // =========================
  const flightSelectionDiv = document.getElementById("flightSelection");
  const flightSummaryDiv = document.getElementById("flightSearchSummary");
  
  if (flightSelectionDiv && flightSummaryDiv) {
    const availableFlights = [
      {
        flightNo: "5J 560",
        terminal: "Terminal 3",
        departTime: "07:00 AM",
        arrivalTime: "09:00 AM",
        duration: "2h 0m",
        from: "Manila",
        to: "Cebu",
        price: 2500,
        seats: 50,
        fareType: "Promo Fare"
      },
      {
        flightNo: "PR 101",
        terminal: "Terminal 2",
        departTime: "10:30 AM",
        arrivalTime: "12:30 PM",
        duration: "2h 0m",
        from: "Manila",
        to: "Cebu",
        price: 3200,
        seats: 120,
        fareType: "None"
      },
      {
        flightNo: "5J 561",
        terminal: "Terminal 3",
        departTime: "01:00 PM",
        arrivalTime: "03:00 PM",
        duration: "2h 0m",
        from: "Cebu",
        to: "Manila",
        price: 2600,
        seats: 45,
        fareType: "Promo Fare"
      },
      {
        flightNo: "PR 102",
        terminal: "Terminal 2",
        departTime: "04:00 PM",
        arrivalTime: "06:00 PM",
        duration: "2h 0m",
        from: "Cebu",
        to: "Manila",
        price: 3300,
        seats: 90,
        fareType: "None"
      },
      {
        flightNo: "DG 600",
        terminal: "Terminal 4",
        departTime: "08:00 AM",
        arrivalTime: "09:30 AM",
        duration: "1h 30m",
        from: "Manila",
        to: "Davao",
        price: 3000,
        seats: 60,
        fareType: "Promo Fare"
      },
      {
        flightNo: "PR 200",
        terminal: "Terminal 2",
        departTime: "11:00 AM",
        arrivalTime: "12:30 PM",
        duration: "1h 30m",
        from: "Davao",
        to: "Manila",
        price: 3500,
        seats: 80,
        fareType: "None"
      }
    ];
  
    const searchDetails = JSON.parse(sessionStorage.getItem("searchDetails"));
  
    if (!searchDetails) {
      flightSummaryDiv.innerHTML = `<p>No selected flight found. Please go back to <a href="booking.html">booking page</a>.</p>`;
      return;
    }
  
    // Summary info above the flights
    flightSummaryDiv.innerHTML = `
      <p><strong>Trip:</strong> ${searchDetails.from} → ${searchDetails.to}</p>
      <p><strong>Type:</strong> ${searchDetails.tripType === "round" ? "Round Trip" : "One Way"}</p>
      <p><strong>Depart:</strong> ${searchDetails.departDate}</p>
      ${searchDetails.tripType === "round" ? `<p><strong>Return:</strong> ${searchDetails.returnDate}</p>` : ""}
      <p><strong>Passengers:</strong> ${searchDetails.passengers}</p>
    `;
  
    // Normalize string for matching
    const norm = (s) => s.toLowerCase().trim();
  
    const flightsToDisplay = availableFlights.filter(
      (f) => norm(f.from) === norm(searchDetails.from) && norm(f.to) === norm(searchDetails.to)
    );
  
    if (flightsToDisplay.length === 0) {
      flightSelectionDiv.innerHTML = `<p>No flights available for your search criteria.</p>`;
      return;
    }
  
    flightSelectionDiv.innerHTML = "";
  
    flightsToDisplay.forEach((f) => {
      const div = document.createElement("div");
      div.classList.add("flight-card");
      div.innerHTML = `
        <h3>${f.flightNo} (${f.fareType})</h3>
        <p><strong>From:</strong> ${f.from}</p>
        <p><strong>To:</strong> ${f.to}</p>
        <p><strong>Terminal:</strong> ${f.terminal}</p>
        <p><strong>Departure:</strong> ${f.departTime}</p>
        <p><strong>Arrival:</strong> ${f.arrivalTime}</p>
        <p><strong>Duration:</strong> ${f.duration}</p>
        <p><strong>Available Seats:</strong> ${f.seats}</p>
        <p><strong>Price:</strong> ₱${f.price.toLocaleString()}</p>
        <button class="select-flight" data-flight='${JSON.stringify(f)}'>Select Flight</button>
      `;
      flightSelectionDiv.appendChild(div);
    });
  
    // Button click logic
    flightSelectionDiv.querySelectorAll(".select-flight").forEach((btn) => {
      btn.addEventListener("click", () => {
        const selectedFlight = JSON.parse(btn.dataset.flight);
        const selectedFlights = {
          searchDetails,
          selectedOutboundFlight: selectedFlight,
          selectedReturnFlight: null,
        };
        sessionStorage.setItem("selectedFlights", JSON.stringify(selectedFlights));
        window.location.href = "passenger.html";
      });
    });
  }
  

  // =========================
  // PASSENGER PAGE
  // =========================
  const passengerForm = document.getElementById("passengerDetailsForm");
  const summarySection = document.getElementById("summarySection");
  const bookingSummaryDetails = document.getElementById("bookingSummaryDetails");
  const bookNowBtn = document.getElementById("bookNowBtn");
  
  if (passengerForm) {
    const flightData = JSON.parse(sessionStorage.getItem("selectedFlights"));
    if (!flightData) {
      passengerForm.innerHTML = `<p>No flight selected. Please go back to <a href="flight.html">flight page</a>.</p>`;
      return;
    }
  
    const { searchDetails, selectedOutboundFlight } = flightData;
    const passengerCount = parseInt(searchDetails.passengers);
  
    // ✅ Generate passenger input fields
    for (let i = 1; i <= passengerCount; i++) {
      const wrapper = document.createElement("div");
      wrapper.classList.add("passenger-input");
      wrapper.innerHTML = `
        <h3>Passenger ${i}</h3>
        <input type="text" id="fname${i}" placeholder="First Name" required>
        <input type="text" id="lname${i}" placeholder="Last Name" required>
        <input type="email" id="email${i}" placeholder="Email" required>
        <input type="tel" id="phone${i}" placeholder="Phone (09xxxxxxxxx)" required pattern="^09\\d{9}$">
      `;
      passengerForm.appendChild(wrapper);
    }
  
    // ✅ Add "Continue to Summary" button
    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Continue to Summary";
    submitBtn.type = "submit";
    passengerForm.appendChild(submitBtn);
  
    // ✅ When user submits passenger info
    passengerForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const passengers = [];
      for (let i = 1; i <= passengerCount; i++) {
        const firstName = document.getElementById(`fname${i}`).value.trim();
        const lastName = document.getElementById(`lname${i}`).value.trim();
        const email = document.getElementById(`email${i}`).value.trim();
        const phone = document.getElementById(`phone${i}`).value.trim();
  
        if (!firstName || !lastName || !email || !phone) {
          alert(`Please complete all fields for Passenger ${i}.`);
          return;
        }
  
        passengers.push({ firstName, lastName, email, phone });
      }
  
      summarySection.classList.remove("hidden");
      passengerForm.classList.add("hidden");
  
      // ✅ Compute total fare
      const totalFare = selectedOutboundFlight.price * passengerCount;
  
      // ✅ Build Passenger & Flight Summary
      let passengerDetailsHTML = "";
      passengers.forEach((p, i) => {
        passengerDetailsHTML += `
          <div class="passenger-info">
            <p><strong>Passenger ${i + 1}:</strong> ${p.firstName} ${p.lastName}</p>
            <p><strong>Email:</strong> ${p.email}</p>
            <p><strong>Phone:</strong> ${p.phone}</p>
          </div>
        `;
      });
  
      bookingSummaryDetails.innerHTML = `
        <h3>Flight Information</h3>
        <div class="summary-flight-details">
          <p><strong>Flight No.:</strong> ${selectedOutboundFlight.flightNo}</p>
          <p><strong>From:</strong> ${searchDetails.from}</p>
          <p><strong>To:</strong> ${searchDetails.to}</p>
          <p><strong>Terminal:</strong> ${selectedOutboundFlight.terminal || "N/A"}</p>
          <p><strong>Departure:</strong> ${selectedOutboundFlight.departTime || "N/A"}</p>
          <p><strong>Arrival:</strong> ${selectedOutboundFlight.arrivalTime || "N/A"}</p>
          <p><strong>Duration:</strong> ${selectedOutboundFlight.duration || "N/A"}</p>
          <p><strong>Price per Passenger:</strong> ₱${selectedOutboundFlight.price.toLocaleString()}</p>
        </div>
  
        <h3>Passenger Details (${passengerCount})</h3>
        ${passengerDetailsHTML}
  
        <h3>Total Fare</h3>
        <p><strong>Passengers:</strong> ${passengerCount}</p>
        <p><strong>Total:</strong> ₱${totalFare.toLocaleString()}</p>
      `;
  
      // ✅ Book Now button
      if (bookNowBtn) {
        bookNowBtn.onclick = (e) => {
          e.preventDefault();
          alert("✅ Booking Successful! Thank you for choosing M&M Airline.");
          sessionStorage.clear();
          window.location.href = "index.html";
        };
      }
    });
  }
}); 