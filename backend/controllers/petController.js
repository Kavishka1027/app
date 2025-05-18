const Pet = require('../models/petModel');
const QRCode = require('qrcode');



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
      image,           // base-64 sent from client
      ownerId,
      ownerName,
    } = req.body;

    // ─── sanitize incoming base-64 image (remove data URI header) ───
    const sanitizedImg = image?.replace(/^data:image\/[^;]+;base64,/, '');

    // ─── create & save the pet first (QR needs the _id) ───
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
      image: sanitizedImg,
      ownerId,
      ownerName,
    });

    await newPet.save();        // _id now exists

    // ─── generate QR with full URL and update the pet ───
    newPet.qrCode = await makePetQR(newPet);   // base-64 SVG
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



const getAllPets = async (req, res, next) => {
  try {
    const pets = await Pet.find();

    if (!pets || pets.length === 0) {
      return res.status(404).json({ message: "No pets found" });
    }

    return res.status(200).json({ pets });
  } catch (err) {
    console.error("Error fetching pets:", err);
    return res.status(500).json({ message: "Server error while fetching pets" });
  }
};



// Get pet by ID
const getPetById = async (req, res, next) => {
  const id = req.params.id;

  try {
    // Use the Pet model instead of User model
    const pet = await Pet.findById(id);
    
    if (!pet) {
      return res.status(404).json({ message: "Pet Not Found" });
    }
    
    return res.status(200).json({ pet });
  } catch (err) {
    console.error("Error fetching pet:", err);
    return res.status(500).json({ 
      message: "Failed to fetch pet details", 
      error: err.message 
    });
  }
};


const makePetQR = async (pet) => {
  const url = `http://localhost:3000/petProfile/${pet._id}`; 
  try {
    const qrCodeDataURL = await QRCode.toDataURL(url);
    return qrCodeDataURL; // base64 string
  } catch (err) {
    console.error('QR generation failed:', err);
    return null;
  }
};

exports.addPet = addPet;
exports.getAllPets = getAllPets;
exports.getPetById = getPetById;

