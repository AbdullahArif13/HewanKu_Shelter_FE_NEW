export class PaymentTransaction {
  constructor({
    id,
    animalName,
    animalBreed,
    animalImage,
    price,
    paymentMethod, // "qris" | "mandiri" | "gopay" | "dana"
    userName,
    userAvatar,
    timeInText, // string: "2 Jam 1 menit 30detik"
  }) {
    this.id = id;
    this.animalName = animalName;
    this.animalBreed = animalBreed;
    this.animalImage = animalImage;
    this.price = price;
    this.paymentMethod = paymentMethod;
    this.userName = userName;
    this.userAvatar = userAvatar;
    this.timeInText = timeInText;
  }
}
