"use strict";
const fibonacciCache = new Map([
  [0, 0],
  [1, 1],
]);

function getNthFibonacci(n) {
  if (n === undefined) throw new Error("Podaj n jako argument.");
  if (n === 0) return fibonacciCache.get(0);
  if (n === 1) return fibonacciCache.get(1);
  if (fibonacciCache.has(n)) return fibonacciCache.get(n);

  let fib1, fib2, result;
  fib1 = fibonacciCache.has(n - 2)
    ? fibonacciCache.get(n - 2)
    : getNthFibonacci(n - 2);
  fib2 = fibonacciCache.has(n - 1)
    ? fibonacciCache.get(n - 1)
    : getNthFibonacci(n - 1);
  result = fib1 + fib2;

  fibonacciCache.set(n, result);
  return result;
}

function isPalindrome(text) {
  for (let i = 0; i < Math.floor(text.length / 2); i++) {
    if (text[i] !== text[text.length - 1 - i]) {
      return false;
    }
  }
  return true;
}

function getTypeName(x) {
  return typeof x;
}

function amountToCoins(amount, coins) {
  const result = [];
  let numberOfCoins;

  for (let i = 0; i < coins.length; i++) {
    numberOfCoins = 0;
    while (amount >= coins[i]) {
      amount -= coins[i];
      numberOfCoins++;
    }
    result.push({ coin: coins[i], count: numberOfCoins });
  }
  return result;
}

function testPartOne() {
  console.log(getNthFibonacci(10)); // 55
  console.log(getNthFibonacci(20)); // 6765
  console.log(getNthFibonacci(30)); // 832040

  console.log(isPalindrome("racecar")); // true
  console.log(isPalindrome("hello")); // false

  console.log(getTypeName("hello")); // "string"
  console.log(getTypeName(10)); // "number"

  console.log(amountToCoins(25, [10, 5, 1]));
  console.log(amountToCoins(12, [10, 5, 2, 1]));
}
