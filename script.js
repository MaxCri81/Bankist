'use strict';

// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
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

// Event handler
btnLogin.addEventListener("click", login);
btnTransfer.addEventListener("click", transfer);

/**
 * Clear the container of any HTML elements and forEach value in
 * movements, create a new element, accordingly.
 * @param {Array} movements - array of numbers (user movement figures)
 */
function displayMovements(movements) {
  // Clear all movement elements
  containerMovements.innerHTML = "";
  movements.forEach(createMovementElementSafe);
  
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

    const row = document.createElement('div');
    row.className = 'movements__row';
    //containerMovements.append(row); // add at the end
    containerMovements.insertBefore(row, containerMovements.firstChild); // insert at the beginning

    const movementsType = document.createElement('div');
    movementsType.classList.add('movements__type', `movements__type--${movementType}`);
    let text = document.createTextNode(index + 1 + " " + movementType);
    movementsType.appendChild(text);
    row.append(movementsType);

    const movementsValue = document.createElement('div');
    movementsValue.className = 'movements__value';
    text = document.createTextNode(value + "€");
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
  labelBalance.textContent = `${account.balance}€`;
};

/**
 * Print the sum of the deposits, withdrawal and total interests of 1.2% 
 * applied on every deposit transaction. Transactions must be greater 
 * or equal to 1€. Show the pipeline results in the app.
 * @param {Object} account - account object to work with.
 */
function calcPrintDisplaySummary(account) {
  // Sum of all the deposits (positive values)
  labelSumIn.textContent = `${account.movements.filter(value => value > 0).reduce((sum, value) => sum + value)}€`; // to fix the reduce if array is empty
  // Sum of all the withdrawal (negative values)
  labelSumOut.textContent = `${Math.abs(account.movements.filter(value => value < 0).reduce((sum, value) => sum + value))}€`; // to fix the reduce if array is empty
  // Sum of the interests of 1.2% applied on every deposit transaction, where the transaction is greater or equal to 1€.
  labelSumInterest.textContent = `${Math.abs(account.movements.filter(value => value > 0).map(value => value * account.interestRate / 100).filter(value => value >= 1).reduce((sum, value) => sum + value))}€`; // to fix the reduce if array is empty

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
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
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
  const amount = Number(inputTransferAmount.value);
  // Look for an account with username = inputTransferTo.value
  const receiverAccount = accounts.find(account => account.username === inputTransferTo.value);
  // if the receiverAccount exist, the amount > 0, there are enough money in the balance 
  // to make the trasfer and the current username is different from the receiverAccount username
  if (amount && currentAccount.balance >= amount && currentAccount.username !== receiverAccount?.username && receiverAccount) {
    // subtract the money from the current account
    currentAccount.movements.push(-amount);
    // add the money to the receiver account
    receiverAccount.movements.push(amount);
    // update UI
    updateData();
  }
  // clear the input fields
  inputTransferAmount.value = inputTransferTo.value = "";
};

/** Update UI movements, balance and summary related to the user credentials. */
function updateData() {
  // Display movements
  displayMovements(currentAccount.movements);
  // Display balance
  calcPrintBalance(currentAccount);
  // Display summary
  calcPrintDisplaySummary(currentAccount);
};






