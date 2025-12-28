export class Animal {
  constructor({
    id,
    animalName,
    animalBreed,
    animalImage,
    price,
    status,
    timeInText,
  }) {
    this.id = id;
    this.animalName = animalName;
    this.animalBreed = animalBreed;
    this.animalImage = animalImage;
    this.price = price;
    this.status = status;
    this.timeInText = timeInText;
  }
}
