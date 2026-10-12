const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
let escapeCount = 0;
const maxEscapes = 15;

function showReactionScreen() {
    const card = document.querySelector(".invitation-card");

    card.innerHTML = `
        <span class="label">WELL, WELL, WELL...</span>

        <h1>You actually said yes?</h1>

        <p class="description">
            Okay, let's make a plan.
        </p>

        <button id="continueButton">
            LET'S GO →
        </button>
    `;

    // Restart the entrance animation
    card.style.animation = "none";
    void card.offsetWidth;
    card.style.animation = "cardAppear 0.5s ease";

    document
        .getElementById("continueButton")
        .addEventListener("click", showPlanningMessage);
}

function showPlanningMessage() {
    const card = document.querySelector(".invitation-card");

    card.innerHTML = `
        <span class="label">STEP 01 — THE SCHEDULE</span>

        <h1>When are we doing this?</h1>

        <p class="description">
            Pick a day and time that works for you.
        </p>

        <form id="dateForm" class="date-form">

            <div class="form-group">
                <label for="dateInput">Date</label>

                <input
                    type="date"
                    id="dateInput"
                    name="date"
                    required
                >
            </div>

            <div class="form-group">
                <label for="timeInput">Time</label>

                <select id="timeInput" name="time" required>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                    <option value="18:00" selected>6:00 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="20:00">8:00 PM</option>
                </select>
            </div>

            <p id="dateError" class="form-error" hidden></p>

            <button type="submit" id="confirmDateButton">
                CONFIRM DATE →
            </button>

        </form>
    `;

    card.style.animation = "none";
    void card.offsetWidth;
    card.style.animation = "cardAppear 0.5s ease";

    const dateInput = document.getElementById("dateInput");
    const dateForm = document.getElementById("dateForm");
    const dateError = document.getElementById("dateError");

    // Use the visitor's local date as the earliest selectable date.
    const today = new Date();
    const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    dateInput.min = localToday;

    dateForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const selectedDate = dateInput.value;
        const selectedTime = document.getElementById("timeInput").value;

        if (!selectedDate || selectedDate < localToday) {
            dateError.textContent =
                "Please choose today or a future date.";

            dateError.hidden = false;
            return;
        }

        const [year, month, day] = selectedDate.split("-").map(Number);

        // Construct the date locally to avoid timezone date shifts.
        const date = new Date(year, month - 1, day);

        const formattedDate = date.toLocaleDateString("en-IE", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        const [hours, minutes] = selectedTime.split(":");
        const hour = Number(hours);

        const formattedTime =
            `${hour % 12 || 12}:${minutes} ${hour >= 12 ? "PM" : "AM"}`;

        showDateConfirmation(
            card,
            formattedDate,
            formattedTime
        );
    });
}

function showDateConfirmation(card, formattedDate, formattedTime) {
    card.innerHTML = `
        <span class="label">DATE SELECTED</span>

        <h1>We've got a plan.</h1>

        <p class="description">
            Here's what we're working with.
        </p>

        <div class="selection-summary">
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${formattedTime}</p>
        </div>

        <button id="foodContinueButton">
            NEXT: THE FOOD →
        </button>
    `;

    card.style.animation = "none";
    void card.offsetWidth;
    card.style.animation = "cardAppear 0.5s ease";

    document
    .getElementById("foodContinueButton")
    .addEventListener("click", showFoodSelection);
        
}

function escapeButton() {
    if (escapeCount >= maxEscapes) {
        return;
    }

    escapeCount++;

    const padding = 20;

    // On the 15th escape, move directly over YES.
    if (escapeCount === maxEscapes) {
        const yesRect = yesButton.getBoundingClientRect();

        noButton.style.position = "fixed";
        noButton.style.left = `${yesRect.left}px`;
        noButton.style.top = `${yesRect.top}px`;
        noButton.style.width = `${yesRect.width}px`;
        noButton.style.height = `${yesRect.height}px`;
        noButton.style.zIndex = "1000";

        noButton.textContent = "Yes!;)";

        return;
    }

    const buttonWidth = noButton.offsetWidth;
    const buttonHeight = noButton.offsetHeight;

    const maxX = Math.max(
        padding,
        window.innerWidth - buttonWidth - padding
    );

    const maxY = Math.max(
        padding,
        window.innerHeight - buttonHeight - padding
    );

    const x = padding + Math.random() * (maxX - padding);
    const y = padding + Math.random() * (maxY - padding);

    noButton.style.position = "fixed";
    noButton.style.left = `${x}px`;
    noButton.style.top = `${y}px`;
    noButton.style.zIndex = "1000";
}

yesButton.addEventListener("click", showReactionScreen);

noButton.addEventListener("pointerenter", escapeButton);

noButton.addEventListener("click", (event) => {
    event.preventDefault();

    if (escapeCount >= maxEscapes) {
        noButton.classList.add("disappearing");

        setTimeout(() => {
            noButton.style.display = "none";
        }, 250);

        return;
    }

    escapeButton();
});

function showFoodSelection() {
    const card = document.querySelector(".invitation-card");

    const foods = [
        { name: "Pizza", emoji: "🍕" },
        { name: "Kebab", emoji: "🌮" },
        { name: "Burgers", emoji: "🍔" },
        { name: "Pasta", emoji: "🍝" },
        { name: "Tacos", emoji: "🌮" },
        { name: "Ramen", emoji: "🍜" }
    ];

    card.innerHTML = `
        <span class="label">STEP 02 — THE FOOD</span>

        <h1>What's the food situation?</h1>

        <p class="description">
            Pick what you're in the mood for.
        </p>

        <div class="food-grid">
            ${foods.map(food => `
                <button
                    type="button"
                    class="food-option"
                    data-food="${food.name}"
                    aria-pressed="false"
                >
                    <span class="food-emoji">${food.emoji}</span>

                    <span>${food.name}</span>
                </button>
            `).join("")}
        </div>

        <p id="foodError" class="food-error" hidden>
            Choose an option first.
        </p>

        <button id="confirmFoodButton">
            THAT SOUNDS GOOD →
        </button>
    `;

    card.style.animation = "none";
    void card.offsetWidth;
    card.style.animation = "cardAppear 0.5s ease";

    let selectedFood = null;

    const foodButtons = card.querySelectorAll(".food-option");

    foodButtons.forEach(button => {
        button.addEventListener("click", () => {
            selectedFood = button.dataset.food;

            foodButtons.forEach(option => {
                const selected = option === button;

                option.classList.toggle("selected", selected);
                option.setAttribute("aria-pressed", String(selected));
            });

            document.getElementById("foodError").hidden = true;
        });
    });

    document
        .getElementById("confirmFoodButton")
        .addEventListener("click", () => {
            if (!selectedFood) {
                document.getElementById("foodError").hidden = false;
                return;
            }

            showFoodConfirmation(selectedFood);
        });
}

function showFoodConfirmation(selectedFood) {
    const card = document.querySelector(".invitation-card");

    card.innerHTML = `
        <span class="label">FOOD SELECTED</span>

        <h1>${selectedFood} it is.</h1>

        <p class="description">
            One important decision down.
        </p>

        <div class="selection-summary">
            <p><strong>Food:</strong> ${selectedFood}</p>
        </div>

        <button id="placeContinueButton">
            NEXT: THE LOCATION →
        </button>
    `;

    card.style.animation = "none";
    void card.offsetWidth;
    card.style.animation = "cardAppear 0.5s ease";

    document
        .getElementById("placeContinueButton")
        .addEventListener("click", showLocationSelection);
}

function showLocationSelection() {
    const card = document.querySelector(".invitation-card");

    const locations = [
        {
            name: "Coffee shop",
            icon: "☕",
            description: "Coffee and conversation"
        },
        {
            name: "Restaurant",
            icon: "🍽️",
            description: "Good food, good company"
        },
        {
            name: "Cinema",
            icon: "🎬",
            description: "A movie and popcorn"
        },
        {
            name: "Outdoors",
            icon: "🌳",
            description: "Fresh air and a walk"
        }
    ];

    card.innerHTML = `
        <span class="label">STEP 03 — THE LOCATION</span>

        <h1>Where are we heading?</h1>

        <p class="description">
            Pick the kind of place that sounds good.
        </p>

        <div class="location-grid">
            ${locations.map(location => `
                <button
                    type="button"
                    class="location-option"
                    data-location="${location.name}"
                    aria-pressed="false"
                >
                    <span class="location-icon">
                        ${location.icon}
                    </span>

                    <span class="location-name">
                        ${location.name}
                    </span>
                </button>
            `).join("")}
        </div>

        <p id="locationError" class="location-error" hidden>
            Choose a location first.
        </p>

        <button id="confirmLocationButton">
            THAT WORKS →
        </button>
    `;

    card.style.animation = "none";
    void card.offsetWidth;
    card.style.animation = "cardAppear 0.5s ease";

    let selectedLocation = null;

    const buttons = card.querySelectorAll(".location-option");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            selectedLocation = button.dataset.location;

            buttons.forEach(option => {
                const selected = option === button;

                option.classList.toggle("selected", selected);
                option.setAttribute(
                    "aria-pressed",
                    String(selected)
                );
            });

            document.getElementById("locationError").hidden = true;
        });
    });

    document
        .getElementById("confirmLocationButton")
        .addEventListener("click", () => {
            if (!selectedLocation) {
                document.getElementById("locationError").hidden = false;
                return;
            }

            showFinalSummary(selectedLocation);
        });
}

function showFinalSummary(selectedLocation) {
    const card = document.querySelector(".invitation-card");

    card.innerHTML = `
        <span class="label">STEP 04 — FINAL CONFIRMATION</span>

        <h1>Hold on... one last thing.</h1>

        <p class="description">
            Your date reservation is almost confirmed.
            Please review the following charges.
        </p>

        <div class="deposit-box">
            <div class="deposit-row">
                <span>Reservation deposit</span>
                <strong>€0.00</strong>
            </div>

            <div class="deposit-row">
                <span>Good company</span>
                <strong>Priceless</strong>
            </div>

            <div class="deposit-row">
                <span>Bad jokes</span>
                <strong>Included</strong>
            </div>

            <div class="deposit-total">
                <span>Required deposit</span>
                <strong>€500.00</strong>
            </div>
        </div>

        <p class="description">
            A small deposit is required to secure your reservation.
            Non-refundable. Obviously.
        </p>

        <button id="payDepositButton">
            PAY €500.00 →
        </button>

        <p class="footer">
            We accept good vibes and questionable financial decisions.
        </p>
    `;

    card.style.animation = "none";
    void card.offsetWidth;
    card.style.animation = "cardAppear 0.5s ease";

    document
        .getElementById("payDepositButton")
        .addEventListener("click", () => {
            showPaymentPrank();
        });
}


function showPaymentPrank() {
    const card = document.querySelector(".invitation-card");

    card.innerHTML = `
        <div class="prank-icon">💳</div>

        <span class="label">PAYMENT FAILED</span>

        <h1>Transaction declined.</h1>

        <p class="description">
            Reason: Your bank refused to finance
            this questionable life decision.
        </p>

        <div class="prank-message">
            <span class="prank-amount">€500.00</span>

            <p>
                Just kidding!
            </p>

            <p>
                Your presence is more than enough.
                You can keep your money.
            </p>
        </div>

        <button id="finishButton">
            OKAY, LET'S GO →
        </button>

        <p class="footer">
            No money was harmed in the making of this invitation.
        </p>
    `;

    card.style.animation = "none";
    void card.offsetWidth;
    card.style.animation = "cardAppear 0.5s ease";

    document
        .getElementById("finishButton")
        .addEventListener("click", () => {
            card.innerHTML = `
                <div class="prank-icon">🎉</div>

                <span class="label">RESERVATION CONFIRMED</span>

                <h1>You're officially booked!</h1>

                <p class="description">
                    No deposit. No paperwork.
                    Just good food and questionable jokes.
                </p>

                <p class="footer">
                    See you there!
                </p>
            `;
        });
}