const fangYuanQuotes = [
  "A calm mind weighs profit and loss before pride.",
  "Mercy without strength is only a wish.",
  "The road forward belongs to the one who can endure loneliness.",
  "A person who fears sacrifice cannot hold ambition for long.",
  "Kind words are useful, but useful actions decide the result.",
  "When the world changes, stubbornness becomes a chain.",
  "Reputation is wind; benefit is weight.",
  "Do not ask whether the path is cruel. Ask whether it leads forward.",
  "A clear goal turns pain into a price already accepted.",
  "Those who survive are not always the strongest, but they are always adapting.",
  "Sentiment can warm the heart, but it must not blind the eyes.",
  "Victory often belongs to the one who can wait one moment longer.",
  "If the rules block the path, understand the rules better than anyone else.",
  "Fear is useful only when it sharpens judgment.",
  "A thousand doubts cannot defeat one steady step.",
];

function getRandomFangYuanQuote() {
  const index = Math.floor(Math.random() * fangYuanQuotes.length);

  return fangYuanQuotes[index];
}

module.exports = {
  fangYuanQuotes,
  getRandomFangYuanQuote,
};
