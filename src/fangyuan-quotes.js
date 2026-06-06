const fangYuanQuotes = [
  "Don't think so much when killing people.",
  "I can kill others, others can naturally come to kill me. This is nothing.",
  "I would rather let the world down, than be let down by the world!!!",
  "Death, such a sweet fragrance!",
  "Kill, kill!",
  "He had always been Gu Yue Fang Yuan.",
  "Only perseverance remains in my heart.",
  "Only eternal life was worthy of being his target to pursue.",
  "This person cannot be reformed.",
];

function getRandomFangYuanQuote() {
  const index = Math.floor(Math.random() * fangYuanQuotes.length);

  return fangYuanQuotes[index];
}

module.exports = {
  fangYuanQuotes,
  getRandomFangYuanQuote,
};
