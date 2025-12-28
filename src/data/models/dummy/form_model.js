export class FormStatus {
  constructor({
    id,
    animalName,
    animalBreed,
    animalImage,
    pdf,
    userName,
    userAvatar,
    timeInText, // string: "2 Jam 1 menit 30detik"
  }) {
    this.id = id;
    this.animalName = animalName;
    this.animalBreed = animalBreed;
    this.animalImage = animalImage;
    this.pdf = pdf;
    this.userName = userName;
    this.userAvatar = userAvatar;
    this.timeInText = timeInText;
  }
}
