// HowLongToBeatCrawler by Zap0xfce2
// Version 1.0 @ 05.08.2018
// Updated 1.1 @ 05.02.2022

let hltb = require("howlongtobeat");
var commandLineArgs = require("command-line-args");

let hltbService = new hltb.HowLongToBeatService();
const optionDefinitions = [
  {
    name: "game",
    type: String,
    defaultOption: true,
  },
  {
    name: "gameid",
    type: Number,
  },
  {
    name: "json",
    type: Boolean,
    alias: "j",
  },
];
const options = commandLineArgs(optionDefinitions);

if (
  typeof options.game === "undefined" &&
  typeof options.gameid === "undefined"
) {
  console.log("HowLongToBeatCrawler 1.1 by Zap0xfce2");
  console.log("Verwendung: ./hltb <Spielname>");
  console.log('Mögliche Optionen: --game "Spielname" oder --gameid "SpielID"');
  console.log(
    "Die Ausgabe erfolgt in XML für Alfred. Kann aber mit -j auf Json umgeschaltet werden."
  );
  console.log(" ");
} else {
  // Suche nach Titel
  if (typeof options.gameid === "undefined") {
    if (options.json) {
      // Json ausgabe
      hltbService.search(options.game).then((result) => console.log(result));
    } else {
      // XML Ausgabe für Alfred
      hltbService.search(options.game).then((result) => {
        var Suchergebnis = JSON.parse(JSON.stringify(result));

        console.log('<?xml version="1.0"?><items>');
        Suchergebnis.forEach(function (element) {
          console.log(
            '<item uid="' + element.id + '" arg="' + element.id + '">'
          );
          console.log("<title>" + element.name + "</title>");
          console.log(
            "<subtitle>Die Spielzeit beträgt circa " +
              element.gameplayMain +
              " Stunden. In " +
              element.gameplayCompletionist +
              " Stunden hast du's zu 100% durch.</subtitle>"
          );
          console.log("<icon>icon.png</icon>");
          console.log("</item>");
        });
        console.log("</items>");
      });
    }
  }

  // Suche nach GameID
  if (typeof options.game === "undefined") {
    hltbService
      .detail(options.gameid)
      .then((result) => console.log(result))
      .catch((e) => console.error(e));
  }
}
