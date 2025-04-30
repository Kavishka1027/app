const mongoose = require('mongoose');

// List of vaccines for dogs and cats (hardcoded)
const dogVaccines = [
  "Rabies",
  "Distemper",
  "Parvovirus",
  "Leptospirosis",
  "Bordetella",
  "Canine Influenza"
];

const catVaccines = [
  "Rabies",
  "Feline Distemper",
  "Feline Leukemia",
  "Feline Immunodeficiency Virus",
  "Panleukopenia",
  "Chlamydia"
];

// Schema for Treatment
const treatmentSchema = new mongoose.Schema({
  description: { type: String, required: true },
  treatedDate: { type: Date, required: true },
  veterinarian: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Assuming User model holds vet details
    required: true 
  },
  vetName: { type: String, required: true } // Vet's name
});

// Schema for Vaccination
const vaccinationSchema = new mongoose.Schema({
  vaccineName: { 
    type: String, 
    enum: dogVaccines.concat(catVaccines), // Restrict vaccine names based on pet type
    required: true 
  },
  vaccinatedDate: { type: Date, required: true },
  nextVaccinationDate: { type: Date }, // For reminder system
  reminderSent: { type: Boolean, default: false },
  veterinarian: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  vetName: { type: String, required: true } // Vet's name
});

// Schema for Checkup
const checkupSchema = new mongoose.Schema({
  description: { type: String, required: true }, // Description of the checkup
  scheduledDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending'
  },
  completedDate: { type: Date },
  veterinarian: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  vetName: { type: String, required: true } // Vet's name
});

// HealthRecord Schema
const healthRecordSchema = new mongoose.Schema({
  pet: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Pet', 
    required: true 
  },
  petType: { 
    type: String, 
    enum: ['dog', 'cat'], 
    required: true 
  },
  treatments: [treatmentSchema],
  vaccinations: [vaccinationSchema],
  checkups: [checkupSchema],
  recommendedCheckupCount: { type: Number, default: 0 }, // Number of recommended checkups by vet
  completedCheckupCount: { type: Number, default: 0 }, // Completed checkups
  failedCheckupCount: { type: Number, default: 0 }, // Failed checkups (missed, not done)
  certificateIssued: { type: Boolean, default: false }, // Flag to indicate if certificate has been issued
  certificateDetails: { 
    type: String, 
    default: "" // Certificate details (e.g., "Health certificate issued by Dr. Smith on <date>")
  }
}, { timestamps: true });

// Method to check if all checkups are completed successfully
healthRecordSchema.methods.checkIfCertificateCanBeIssued = function() {
  const allCheckupsCompleted = this.checkups.every(checkup => checkup.status === 'Completed');
  const allCheckupsSuccessful = this.checkups.every(checkup => checkup.status === 'Completed' && checkup.completedDate !== null);

  if (allCheckupsCompleted && allCheckupsSuccessful) {
    this.certificateIssued = true;
    this.certificateDetails = `Health certificate issued by veterinarian on ${new Date().toISOString().split('T')[0]}`;
    return true; // Certificate can be issued
  } else {
    this.certificateIssued = false;
    this.certificateDetails = "";
    return false; // Certificate cannot be issued yet
  }
};

// Create the HealthRecord model
const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);

module.exports = HealthRecord;
