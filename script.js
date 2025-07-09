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

// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/******************************************************************************* Array methods *************************************************************************/
/*
// Methods that do NOT mutate the original array
let arr = ["a", "b", "c", "d", "e"];
console.log(arr.slice(2));
console.log(arr.slice(2, 4)); // delete from index 2 to 4 (excluded)
console.log(arr.slice()); // create an array copy
console.log([...arr]); // create an array copy
console.log(arr.slice(-1));

arr = ["a", "b", "c", "d", "e"];
const arr2 = ["l", "i", "h", "g", "f"];
console.log(arr2.reverse());
console.log(arr2);
console.log(arr.concat(arr2));
console.log([...arr, ...arr2]);

console.log([...arr, ...arr2].join(" - "));

// Array mutating methods
console.log(arr.splice(-1));
console.log(arr.splice(1, 2)); // delete 2 elemtents from the array starting from index 1
console.log(arr);

const arrNew = [23, 11, 64];
console.log(arrNew[0]);
console.log(arrNew.at(0));

console.log(arrNew[arrNew.length - 1]); // last element in the traditional way
console.log(arrNew.slice(-1)[0]); // last element with the slice method
console.log(arrNew.at(-1)); // last element with the 'at' method

console.log("Massimo".at(0));
console.log("Massimo".at(-1));
*/
/****************************************************************************** forEach ******************************************************************************/
/*
// For method
// for (const movement of movements) {
//   console.log((`You ${movement > 0 ? "deposited" : "witdrew"} ${Math.abs(movement)}`));
// };

// forEach method
movements.forEach( (movement) => console.log((`You ${movement > 0 ? "deposited" : "witdrew"} ${Math.abs(movement)}`)));

// The forEach method can returns the value, index and the array, if they are specified as parameters inside the function
// You cannot break the forEach loop iteration, the for method on the contrary can be broken. 
movements.forEach( (movement, index, array) => console.log(movement, index, array));

currencies.forEach((value, key, map)=> console.log(key, value));
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR']);
currenciesUnique.forEach( (value) => console.log(value)); // in sets keys and values are the same (there are no keys, only values)
*/