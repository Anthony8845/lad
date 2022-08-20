const readlineSync = require("readline-sync");


const rules = '* Компьютер задумывает от 3 до 6 различных цифр из 0,1,2,...9. \n' 
            +  '* Игрок делает ходы, чтобы узнать эти цифры и их порядок. \n'
            +  '* В ответ компьютер показывает число отгаданных цифр, стоящих на своих местах \n'
            +  '* (Bulls) и число отгаданных цифр, \n'
            +  '* стоящих не на своих местах (Cows)'
            +  '\n';

const MAX_VALUE = 999999
const MIN_VALUE = 100
let num = random(MAX_VALUE, MIN_VALUE);
let resultBulls = 0;
let resultCows = 0;


//Генерация случайного числа
function random(max, min) {
  let result = String(Math.floor(Math.random() * (max - min) + min)).split("");
  let uniqValue = new Set(result);
  if (uniqValue.size === result.length) {
      return result;
    } else {
      return random(max, min);
    }
}

console.log(rules)

function game() {
  resultBulls = 0;
  resultCows = 0;
  let userNum = readlineSync.question("Enter the number: ", {}).split("");
  
  if (userNum.length != num.length) {
    console.log(`enter a number equal to: ${num.length}` ); 
    userNum = "";
    game();
  }

  userResult = userNum.join("");
  compResult = num.join("");

  if (+userResult == +compResult) {
    console.log("-------------------------- \nCongratulation, you win! ", userResult);
  } else {
    arrComparison(num, userNum);
    game();
  }
}

// Определение количества быков и коров
function arrComparison(num, userNum) {
  for (let i = 0; i < num.length; i++) {
    if (num[i] == userNum[i]) {
      resultBulls++;
    } else if (num.includes(userNum[i])) {
      resultCows++;
    }
  }

  console.log("Bulls: ", resultBulls);
  console.log("Cows: ", resultCows);
}

game()
