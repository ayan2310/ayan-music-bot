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
  "Humans are isolated islands floating in the sea of fate."
];

const fangYuanImages = [
  "https://picsum.photos/seed/fang-yuan-mountain/1000/420",
  "https://picsum.photos/seed/fang-yuan-mist/1000/420",
  "https://picsum.photos/seed/fang-yuan-path/1000/420",
  "https://picsum.photos/seed/fang-yuan-night/1000/420",
  "https://picsum.photos/seed/fang-yuan-stone/1000/420",
];

function getRandomFangYuanQuote() {
  const index = Math.floor(Math.random() * fangYuanQuotes.length);

  return fangYuanQuotes[index];
}

function getRandomFangYuanImage() {
  const index = Math.floor(Math.random() * fangYuanImages.length);

  return fangYuanImages[index];
}

module.exports = {
  fangYuanImages,
  fangYuanQuotes,
  getRandomFangYuanImage,
  getRandomFangYuanQuote,
};
