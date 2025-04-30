const Pet = require('../models/petModel');

// Controller to add pet with data coming from frontend
const addPet = async (req, res) => {
  try {
    const {
      petType,
      dogID,
      catID,
      name,
      breed,
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

  

    // Create new pet object
    const newPet = new Pet({
      petType,
      dogID: petType === 'Dog' ? dogID : undefined,
      catID: petType === 'Cat' ? catID : undefined,
      name,
      breed,
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
    });

    // Save to database
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

module.exports = { addPet };
