'use strict';

// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];
let currentAccount;

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let sorted = false;

// Event handler
btnLogin.addEventListener("click", login);
btnTransfer.addEventListener("click", transfer);
btnClose.addEventListener("click", closeAccount);
btnLoan.addEventListener("click", requestLoan);
btnSort.addEventListener("click", sortMovements);

/**
 * Clear the container of any HTML elements and forEach value in
 * movements, create a new element, accordingly.
 * @param {Array} movements - array of numbers (user movement figures)
 * @param {boolean} sort - sorting or not the movements true / false, default false 
 */
function displayMovements(account, sort = false) {
  // Clear all movement elements
  containerMovements.innerHTML = "";
  // Display the date in the UI
  displayDate();
  // slice returns a new array so to avoid changing the original movements array, with the sort method.
  const sortMovements = sort ? account.movements.slice().sort((a, b) => a - b) : account.movements;

  sortMovements.forEach(createMovementElementSafe);
  // Select every other element and set its background color to WhiteSmoke.
  [...document.querySelectorAll(".movements__row")].forEach((row, index) => index % 2 === 0 ? row.style.backgroundColor = "WhiteSmoke" : null);
  
  /**
   * Create an HTML element dynamically from a forEach call back.
   * This approach can pose a risk of Cross-Site Scripting (XSS) attacks 
   * if the HTML content comes from untrusted sources, such as user input or external data.
   * @param {number} value - forEach array value iteration
   * @param {number} index - forEach array index iteration
   */
  function createMovementElement(value, index) {
    // If the value is positive style and write deposit, otherwise withdrawal
    const movementType = value > 0 ? "deposit" : "withdrawal";
    const htmlElement = `
        <div class="movements__row">
          <div class="movements__type movements__type--${movementType}">${index + 1} ${movementType}</div>
          <div class="movements__value">${value}</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", htmlElement);
  }

  /**
   * Create an HTML element dynamically from a forEach call back.
   * This approach is safer then the insertAdjacentHTML method.
   * @param {number} value - forEach array value iteration
   * @param {number} index - forEach array index iteration
   */
  function createMovementElementSafe(value, index) {
    // If the value is positive style and write deposit, otherwise withdrawal
    const movementType = value > 0 ? "deposit" : "withdrawal";

    // container (movements__row)
    const row = document.createElement('div');
    row.className = 'movements__row';
    //containerMovements.append(row); // add at the end
    containerMovements.insertBefore(row, containerMovements.firstChild); // insert at the beginning

    // movements type
    const movementsType = document.createElement('div');
    movementsType.classList.add('movements__type', `movements__type--${movementType}`);
    let text = document.createTextNode(index + 1 + " " + movementType);
    movementsType.appendChild(text);
    row.append(movementsType);

    // movements date
    const movementsDate = document.createElement('div');
    movementsDate.className = 'movements__date';
    text = document.createTextNode(displayDate(currentAccount.movementsDates[index])); 
    movementsDate.appendChild(text);
    row.append(movementsDate);

    // movements value
    const movementsValue = document.createElement('div');
    movementsValue.className = 'movements__value';
    text = document.createTextNode(value.toFixed(2) + "€"); //round to 2 decimal
    movementsValue.appendChild(text);
    row.append(movementsValue);
  }
};

/**
 * For each account object in accountArray create the userName property with
 * the first letters of the owner property in lower case.
 * e.g Steven Thomas Williams => stw
 * @param {Array} accountArray - accounts array to be looped through
 */
function createUsername(accountArray) {
  accountArray.forEach(function(account){
    account.username = account.owner.toLowerCase().split(" ").map(value => value[0]).join("");
  });
};
createUsername(accounts);

/**
 * Print the user movements total and display in the app.
 * Create a balance property with the total, in the object.
 * @param {Array} movements - array of numbers (user movements) to be summed
 */
function calcPrintBalance(account) {
  account.balance = account.movements.reduce((sum, value) => sum + value, 0);
  labelBalance.textContent = `${account.balance.toFixed(2)}€`; //round to 2 decimal
};

/**
 * Print the sum of the deposits, withdrawal and total interests of 1.2% 
 * applied on every deposit transaction. Transactions must be greater 
 * or equal to 1€. Show the pipeline results in the app.
 * @param {Object} account - account object to work with.
 */
function calcPrintDisplaySummary(account) {
  // Sum of all the deposits (positive values)
  labelSumIn.textContent = `${account.movements.filter(value => value > 0).reduce((sum, value) => sum + value).toFixed(2)}€`; //round to 2 decimal
  // Sum of all the withdrawal (negative values)
  labelSumOut.textContent = `${Math.abs(account.movements.filter(value => value < 0).reduce((sum, value) => sum + value)).toFixed(2)}€`; //round to 2 decimal
  // Sum of the interests of 1.2% applied on every deposit transaction, where the transaction is greater or equal to 1€.
  labelSumInterest.textContent = `${Math.abs(account.movements.filter(value => value > 0).map(value => value * account.interestRate / 100).filter(value => value >= 1).reduce((sum, value) => sum + value)).toFixed(2)}€`; //round to 2 decimal
};

/**
 * Compare username and pin with the accounts properties.
 * Display UI, message, movements, balance and summary related to the user credentials.
 * @param {Object} event - PointerEvent returned from btnLogin event listener
 */
function login(event) {
  // Prevent the form default behaviour, when submitting it, for refreshing the page
  event.preventDefault();
  // compare the username typed in the page with the usename property in accounts
  currentAccount = accounts.find(account => account.username === inputLoginUsername.value);

  // Check that the inserted PIN is equal to the pin property value
  if (currentAccount?.pin === +inputLoginPin.value) {
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    // Lose the focus from the pin input field
    inputLoginPin.blur();
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;
    containerApp.style.opacity = 1;
    updateData();
  };
};

/**
 * Trasfer money from an account to another one.
 * @param {Object} event - PointerEvent returned from btnTransfer event listener
 */
function transfer(event) {
  // Prevent the form default behaviour, when submitting it, for refreshing the page
  event.preventDefault();
  const amount = +inputTransferAmount.value;
  // Look for an account with username = inputTransferTo.value
  const receiverAccount = accounts.find(account => account.username === inputTransferTo.value);
  // if the receiverAccount exist, the amount > 0, there are enough money in the balance 
  // to make the trasfer and the current username is different from the receiverAccount username
  if (amount && currentAccount.balance >= amount && currentAccount.username !== receiverAccount?.username && receiverAccount) {
    // subtract the money from the current account
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(Date.now()); // add date
    // add the money to the receiver account
    receiverAccount.movements.push(amount);
    receiverAccount.movementsDates.push(Date.now()); // add date
    // update UI
    updateData();
  }
  // clear the input fields
  inputTransferAmount.value = inputTransferTo.value = "";
};

/**
 * Close the current account and delete the object
 * @param {Object} event - PointerEvent returned from btnClose event listener
 */
function closeAccount(event) {
  // Prevent the form default behaviour, when submitting it, for refreshing the page
  event.preventDefault();

  if (currentAccount.username === inputCloseUsername.value && currentAccount.pin === +inputClosePin.value) {
    // Find the index for the account object with username equal to the current username
    const index = accounts.findIndex(account => account.username === currentAccount.username);
    // delete the object
    accounts.splice(index, 1);
    // Hide UI
    containerApp.style.opacity = 0;
  }
  // Clear input fields
  inputCloseUsername.value = inputClosePin.value = "";
}

/**
 * Add a new deposit in the movements array for the current account.
 * The amount must not be greater than 10% of the bigger deposit in the movements array
 * @param {*} event - PointerEvent returned from btnLoan event listener
 */
function requestLoan(event) {
  // Prevent the form default behaviour, when submitting it, for refreshing the page
  event.preventDefault();
  const amount = Math.floor(inputLoanAmount.value); //round down the value
  // if any of the movement in the current account is greater or equal than the 10%
  // of the requested amount, and the amount is greater than 0
  if (amount > 0 && currentAccount.movements.some(movement => movement >= amount * 0.1)) {
    currentAccount.movements.push(amount); // add loan movement
    currentAccount.movementsDates.push(Date.now()); // add date
    updateData();
  }
  inputLoanAmount.value = "";
}

/**
 * Call back function from btnSort click event.
 * Display the movements is ascending or descending order.
 * It inverts the status of 'sorted' every time
 * the button is clicked.
 */
function sortMovements() {
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
}

/** Update UI movements, balance and summary related to the user credentials. */
function updateData() {
  // Display movements
  displayMovements(currentAccount);
  // Display balance
  calcPrintBalance(currentAccount);
  // Display summary
  calcPrintDisplaySummary(currentAccount);
};

/** Test mode - log in with account1 and display the UI */
function testing(){
  currentAccount = account1;
  containerApp.style.opacity = 1;
  updateData();
};
testing();

/**
 * Display the current date on the UI
 * @param {number} timestamp - timestamp from 1970 to today date in milliseconds
 * @returns a formatted string to be later displayed along the movements
 */
function displayDate(timestamp) {
  const now = new Date(timestamp);
  const day = `${now.getDate()}`.padStart(2, 0);
  const month = `${now.getMonth() + 1}`.padStart(2, 0); // getMonth is in base 0, so we need to add 1
  const year = now.getFullYear();
  const hour = now.getHours();
  const min = now.getMinutes();
  labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
  return `${day}/${month}/${year}`;
};





