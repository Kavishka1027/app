// Updated DietPlan.js component with download functionality
import React, { useState, useRef } from 'react';
import './dietPlan.css';

// GET diet plan by calories
const getWeeklyDietPlan = async (dailyCalories) => {
  const res = await fetch(`http://localhost:5000/api/foods/dietPlan?dailyCalories=${dailyCalories}`);
  if (!res.ok) throw new Error('Failed to fetch diet plan');
  const data = await res.json();
  return data; // Return the entire data object
};

const calculateCalories = (petType, weightKg, weightG, ageLevel, activityLevel) => {
  const totalKg = weightKg + weightG / 1000;
  const rer = 70 * Math.pow(totalKg, 0.75);
  let m = 1;
  if (petType === 'dog') {
    if (ageLevel === 'puppy') m = { low: 2.5, normal: 3, high: 3.5 }[activityLevel];
    if (ageLevel === 'adult') m = { low: 1.4, normal: 1.6, high: 2 }[activityLevel];
    if (ageLevel === 'senior') m = { low: 1.2, normal: 1.4, high: 1.6 }[activityLevel];
  } else if (petType === 'cat') {
    if (ageLevel === 'kitten') m = { low: 2, normal: 2.5, high: 3 }[activityLevel];
    if (ageLevel === 'adult') m = { low: 1, normal: 1.2, high: 1.5 }[activityLevel];
    if (ageLevel === 'senior') m = { low: 1, normal: 1.1, high: 1.3 }[activityLevel];
  }
  return Math.round(rer * m * 100) / 100;
};

// Function to generate text content for download
const generateDietPlanText = (dietPlan, calories, petInfo) => {
  let content = `PET DIET PLAN\n\n`;
  
  // Add pet information
  content += `Pet Type: ${petInfo.petType}\n`;
  content += `Weight: ${petInfo.weightKg}kg ${petInfo.weightG}g\n`;
  content += `Age Level: ${petInfo.ageLevel}\n`;
  content += `Activity Level: ${petInfo.activityLevel}\n\n`;
  content += `Daily Calories Needed: ${calories} kcal\n\n`;
  
  content += `WEEKLY DIET PLAN\n\n`;
  
  // Add each day's plan
  dietPlan.forEach(day => {
    content += `== ${day.day} ==\n`;
    
    // Calculate total calories for the day
    const dayCalories = day.items.reduce((total, item) => {
      return total + (item.caloriesPer100g * item.weightInGrams / 100);
    }, 0).toFixed(2);
    
    content += `Daily Total: ${dayCalories} kcal\n\n`;
    
    // Add each food item
    day.items.forEach(item => {
      const itemCalories = Math.round(item.caloriesPer100g * item.weightInGrams / 100);
      content += `${item.category}: ${item.name} - ${item.weightInGrams}g (${itemCalories} kcal)\n`;
    });
    
    content += `\n`;
  });
  
  return content;
};

// Function to download diet plan as a text file
const downloadDietPlan = (dietPlan, calories, petInfo) => {
  const content = generateDietPlanText(dietPlan, calories, petInfo);
  
  // Create a blob with the text content
  const blob = new Blob([content], { type: 'text/plain' });
  
  // Create a download link
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  // Set up the download
  const petName = petInfo.petType.charAt(0).toUpperCase() + petInfo.petType.slice(1);
  link.download = `${petName}_Diet_Plan.txt`;
  link.href = url;
  
  // Trigger the download
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export default function DietPlan() {
  const [petType, setPetType] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [weightG, setWeightG] = useState('');
  const [ageLevel, setAgeLevel] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [calories, setCalories] = useState(null);
  const [dietPlan, setDietPlan] = useState([]);
  const [error, setError] = useState('');
  
  const dietPlanRef = useRef(null);

  const handleCalculate = async () => {
    setError('');
    const kg = parseInt(weightKg, 10) || 0;
    const g = parseInt(weightG, 10) || 0;
    const totalKg = kg + g / 1000;

    if (!petType || !ageLevel || !activityLevel) return setError('Please fill in all fields.');
    if (kg < 0 || g < 0 || !Number.isInteger(kg) || !Number.isInteger(g)) return setError('Weight must be positive integers.');
    if (kg && g >= 1000) return setError('If kg is filled, g should be < 1000.');
    if (!totalKg) return setError('Enter at least one weight value.');
    if ((petType === 'dog' && totalKg > 200) || (petType === 'cat' && totalKg > 20)) return setError('Weight exceeds limit.');

    const cal = calculateCalories(petType, kg, g, ageLevel, activityLevel);
    setCalories(cal);
    console.log('Calories calculated:', cal);

    try {
      const data = await getWeeklyDietPlan(cal);
      setDietPlan(data.dietPlan || []);
      console.log('Diet Plan:', data.dietPlan);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch diet plan');
    }
  };

  const handleDownload = () => {
    if (dietPlan.length > 0 && calories) {
      const petInfo = {
        petType,
        weightKg,
        weightG,
        ageLevel,
        activityLevel
      };
      
      downloadDietPlan(dietPlan, calories, petInfo);
    }
  };

  const ageOptions = petType === 'dog'
    ? [ ['puppy','Puppy (0-1 years)'], ['adult','Adult (1-7 years)'], ['senior','Senior (7+ years)'] ]
    : petType === 'cat'
    ? [ ['kitten','Kitten (0-1 years)'], ['adult','Adult (1-10 years)'], ['senior','Senior (10+ years)'] ]
    : [];

  // Calculate total calories for a day's plan
  const calculateDayCalories = (items) => {
    return items.reduce((total, item) => {
      return total + (item.caloriesPer100g * item.weightInGrams / 100);
    }, 0).toFixed(2);
  };

  return (
    <div className="diet-plan-container">
      <h2>Pet Diet Plan Calculator</h2>

      <div className="form-group">
        <label>Pet Type:</label>
        <select value={petType} onChange={(e)=>{setPetType(e.target.value);setAgeLevel('');}}>
          <option value="">Select</option><option value="dog">Dog</option><option value="cat">Cat</option>
        </select>
      </div>

      <div className="form-group-two-column">
        <div className="form-group"><label>Weight (kg):</label><input type="number" value={weightKg} onChange={e=>setWeightKg(e.target.value)} /></div>
        <div className="form-group"><label>(g):</label><input type="number" value={weightG} onChange={e=>setWeightG(e.target.value)} /></div>
      </div>

      <div className="form-group">
        <label>Age Level:</label>
        <select value={ageLevel} onChange={e=>setAgeLevel(e.target.value)}>
          <option value="">Select</option>
          {ageOptions.map(([val,txt])=> <option key={val} value={val}>{txt}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label>Activity Level:</label>
        <select value={activityLevel} onChange={e=>setActivityLevel(e.target.value)}>
          <option value="">Select</option>
          <option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option>
        </select>
      </div>

      <button onClick={handleCalculate} className="calculate-button">Calculate Diet Plan</button>

      {error && <p className="error-message">{error}</p>}

      {calories !== null && !error && (
        <div className="result-label">
          <h3>Daily Calories Needed: {calories} kcal</h3>
          <p>Based on your pet's weight, age, and activity level</p>
        </div>
      )}

      {dietPlan.length > 0 && (
        <div className="diet-plan-result" ref={dietPlanRef}>
          <div className="diet-plan-header">
            <h3>Weekly Diet Plan</h3>
            <button onClick={handleDownload} className="download-button">Download Diet Plan</button>
          </div>
          
          <div className="diet-plan-grid">
            {dietPlan.map((day) => (
              <div key={day.day} className="day-card">
                <h4>{day.day}</h4>
                <div className="calories-summary">
                  Daily Total: {calculateDayCalories(day.items)} kcal
                </div>
                <div className="food-items">
                  {day.items.map(item => (
                    <div key={`${day.day}-${item.category}-${item.name}`} className="food-item">
                      <div className="food-category">{item.category}</div>
                      <div className="food-name">{item.name}</div>
                      <div className="food-amount">{item.weightInGrams}g</div>
                      <div className="food-calories">
                        ({Math.round(item.caloriesPer100g * item.weightInGrams / 100)} kcal)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}