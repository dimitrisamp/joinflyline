const filenames = [
  "Antalya.jpg",
  "Chicago2.jpg",
  "Beijing3.jpg",
  "Amsterdam1.jpg"
];

export function getRandomImage() {
  const randFilename = filenames[Math.floor(Math.random() * filenames.length)];
  return `./photo_bank/${randFilename}`;
}
