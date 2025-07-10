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
    text = document.createTextNode(value);
    movementsValue.appendChild(text);
    row.append(movementsValue);

  }
};
displayMovements(account1.movements);



