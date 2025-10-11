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
                returnGroup.classList.add("hidden-return"); // Use class for hiding
            } else {
                returnGroup.classList.remove("hidden-return");
            }
        }

        // Add event listeners for trip type change
        roundTrip.addEventListener("change", toggleReturnDate);
        oneWay.addEventListener("change", toggleReturnDate);

        // Run once on page load to set the correct state
        toggleReturnDate();

        // Set min date for depart/return to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('depart').setAttribute('min', today);
        document.getElementById('return').setAttribute('min', today);

        // Update return date min based on depart date
        document.getElementById('depart').addEventListener('change', (event) => {
            document.getElementById('return').setAttribute('min', event.target.value);
            if (document.getElementById('return').value < event.target.value) {
                document.getElementById('return').value = event.target.value;
            }
        });

        // Handle form submission
        bookingForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const from = document.getElementById("from").value;
            const to = document.getElementById("to").value;
            const tripType = document.querySelector('input[name="tripType"]:checked').value;
            const departDate = document.getElementById("depart").value;
            const returnDate = (tripType === "round") ? document.getElementById("return").value : "";
            const passengers = document.getElementById("passengers").value;

            // Store values in sessionStorage to pass to flight.html
            sessionStorage.setItem("searchDetails", JSON.stringify({
                from, to, tripType, departDate, returnDate, passengers
            }));

            window.location.href = "flight.html"; // Redirect to flight page
        });
    }

    // ✅ Flight page logic (flight.html)
    const flightSelectionDiv = document.getElementById("flightSelection");
    const passengerFormDiv = document.getElementById("passengerForm");
    const summarySectionDiv = document.getElementById("summarySection");
    const flightSearchSummaryDiv = document.getElementById("flightSearchSummary");

    if (flightSelectionDiv && passengerFormDiv && summarySectionDiv) {
        const searchDetails = JSON.parse(sessionStorage.getItem("searchDetails"));
        let selectedOutboundFlight = null;
        let selectedReturnFlight = null;
        let passengerDetails = []; // Array to store passenger info

        // --- Mock Flight Schedules Data ---
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

        // Function to display search summary
        function displaySearchSummary(details) {
            if (!details) {
                flightSearchSummaryDiv.innerHTML = "<p>No search details found. Please go back to the booking page.</p>";
                return;
            }
            flightSearchSummaryDiv.innerHTML = `
                <p><strong>Trip:</strong> ${details.from} to ${details.to}</p>
                <p><strong>Type:</strong> ${details.tripType === 'round' ? 'Round Trip' : 'One Way'}</p>
                <p><strong>Depart Date:</strong> ${details.departDate}</p>
                ${details.tripType === 'round' ? `<p><strong>Return Date:</strong> ${details.returnDate}</p>` : ''}
                <p><strong>Passengers:</strong> ${details.passengers}</p>
            `;
        }

        // Function to render flights
        function renderFlights(type) {
            flightSelectionDiv.innerHTML = ''; // Clear previous flights

            if (!searchDetails) return;

            displaySearchSummary(searchDetails); // Display summary when flights are rendered

            let flightsToDisplay = [];
            let heading = "";
            let currentFlightType = ""; // 'outbound' or 'return'

            if (type === 'outbound') {
                heading = `Departing Flights on ${searchDetails.departDate} from ${searchDetails.from} to ${searchDetails.to}`;
                flightsToDisplay = availableFlights.filter(
                    f => f.from === searchDetails.from && f.to === searchDetails.to
                );
                currentFlightType = 'outbound';
            } else if (type === 'return') {
                heading = `Returning Flights on ${searchDetails.returnDate} from ${searchDetails.to} to ${searchDetails.from}`;
                flightsToDisplay = availableFlights.filter(
                    f => f.from === searchDetails.to && f.to === searchDetails.from
                );
                currentFlightType = 'return';
            } else if (type === 'oneway') {
                heading = `Departing Flights on ${searchDetails.departDate} from ${searchDetails.from} to ${searchDetails.to}`;
                flightsToDisplay = availableFlights.filter(
                    f => f.from === searchDetails.from && f.to === searchDetails.to
                );
                currentFlightType = 'oneway';
            }

            if (flightsToDisplay.length === 0) {
                flightSelectionDiv.innerHTML = `<p class="search-summary">No flights available for your search criteria.</p>`;
                return;
            }

            const flightGroupDiv = document.createElement('div');
            flightGroupDiv.classList.add('flight-group');
            flightGroupDiv.innerHTML = `<h3>${heading}</h3>`;

            flightsToDisplay.forEach(flight => {
                const flightCard = document.createElement('div');
                flightCard.classList.add('flight-card');
                flightCard.innerHTML = `
                    <div class="flight-details">
                        <p class="flight-time-route">${flight.departTime} - ${flight.arrivalTime} (${flight.duration})</p>
                        <p><strong>From:</strong> ${flight.from} | <strong>To:</strong> ${flight.to}</p>
                        <p><strong>Flight No:</strong> ${flight.flightNo} | <strong>Terminal:</strong> ${flight.terminal}</p>
                    </div>
                    <div class="fare-details">
                        <p class="price">PHP ${flight.price.toLocaleString()}</p>
                        <p class="fare-type ${flight.fareType === 'Promo Fare' ? '' : 'none'}">${flight.fareType}</p>
                        <p class="seats-left">${flight.seats} seats available</p>
                    </div>
                    <div class="select-flight">
                        <button class="select-btn" data-flight-id="${flight.flightNo}" data-flight-type="${currentFlightType}">Select Flight</button>
                    </div>
                `;
                flightGroupDiv.appendChild(flightCard);
            });
            flightSelectionDiv.appendChild(flightGroupDiv);

            // Add event listeners to select buttons
            flightSelectionDiv.querySelectorAll('.select-btn').forEach(button => {
                button.addEventListener('click', handleFlightSelection);
            });
        }

        // Handle flight selection
        function handleFlightSelection(event) {
            const flightId = event.target.dataset.flightId;
            const flightType = event.target.dataset.flightType;
            const selectedFlight = availableFlights.find(f => f.flightNo === flightId &&
                ((flightType === 'outbound' && f.from === searchDetails.from && f.to === searchDetails.to) ||
                 (flightType === 'return' && f.from === searchDetails.to && f.to === searchDetails.from) ||
                 (flightType === 'oneway' && f.from === searchDetails.from && f.to === searchDetails.to))
            );

            if (!selectedFlight) return;

            // Update UI for selected flight
            flightSelectionDiv.querySelectorAll('.flight-card').forEach(card => {
                card.classList.remove('selected-flight-card'); // Remove highlight from others
                card.querySelector('.select-btn').textContent = 'Select Flight'; // Reset text
                card.querySelector('.select-btn').classList.remove('selected'); // Remove selected class
                card.querySelector('.select-btn').style.backgroundColor = '#28a745'; // Reset color
            });

            event.target.closest('.flight-card').classList.add('selected-flight-card');
            event.target.textContent = 'Selected';
            event.target.classList.add('selected');
            event.target.style.backgroundColor = '#007bff'; // Blue for selected

            if (searchDetails.tripType === 'round') {
                if (flightType === 'outbound') {
                    selectedOutboundFlight = selectedFlight;
                    // Now render return flights
                    flightSelectionDiv.innerHTML = ''; // Clear outbound flights
                    renderFlights('return');
                } else if (flightType === 'return') {
                    selectedReturnFlight = selectedFlight;
                    moveToPassengerForm();
                }
            } else { // One Way
                selectedOutboundFlight = selectedFlight; // It's just an outbound flight
                moveToPassengerForm();
            }
        }

        // Move to Passenger Form section
        function moveToPassengerForm() {
            if (searchDetails.tripType === 'round' && (!selectedOutboundFlight || !selectedReturnFlight)) {
                alert('Please select both an outbound and a return flight.');
                return;
            }
            if (searchDetails.tripType === 'oneway' && !selectedOutboundFlight) {
                alert('Please select a flight.');
                return;
            }

            flightSelectionDiv.classList.add('hidden');
            passengerFormDiv.classList.remove('hidden');
            generatePassengerForms(searchDetails.passengers);
        }

        // Generate Passenger Forms
        function generatePassengerForms(numPassengers) {
            const passengerDetailsForm = document.getElementById('passengerDetailsForm');
            passengerDetailsForm.innerHTML = ''; // Clear previous forms

            for (let i = 1; i <= numPassengers; i++) {
                const passengerFormGroup = document.createElement('div');
                passengerFormGroup.classList.add('passenger-form-group');
                passengerFormGroup.innerHTML = `
                    <h3>Passenger ${i} Details</h3>
                    <div class="passenger-form-row">
                        <div class="form-group">
                            <label for="p${i}FirstName">First Name</label>
                            <input type="text" id="p${i}FirstName" name="firstName" placeholder="First Name" required data-passenger-id="${i}">
                            <span class="error-message" id="p${i}FirstNameError"></span>
                        </div>
                        <div class="form-group">
                            <label for="p${i}LastName">Last Name</label>
                            <input type="text" id="p${i}LastName" name="lastName" placeholder="Last Name" required data-passenger-id="${i}">
                            <span class="error-message" id="p${i}LastNameError"></span>
                        </div>
                    </div>
                    <div class="passenger-form-row">
                        <div class="form-group">
                            <label for="p${i}DOB">Date of Birth</label>
                            <input type="date" id="p${i}DOB" name="dob" required data-passenger-id="${i}">
                            <span class="error-message" id="p${i}DOBError"></span>
                        </div>
                        <div class="form-group">
                            <label for="p${i}Gender">Gender</label>
                            <select id="p${i}Gender" name="gender" required data-passenger-id="${i}">
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            <span class="error-message" id="p${i}GenderError"></span>
                        </div>
                    </div>
                    <div class="passenger-form-row">
                        <div class="form-group">
                            <label for="p${i}Email">Email</label>
                            <input type="email" id="p${i}Email" name="email" placeholder="Email Address" required data-passenger-id="${i}">
                            <span class="error-message" id="p${i}EmailError"></span>
                        </div>
                        <div class="form-group">
                            <label for="p${i}Phone">Phone Number</label>
                            <input type="tel" id="p${i}Phone" name="phone" placeholder="e.g., 09xxxxxxxxx" pattern="[0-9]{11}" required data-passenger-id="${i}">
                            <span class="error-message" id="p${i}PhoneError"></span>
                        </div>
                    </div>
                `;
                passengerDetailsForm.appendChild(passengerFormGroup);
            }
            const submitBtn = document.createElement('button');
            submitBtn.type = 'submit';
            submitBtn.classList.add('continue-btn');
            submitBtn.textContent = 'Continue to Summary';
            passengerDetailsForm.appendChild(submitBtn);
        }

        // Validate Passenger Form
        document.getElementById('passengerDetailsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            let allValid = true;
            passengerDetails = []; // Clear previous passenger details

            for (let i = 1; i <= searchDetails.passengers; i++) {
                const firstName = document.getElementById(`p${i}FirstName`);
                const lastName = document.getElementById(`p${i}LastName`);
                const dob = document.getElementById(`p${i}DOB`);
                const gender = document.getElementById(`p${i}Gender`);
                const email = document.getElementById(`p${i}Email`);
                const phone = document.getElementById(`p${i}Phone`);

                let passengerValid = true;

                // Simple validation example, expand as needed
                if (firstName.value.trim() === '') {
                    displayError(`p${i}FirstNameError`, 'First name is required.');
                    passengerValid = false;
                } else {
                    displayError(`p${i}FirstNameError`, '');
                }

                if (lastName.value.trim() === '') {
                    displayError(`p${i}LastNameError`, 'Last name is required.');
                    passengerValid = false;
                } else {
                    displayError(`p${i}LastNameError`, '');
                }

                if (dob.value === '') {
                    displayError(`p${i}DOBError`, 'Date of Birth is required.');
                    passengerValid = false;
                } else {
                    displayError(`p${i}DOBError`, '');
                }

                if (gender.value === '') {
                    displayError(`p${i}GenderError`, 'Gender is required.');
                    passengerValid = false;
                } else {
                    displayError(`p${i}GenderError`, '');
                }

                if (email.value.trim() === '' || !email.value.includes('@')) {
                    displayError(`p${i}EmailError`, 'Valid email is required.');
                    passengerValid = false;
                } else {
                    displayError(`p${i}EmailError`, '');
                }

                if (phone.value.trim() === '' || !/^[0-9]{11}$/.test(phone.value)) {
                    displayError(`p${i}PhoneError`, 'Valid 11-digit phone number is required.');
                    passengerValid = false;
                } else {
                    displayError(`p${i}PhoneError`, '');
                }

                if (!passengerValid) {
                    allValid = false;
                } else {
                    passengerDetails.push({
                        firstName: firstName.value,
                        lastName: lastName.value,
                        dob: dob.value,
                        gender: gender.value,
                        email: email.value,
                        phone: phone.value
                    });
                }
            }

            if (allValid) {
                moveToSummary();
            }
        });

        function displayError(elementId, message) {
            const errorElement = document.getElementById(elementId);
            if (errorElement) {
                errorElement.textContent = message;
            }
        }

        // Move to Summary section
        function moveToSummary() {
            passengerFormDiv.classList.add('hidden');
            summarySectionDiv.classList.remove('hidden');
            displayBookingSummary();
        }

        // Display Booking Summary
        function displayBookingSummary() {
            const bookingSummaryDetailsDiv = document.getElementById('bookingSummaryDetails');
            bookingSummaryDetailsDiv.innerHTML = '';

            let totalFare = 0;

            let summaryHtml = `
                <div class="summary-item">
                    <h3>Travel Details</h3>
                    <p><strong>From:</strong> ${searchDetails.from}</p>
                    <p><strong>To:</strong> ${searchDetails.to}</p>
                    <p><strong>Trip Type:</strong> ${searchDetails.tripType === 'round' ? 'Round Trip' : 'One Way'}</p>
                    <p><strong>Passengers:</strong> ${searchDetails.passengers}</p>
                </div>

                <div class="summary-item">
                    <h3>Flight Information</h3>
                    <h4>Departing Flight (${searchDetails.departDate})</h4>
                    <div class="summary-flight-details">
                        <div>
                            <p><strong>Flight No:</strong> ${selectedOutboundFlight.flightNo}</p>
                            <p><strong>Terminal:</strong> ${selectedOutboundFlight.terminal}</p>
                            <p><strong>Route:</strong> ${selectedOutboundFlight.from} to ${selectedOutboundFlight.to}</p>
                        </div>
                        <div>
                            <p><strong>Time:</strong> ${selectedOutboundFlight.departTime} - ${selectedOutboundFlight.arrivalTime}</p>
                            <p><strong>Duration:</strong> ${selectedOutboundFlight.duration}</p>
                            <p><strong>Fare Type:</strong> ${selectedOutboundFlight.fareType}</p>
                        </div>
                    </div>
                    <p style="text-align: right; margin-top: 10px;"><strong>Price:</strong> PHP ${selectedOutboundFlight.price.toLocaleString()}</p>
                </div>
            `;
            totalFare += selectedOutboundFlight.price;

            if (searchDetails.tripType === 'round' && selectedReturnFlight) {
                summaryHtml += `
                    <div class="summary-item">
                        <h4>Returning Flight (${searchDetails.returnDate})</h4>
                        <div class="summary-flight-details">
                            <div>
                                <p><strong>Flight No:</strong> ${selectedReturnFlight.flightNo}</p>
                                <p><strong>Terminal:</strong> ${selectedReturnFlight.terminal}</p>
                                <p><strong>Route:</strong> ${selectedReturnFlight.from} to ${selectedReturnFlight.to}</p>
                            </div>
                            <div>
                                <p><strong>Time:</strong> ${selectedReturnFlight.departTime} - ${selectedReturnFlight.arrivalTime}</p>
                                <p><strong>Duration:</strong> ${selectedReturnFlight.duration}</p>
                                <p><strong>Fare Type:</strong> ${selectedReturnFlight.fareType}</p>
                            </div>
                        </div>
                        <p style="text-align: right; margin-top: 10px;"><strong>Price:</strong> PHP ${selectedReturnFlight.price.toLocaleString()}</p>
                    </div>
                `;
                totalFare += selectedReturnFlight.price;
            }

            summaryHtml += `
                <div class="summary-item">
                    <h3>Passenger Information</h3>
            `;
            passengerDetails.forEach((p, index) => {
                summaryHtml += `
                    <div class="passenger-summary-details">
                        <h4>Passenger ${index + 1}</h4>
                        <p><strong>Name:</strong> ${p.firstName} ${p.lastName}</p>
                        <p><strong>DOB:</strong> ${p.dob}</p>
                        <p><strong>Gender:</strong> ${p.gender}</p>
                        <p><strong>Email:</strong> ${p.email}</p>
                        <p><strong>Phone:</strong> ${p.phone}</p>
                    </div>
                `;
            });
            summaryHtml += `</div>`; // Close passenger information summary-item

            // Calculate total fare for all passengers
            const totalFarePerPassenger = totalFare; // Fare for one person (outbound + return if applicable)
            const grandTotal = totalFarePerPassenger * parseInt(searchDetails.passengers);

            summaryHtml += `
                <div class="summary-total">
                    <h3>Total Payable: PHP ${grandTotal.toLocaleString()}</h3>
                </div>
            `;

            bookingSummaryDetailsDiv.innerHTML = summaryHtml;
        }

        // Handle "Book Now" button click on summary page
        const bookNowBtn = document.getElementById('bookNowBtn');
        if (bookNowBtn) {
            bookNowBtn.addEventListener('click', () => {
                // Here you would typically send the booking details to a backend server.
                // For this front-end only example, we'll just simulate a successful booking.
                alert('Booking Confirmed! Thank you for choosing M&M Airline.');
                sessionStorage.clear(); // Clear session data after booking
                window.location.href = 'index.html'; // Redirect to home page
            });
        }

        // Initialize flight page: check if search details exist and render flights
        if (searchDetails) {
            // Initial render of outbound flights or oneway flights
            if (searchDetails.tripType === 'round') {
                renderFlights('outbound');
            } else { // One Way
                renderFlights('oneway');
            }
        } else {
            // If no search details, prompt user to go back
            flightSelectionDiv.innerHTML = `<p class="search-summary">Please go back to the <a href="booking.html">booking page</a> to search for flights.</p>`;
            flightSearchSummaryDiv.innerHTML = ''; // Clear summary if no details
        }
    } // End of flight.html logic if block
}); // End of DOMContentLoaded