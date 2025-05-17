// controllers/healthRecordController.js


const HealthRecord = require('../models/healthRecordModel');
const Pet = require('../models/petModel'); // Assuming you have a Pet model
const User = require('../models/userModel'); // Assuming you have a User model for vets

// Add Health Record
const addHealthRecord = async (req, res) => {
  try {
    const { petId, petType, treatments, vaccinations, checkups, recommendedCheckupCount, completedCheckupCount, failedCheckupCount } = req.body;

    // Find the pet to associate the health record with
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Creating new health record
    const newHealthRecord = new HealthRecord({
      pet: petId,
      petType: petType,
      treatments: treatments,
      vaccinations: vaccinations,
      checkups: checkups,
      recommendedCheckupCount: recommendedCheckupCount || 0,
      completedCheckupCount: completedCheckupCount || 0,
      failedCheckupCount: failedCheckupCount || 0,
    });

    // Check if all checkups are completed successfully and issue certificate if valid
    const canIssueCertificate = newHealthRecord.checkIfCertificateCanBeIssued();
    
    if (canIssueCertificate) {
      await newHealthRecord.save();
      return res.status(200).json({
        message: 'Health record added successfully, certificate issued.',
        healthRecord: newHealthRecord,
      });
    } else {
      await newHealthRecord.save();
      return res.status(200).json({
        message: 'Health record added successfully, but certificate cannot be issued yet.',
        healthRecord: newHealthRecord,
      });
    }
  } catch (error) {
    console.error('Error adding health record:', error);
    return res.status(500).json({ message: 'Error adding health record' });
  }
};



exports.addHealthRecord = addHealthRecord;
