const Pet = require('../models/petModel');

const addPet = async (req, res) => {
  try {
    const {
      petType,
      dogID,
      catID,
      name,
      breed,
      gender,
      dob,
      age,
      donorId,
      donorName,
      donatedDate,
      healthStatus,
      status,
      qrCode,
      image,
      ownerId,
      ownerName,
    } = req.body;

    // Optional: sanitize fields
    const sanitizedQr = qrCode?.replace(/^data:image\/[^;]+;base64,/, '');
    const sanitizedImg = image?.replace(/^data:image\/[^;]+;base64,/, '');

    const newPet = new Pet({
      petType,
      dogID: petType === 'Dog' ? dogID : undefined,
      catID: petType === 'Cat' ? catID : undefined,
      name,
      breed,
      gender,
      dob,
      age,
      donorId,
      donorName,
      donatedDate,
      healthStatus,
      status,
      qrCode: sanitizedQr,
      image: sanitizedImg,
      ownerId,
      ownerName,
    });

    await newPet.save();

    res.status(201).json({
      message: 'Pet added successfully',
      pet: newPet,
    });
  } catch (error) {
    console.error('Error adding pet:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



//get all pets
const getAllPets = async (req, res, next) => {
  let Pets;
  try {
    Pets = await Pet.find();
  } catch (err) {
    console.log("Error fetching pets!", err);
  }
  if (!Pets) {
    return res.status(404).json({ message: "No pets found" });
  }
  return res.status(200).json({ Pets });
};


//get all dogs
const getAllDogs = async (req, res) => {
  try {
    const dogs = await Pet.find({ petType: 'Dog' });

    if (!dogs.length) {
      return res.status(200).json({ message: "No dogs found" });
    }

    return res.status(200).json({ dogs });
  } catch (error) {
    console.error("Error fetching dogs:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

//get all cats
const getAllCats = async (req, res) => {
  try {
    const cats = await Pet.find({ petType: 'Cat' });

    if (!cats.length) {
      return res.status(200).json({ message: "No cats found" });
    }

    return res.status(200).json({ cats });
  } catch (error) {
    console.error("Error fetching cats:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

//get pet by id
const getPetById = async (req, res, next) => {
  const id = req.params.id;

  let pet;
  try {
    pet = await User.findById(id);
  } catch (err) {
    console.log("Error fetching pet:", err);
  }
  if (!pet) {
    return res.status(404).json({ message: "Pet Not Found" });
  }
  return res.status(200).json({ pet });
};


exports.addPet = addPet;
exports.getAllPets = getAllPets;
exports.getAllDogs = getAllDogs;
exports.getAllCats = getAllCats;
exports.getPetById = getPetById;

