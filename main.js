let tokens = 5;
let highestTokenValueReached = 5;

while (tokens > 0) { // continue while user has at least 1 token
  tokens--; // deduct one token per hand played

  // starting variables
  let ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]; // 1 = "Ace", 11 = "Jack", 12 = "Queen", 13 = "King"
  let suits = [0, 1, 2, 3]; // 0: "Clubs", 1: "Diamonds", 2: "Hearts", 3: "Spades"
  let deck = [];
  let dealtCards = [];
  let discardedCards;

  // function to print rank strings for user
  function returnRankString(num) {
    if (num === 1) {
      return "A";
    } else if (num > 1 && num < 11) {
      return num;
    } else if (num === 11) {
      return "J";
    } else if (num === 12) {
      return "Q";
    } else if (num === 13) {
      return "K";
    } else {
      return "error in returnRankString";
    }
  }

  // function to print suit strings for user
  function returnSuitString(num) {
    if (num === 0) {
      return "Clubs";
    } else if (num === 1) {
      return "Diamonds";
    } else if (num === 2) {
      return "Hearts";
    } else if (num === 3) {
      return "Spades";
    } else {
      return "error in returnSuitString";
    }
  }

  // build deck
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < ranks.length; j++) {
      deck.push([ranks[j], suits[i]]);
    }
  }

  // shuffle deck via Fisher-Yates (https://www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/)
  function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]]; // array destructuring assignment syntax to swap cards
    }
    return deck;
  }
  let shuffledDeck = shuffle(deck);

  // deal cards
  function dealCards(shuffledDeck, num) {
    for (let i = 1; i <= num; i++) {
      dealtCards.push(deck.shift());
    }
  }
  dealCards(shuffledDeck, 5);

  // print console lines (so prompt doesn't cover initial output);
  console.log("//////////////////");
  console.log(" Dealing cards...");
  console.log("//////////////////");
  console.log("");

  // print starting hand
  console.log("*** Starting hand ***");
  for (let i = 0; i < dealtCards.length; i++) {
    console.log((i + 1) + ": " + returnRankString(dealtCards[i][0]) + " of " + returnSuitString(dealtCards[i][1]));
  }
  console.log("");

  // prompt user to discard 0-5 cards, log action, and replace discarded cards
  // TODO: (ERROR) user can enter same card more than once (i.e., '33') and cause 2 replacements at that card
  discardedCards = prompt("Which cards do you wish to discard? (Enter card number(s) of 0-5 cards)");

  console.log("Discarded:");

  for (let i = 0; i < discardedCards.length; i++) {
    let indexOfDiscardedCards = discardedCards[i] - 1; // this is index of card in dealtCards

    // log discardedCards for user
    console.log(" " + discardedCards[i] + ": " + returnRankString(dealtCards[indexOfDiscardedCards][0]) + " of " + returnSuitString(dealtCards[indexOfDiscardedCards][1]));

    // discard discardedCards and replace with cards from shuffledDeck
    dealtCards.splice(indexOfDiscardedCards, 1, shuffledDeck.shift()); // start, del count, item
  }
  console.log("");

  // print final hand
  console.log("*** Final hand ***");
  for (let i = 0; i < dealtCards.length; i++) {
    console.log((i + 1) + ": " + returnRankString(dealtCards[i][0]) + " of " + returnSuitString(dealtCards[i][1]));
  }
  console.log("");

  // if final hand has a "K" (13)
  for (let i = 0; i < dealtCards.length; i++) {
    if (dealtCards[i][0] === 13) {

      // change value of all "A" cards from 1 to 14
      for (let i = 0; i < dealtCards.length; i++) {
        if (dealtCards[i][0] === 1) {
          dealtCards[i][0] = 14;
        }
      }
      break;
    }
  }

  // sort final hand
  dealtCards.sort((function(index){
      return function(a, b){
          return (a[index] === b[index] ? 0 : (a[index] < b[index] ? -1 : 1));
      };
  })(0)); // index 0

  // NOTE: functions used to evaluate final hand
  function isFlush(dealtCards) {
    let suit = dealtCards[0][1];

    for (let i = 1; i < dealtCards.length; i++) {
      if (dealtCards[i][1] !== suit) {
        return false;
      }
    }
    return true;
  }

  function isStraight(dealtCards) {
    let rank = dealtCards[0][0];

    for (let i = 1; i < dealtCards.length; i++) {
      if (rank + 1 === dealtCards[i][0]) {
        rank += 1;
      } else {
        return false;
      }
    }
    return true;
  }

  function isFourOfAKind(dealtCards) {
    let firstNumCount = 0;
    let lastNumCount = 0;

    for (let i = 0; i < dealtCards.length; i++) {
      if (dealtCards[i][0] === dealtCards[0][0]) { // compare to first card
        firstNumCount++;
      } else if (dealtCards[i][0] === dealtCards[4][0]) { // compare to last card
        lastNumCount++;
      }
    }

    if (firstNumCount === 4 || lastNumCount === 4) {
      return true;
    }
  }

  function isFullHouse(dealtCards) {
    let firstNumCount = 0;
    let lastNumCount = 0;

    for (let i = 0; i < dealtCards.length; i++) {
      if (dealtCards[i][0] === dealtCards[0][0]) { // compare to first card
        firstNumCount++;
      } else if (dealtCards[i][0] === dealtCards[4][0]) { // compare to last card
        lastNumCount++;
      }
    }

    if (firstNumCount === 3 && lastNumCount === 2 || firstNumCount === 2 && lastNumCount === 3) {
      return true;
    }
  }

  function threeOfAKind(dealtCards) {
    let numCount = 1;

    for (let i = 0; i < dealtCards.length - 2; i++) {
      for (let j = i + 1; j < dealtCards.length; j++) {
        if ( dealtCards[i][0] === dealtCards[j][0] ) {
          numCount++;
          if (numCount > 2) {
            return true;
          }
        }
      }
      numCount = 1;
    }
  }

  function twoPairs(dealtCards) {
    if (dealtCards[0][0] === dealtCards[1][0]) {
      if (dealtCards[2][0] === dealtCards[3][0] || dealtCards[3][0] === dealtCards[4][0]) {
        return true;
      }
    } else if (dealtCards[1][0] === dealtCards[2][0] && dealtCards[3][0] === dealtCards[4][0]) {
      return true;
    }
  }

  function onePair(dealtCards) {
    for (let i = 0; i < dealtCards.length - 1; i++) {
      if (dealtCards[i][0] === dealtCards[i + 1][0]) {
        return true;
      }
    }
  }

  // NOTE: function calls
  if ( dealtCards[0][0] === 10 && isFlush(dealtCards) && isStraight(dealtCards) ) { // Royal flush?
    console.log("~~ Royal flush! (+250 tokens)");
    tokens += 250;

  } else if ( isFlush(dealtCards) && isStraight(dealtCards) ) { // Straight flush
    console.log("~~ Straight flush! (+50 tokens)");
    tokens += 50;

  } else if (isFourOfAKind(dealtCards)) { // Four of a kind?
    console.log("~~ Four of a kind! (+25 tokens)");
    tokens += 25;

  } else if (isFullHouse(dealtCards)) { // Full house?
    console.log("~~ Full house! (+6 tokens)");
    tokens += 6;

  } else if (isFlush(dealtCards)) { // Flush?
    console.log("~~ Flush! (+5 tokens)");
    tokens += 5;

  } else if (isStraight(dealtCards)) { // Straight?
    console.log("~~ Straight! (+4 tokens)");
    tokens += 4;

  } else if (threeOfAKind(dealtCards)) { // Three of a kind?
    console.log("~~ Three of a kind! (+3 tokens)");
    tokens += 3;

  } else if (twoPairs(dealtCards)) { // Two pairs?
    console.log("~~ Two pairs! (+2 tokens)");
    tokens += 2;

  } else if (onePair(dealtCards)) { // One pair?
    console.log("~~ One pair! (+1 token)");
    tokens += 1;

  } else { // High card
    console.log("~~ High card! (+0 token)");
  }

  console.log("~~ Remaining tokens: " + tokens);
  console.log("");

  if (tokens > highestTokenValueReached) {
    highestTokenValueReached = tokens;
  }
}

console.log("");
console.log("*** GAME OVER ***");
console.log("");
console.log("highestTokenValueReached: " + highestTokenValueReached);
