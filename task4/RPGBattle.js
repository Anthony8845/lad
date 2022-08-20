const rls = require("readline-sync");
const monster = require("./monster.js");
const evstafiy = require("./evstafiy.js");

let maxHealth = evstafiy.maxHealth;
const monsterMoves = monster.moves;
const evstafiyMoves = [
  evstafiy.moves[0]["name"],
  evstafiy.moves[1]["name"],
  evstafiy.moves[2]["name"],
  evstafiy.moves[3]["name"],
];

// const cooldownE = evstafiy.moves.reduce((acc, move) => {
//     acc[move.shortName] = move.cooldown
//     return acc
// }, {})
// const cooldownM = monster.moves.reduce((acc, move) => {
//     acc[move.shortName] = move.cooldown
//     return acc
// }, {})

const cooldownE = {
  cooldown: [{ count: 0 }, { count: 0 }, { count: 0 }, { count: 0 }],
};

const cooldownM = {
  cooldown: [{ count: 0 }, { count: 0 }, { count: 0 }],
};

let total = {
  "monster health": monster.maxHealth,
  "evstafiy health": maxHealth,
};

console.log("Start Game \n");

function level() {
  console.log("Выберите сложность: ");

  let lvl = ["Easy", "Hard"];
  let enterLevel = rls.keyInSelect(lvl, "Select difficulty: ");

  if (enterLevel == 0) {
    total["evstafiy health"] = 15;
    console.log("\nSelect --EASY-- \n" + `Max health Evstafiy ${maxHealth}`);
  } else if (enterLevel == 1) {
    console.log("\nSelect --HARD-- \n" + `Max health Evstafiy ${maxHealth}`);
  } else {
    console.log("Stop game");
    process.exit();
  }
}

function monsterRun(hitM) {
  console.log("\nЛютый выбирает: " + monsterMoves[`${hitM}`]["name"]);
}

function evstafiyRun(hitE) {
  if (hitE === -1) {
    console.log("\nВы вышли из игры\n");
    process.exit();
  } else {
    console.log(
      "\nЕвстафий выбирает: " + evstafiy.moves[`${hitE}`]["name"] + "\n"
    );
  }
}

function battle(pers, hitMagic, hitPhisical, blockMagic, blockPhysical) {
  if (blockMagic === 100 || blockPhysical === 100) {
    return total[`${pers}`];
  } else {
    return (total[`${pers}`] -=
      hitPhisical -
      (blockPhysical / 100) * hitPhisical +
      (hitMagic - (blockMagic / 100) * hitMagic));
  }
}

function cooldownFunc(cooldownPers, numHit, cooldownAll) {
  if (cooldownAll.cooldown[`${numHit}`]["count"] === 0) {
    cooldownAll.cooldown[`${numHit}`]["count"] = cooldownPers;
  } else if (cooldownAll.cooldown[`${numHit}`]["count"] > 0) {
    console.log(
      "Будет доступен через " +
        cooldownAll.cooldown[`${numHit}`]["count"] +
        " ход(а)"
    );
    return "try_again";
  }
}

//Game
level();
game();

function game() {
  let resultM = +total["monster health"].toFixed(1);
  let resultE = +total["evstafiy health"].toFixed(1);
  console.log("\nЗдоровье Лютого: " + resultM);
  console.log("Здоровье Евстафия: " + resultE);

  let monsterHit;

  function a() {
    monsterHit = Math.floor(Math.random() * 2);
    monsterRun(monsterHit);
    let result = cooldownFunc(
      monster.moves[`${monsterHit}`]["cooldown"],
      monsterHit,
      cooldownM
    );
    if (result === "try_again") {
      return a();
    }
  }

  a();

  let evstafiyHit;

  function b() {
    evstafiyHit = rls.keyInSelect(evstafiyMoves, "Select an action: ");
    evstafiyRun(evstafiyHit);
    let result = cooldownFunc(
      evstafiy.moves[`${evstafiyHit}`]["cooldown"],
      evstafiyHit,
      cooldownE
    );
    if (result === "try_again") {
      return b();
    }
  }

  b();

  battle(
    "monster health",
    evstafiy.moves[`${evstafiyHit}`]["magicDmg"],
    evstafiy.moves[`${evstafiyHit}`]["physicalDmg"],
    monster.moves[`${monsterHit}`]["magicArmorPercents"],
    monster.moves[`${monsterHit}`]["physicArmorPercents"]
  );
  battle(
    "evstafiy health",
    monster.moves[`${monsterHit}`]["magicDmg"],
    monster.moves[`${monsterHit}`]["physicalDmg"],
    evstafiy.moves[`${evstafiyHit}`]["magicArmorPercents"],
    evstafiy.moves[`${evstafiyHit}`]["physicArmorPercents"]
  );

  cooldownE.cooldown.forEach((e) => {
    if (e["count"] !== 0) {
      e["count"]--;
    }
    return;
  });
  cooldownM.cooldown.forEach((e) => {
    if (e["count"] !== 0) {
      e["count"]--;
    }
    return;
  });

  if (total["monster health"] <= 0 || total["evstafiy health"] <= 0) {
    if (resultE > resultM) {
      console.log("Пздравляю, о великий маг Евстафий!");
      console.log("Вы одержали победу!");
    } else {
      console.log("Увы, злобный монстер одержал победу!");
    }
    console.log("Спасибо за игру! ");
    return;
  } else {
    console.log("\n---------------------");
    console.log("---------------------");
    return game();
  }
}
