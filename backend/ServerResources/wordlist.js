// Taken from https://github.com/seanlyons/codenames/blob/master/wordlist.txt

const words = [
  { id: 1, word: 'africa', status: 'safe' },
  { id: 2, word: 'agent', status: 'safe' },
  { id: 3, word: 'air', status: 'safe' },
  { id: 4, word: 'alien', status: 'safe' },
  { id: 5, word: 'amazon', status: 'safe' },
  { id: 6, word: 'angel', status: 'safe' },
  { id: 7, word: 'antarctica', status: 'safe' },
  { id: 8, word: 'apple', status: 'safe' },
  { id: 9, word: 'arm', status: 'safe' },
  { id: 10, word: 'back', status: 'safe' },
  { id: 11, word: 'band', status: 'safe' },
  { id: 12, word: 'bank', status: 'safe' },
  { id: 13, word: 'bark', status: 'safe' },
  { id: 14, word: 'beach', status: 'safe' },
  { id: 15, word: 'belt', status: 'safe' },
  { id: 16, word: 'berlin', status: 'safe' },
  { id: 17, word: 'berry', status: 'safe' },
  { id: 18, word: 'board', status: 'safe' },
  { id: 19, word: 'bond', status: 'safe' },
  { id: 20, word: 'boom', status: 'safe' },
  { id: 21, word: 'bow', status: 'safe' },
  { id: 22, word: 'box', status: 'safe' },
  { id: 23, word: 'bug', status: 'safe' },
  { id: 24, word: 'canada', status: 'safe' },
  { id: 25, word: 'capital', status: 'safe' },
  { id: 26, word: 'cell', status: 'safe' },
  { id: 27, word: 'center', status: 'safe' },
  { id: 28, word: 'china', status: 'safe' },
  { id: 29, word: 'chocolate', status: 'safe' },
  { id: 30, word: 'circle', status: 'safe' },
  { id: 31, word: 'club', status: 'safe' },
  { id: 32, word: 'compound', status: 'safe' },
  { id: 33, word: 'copper', status: 'safe' },
  { id: 34, word: 'crash', status: 'safe' },
  { id: 35, word: 'cricket', status: 'safe' },
  { id: 36, word: 'cross', status: 'safe' },
  { id: 37, word: 'death', status: 'safe' },
  { id: 38, word: 'dice', status: 'safe' },
  { id: 39, word: 'dinosaur', status: 'safe' },
  { id: 40, word: 'doctor', status: 'safe' },
  { id: 41, word: 'dog', status: 'safe' },
  { id: 42, word: 'dress', status: 'safe' },
  { id: 43, word: 'dwarf', status: 'safe' },
  { id: 44, word: 'eagle', status: 'safe' },
  { id: 45, word: 'egypt', status: 'safe' },
  { id: 46, word: 'engine', status: 'safe' },
  { id: 47, word: 'england', status: 'safe' },
  { id: 48, word: 'europe', status: 'safe' },
  { id: 49, word: 'eye', status: 'safe' },
  { id: 50, word: 'fair', status: 'safe' },
  { id: 51, word: 'fall', status: 'safe' },
  { id: 52, word: 'fan', status: 'safe' },
  { id: 53, word: 'field', status: 'safe' },
  { id: 54, word: 'file', status: 'safe' },
  { id: 55, word: 'film', status: 'safe' },
  { id: 56, word: 'fish', status: 'safe' },
  { id: 57, word: 'flute', status: 'safe' },
  { id: 58, word: 'fly', status: 'safe' },
  { id: 59, word: 'forest', status: 'safe' },
  { id: 60, word: 'fork', status: 'safe' },
  { id: 61, word: 'france', status: 'safe' },
  { id: 62, word: 'gas', status: 'safe' },
  { id: 63, word: 'ghost', status: 'safe' },
  { id: 64, word: 'giant', status: 'safe' },
  { id: 65, word: 'glass', status: 'safe' },
  { id: 66, word: 'glove', status: 'safe' },
  { id: 67, word: 'gold', status: 'safe' },
  { id: 68, word: 'grass', status: 'safe' },
  { id: 69, word: 'greece', status: 'safe' },
  { id: 70, word: 'green', status: 'safe' },
  { id: 71, word: 'ham', status: 'safe' },
  { id: 72, word: 'head', status: 'safe' },
  { id: 73, word: 'himalaya', status: 'safe' },
  { id: 74, word: 'hole', status: 'safe' },
  { id: 75, word: 'hood', status: 'safe' },
  { id: 76, word: 'hook', status: 'safe' },
  { id: 77, word: 'human', status: 'safe' },
  { id: 78, word: 'horseshoe', status: 'safe' },
  { id: 79, word: 'hospital', status: 'safe' },
  { id: 80, word: 'hotel', status: 'safe' },
  { id: 81, word: 'ice', status: 'safe' },
  { id: 82, word: 'ice cream', status: 'safe' },
  { id: 83, word: 'india', status: 'safe' },
  { id: 84, word: 'iron', status: 'safe' },
  { id: 85, word: 'ivory', status: 'safe' },
  { id: 86, word: 'jam', status: 'safe' },
  { id: 87, word: 'jet', status: 'safe' },
  { id: 88, word: 'jupiter', status: 'safe' },
  { id: 89, word: 'kangaroo', status: 'safe' },
  { id: 90, word: 'ketchup', status: 'safe' },
  { id: 91, word: 'kid', status: 'safe' },
  { id: 92, word: 'king', status: 'safe' },
  { id: 93, word: 'kiwi', status: 'safe' },
  { id: 94, word: 'knife', status: 'safe' },
  { id: 95, word: 'knight', status: 'safe' },
  { id: 96, word: 'lab', status: 'safe' },
  { id: 97, word: 'lap', status: 'safe' },
  { id: 98, word: 'laser', status: 'safe' },
  { id: 99, word: 'lawyer', status: 'safe' },
  { id: 100, word: 'lead', status: 'safe' },
  { id: 101, word: 'lemon', status: 'safe' },
  { id: 102, word: 'limousine', status: 'safe' },
  { id: 104, word: 'log', status: 'safe' },
  { id: 105, word: 'mammoth', status: 'safe' },
  { id: 106, word: 'maple', status: 'safe' },
  { id: 107, word: 'march', status: 'safe' },
  { id: 108, word: 'mass', status: 'safe' },
  { id: 109, word: 'mercury', status: 'safe' },
  { id: 110, word: 'millionaire', status: 'safe' },
  { id: 111, word: 'model', status: 'safe' },
  { id: 112, word: 'mole', status: 'safe' },
  { id: 113, word: 'moscow', status: 'safe' },
  { id: 114, word: 'mouth', status: 'safe' },
  { id: 115, word: 'mug', status: 'safe' },
  { id: 116, word: 'needle', status: 'safe' },
  { id: 117, word: 'net', status: 'safe' },
  { id: 118, word: 'new york', status: 'safe' },
  { id: 119, word: 'night', status: 'safe' },
  { id: 120, word: 'note', status: 'safe' },
  { id: 121, word: 'novel', status: 'safe' },
  { id: 122, word: 'nurse', status: 'safe' },
  { id: 123, word: 'nut', status: 'safe' },
  { id: 124, word: 'oil', status: 'safe' },
  { id: 125, word: 'olive', status: 'safe' },
  { id: 126, word: 'olympus', status: 'safe' },
  { id: 127, word: 'opera', status: 'safe' },
  { id: 128, word: 'orange', status: 'safe' },
  { id: 129, word: 'paper', status: 'safe' },
  { id: 130, word: 'park', status: 'safe' },
  { id: 131, word: 'part', status: 'safe' },
  { id: 132, word: 'paste', status: 'safe' },
  { id: 133, word: 'phoenix', status: 'safe' },
  { id: 134, word: 'piano', status: 'safe' },
  { id: 135, word: 'telescope', status: 'safe' },
  { id: 136, word: 'teacher', status: 'safe' },
  { id: 137, word: 'switch', status: 'safe' },
  { id: 138, word: 'swing', status: 'safe' },
  { id: 139, word: 'sub', status: 'safe' },
  { id: 140, word: 'stick', status: 'safe' },
  { id: 141, word: 'staff', status: 'safe' },
  { id: 142, word: 'stadium', status: 'safe' },
  { id: 143, word: 'sprint', status: 'safe' },
  { id: 144, word: 'spike', status: 'safe' },
  { id: 145, word: 'snowman', status: 'safe' },
  { id: 146, word: 'slip', status: 'safe' },
  { id: 147, word: 'shot', status: 'safe' },
  { id: 148, word: 'shadow', status: 'safe' },
  { id: 149, word: 'server', status: 'safe' },
  { id: 150, word: 'ruler', status: 'safe' },
  { id: 151, word: 'row', status: 'safe' },
  { id: 152, word: 'rose', status: 'safe' },
  { id: 153, word: 'root', status: 'safe' },
  { id: 154, word: 'rome', status: 'safe' },
  { id: 155, word: 'rock', status: 'safe' },
  { id: 156, word: 'robot', status: 'safe' },
  { id: 157, word: 'robin', status: 'safe' },
  { id: 158, word: 'revolution', status: 'safe' },
  { id: 159, word: 'rat', status: 'safe' },
  { id: 160, word: 'racket', status: 'safe' },
  { id: 161, word: 'queen', status: 'safe' },
  { id: 162, word: 'press', status: 'safe' },
  { id: 163, word: 'port', status: 'safe' },
  { id: 164, word: 'pilot', status: 'safe' },
  { id: 165, word: 'time', status: 'safe' },
  { id: 166, word: 'tooth', status: 'safe' },
  { id: 167, word: 'tower', status: 'safe' },
  { id: 168, word: 'truck', status: 'safe' },
  { id: 169, word: 'triangle', status: 'safe' },
  { id: 170, word: 'trip', status: 'safe' },
  { id: 171, word: 'turkey', status: 'safe' },
  { id: 172, word: 'undertaker', status: 'safe' },
  { id: 173, word: 'unicorn', status: 'safe' },
  { id: 174, word: 'vacuum', status: 'safe' },
  { id: 175, word: 'van', status: 'safe' },
  { id: 176, word: 'wake', status: 'safe' },
  { id: 177, word: 'wall', status: 'safe' },
  { id: 178, word: 'war', status: 'safe' },
  { id: 179, word: 'washer', status: 'safe' },
  { id: 180, word: 'washington', status: 'safe' },
  { id: 181, word: 'water', status: 'safe' },
  { id: 182, word: 'wave', status: 'safe' },
  { id: 183, word: 'well', status: 'safe' },
  { id: 184, word: 'whale', status: 'safe' },
  { id: 185, word: 'whip', status: 'safe' },
  { id: 186, word: 'worm', status: 'safe' },
  { id: 187, word: 'yard', status: 'safe' },
];

// Object.freeze(GameStateEnum);

module.exports = words;
