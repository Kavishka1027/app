// import React, { useState } from 'react';
// import './dietPlan.css'; // Assuming you have a CSS file for styling

// const calculateCalories = (petType, weightKg, weightG, ageLevel, activityLevel) => {
//     const totalWeightKg = weightKg + (weightG / 1000);
//     const rer = 70 * Math.pow(totalWeightKg, 0.75);

//     let multiplier = 1.0;

//     if (petType === 'dog') {
//         if (ageLevel === 'puppy') {
//             if (activityLevel === 'low') multiplier = 2.5;
//             else if (activityLevel === 'normal') multiplier = 3.0;
//             else if (activityLevel === 'high') multiplier = 3.5;
//         } else if (ageLevel === 'adult') {
//             if (activityLevel === 'low') multiplier = 1.4;
//             else if (activityLevel === 'normal') multiplier = 1.6;
//             else if (activityLevel === 'high') multiplier = 2.0;
//         } else if (ageLevel === 'senior') {
//             if (activityLevel === 'low') multiplier = 1.2;
//             else if (activityLevel === 'normal') multiplier = 1.4;
//             else if (activityLevel === 'high') multiplier = 1.6;
//         }
//     } else if (petType === 'cat') {
//         if (ageLevel === 'kitten') {
//             if (activityLevel === 'low') multiplier = 2.0;
//             else if (activityLevel === 'normal') multiplier = 2.5;
//             else if (activityLevel === 'high') multiplier = 3.0;
//         } else if (ageLevel === 'adult') {
//             if (activityLevel === 'low') multiplier = 1.0;
//             else if (activityLevel === 'normal') multiplier = 1.2;
//             else if (activityLevel === 'high') multiplier = 1.5;
//         } else if (ageLevel === 'senior') {
//             if (activityLevel === 'low') multiplier = 1.0;
//             else if (activityLevel === 'normal') multiplier = 1.1;
//             else if (activityLevel === 'high') multiplier = 1.3;
//         }
//     }

//     const dailyCalories = rer * multiplier;
//     return Math.round(dailyCalories * 100) / 100;
// };

// const DietPlan = () => {
//     const [petType, setPetType] = useState('');
//     const [weightKg, setWeightKg] = useState('');
//     const [weightG, setWeightG] = useState('');
//     const [ageLevel, setAgeLevel] = useState('');
//     const [activityLevel, setActivityLevel] = useState('');
//     const [calories, setCalories] = useState(null);
//     const [error, setError] = useState('');

//     const handleCalculate = () => {
//         setError('');

//         const kg = parseInt(weightKg, 10) || 0;
//         const g = parseInt(weightG, 10) || 0;

//         const totalWeightKg = kg + (g / 1000);

//         // Check if both weight fields are positive integers
//         if (!petType || !ageLevel || !activityLevel) {
//             setError('Please fill in all fields.');
//             return;
//         }

//         if (kg < 0 || g < 0 || !Number.isInteger(kg) || !Number.isInteger(g)) {
//             setError('Please enter positive integer numbers for weight.');
//             return;
//         }

//         // If kg is filled, g should be less than 1000
//         if (kg > 0 && g >= 1000) {
//             setError('If kg is filled, g should be less than 1000.');
//             return;
//         }

//         if (kg === 0 && g === 0) {
//             setError('Please enter at least one weight value (kg or g).');
//             return;
//         }

//         // Validate max weight for dogs and cats
//         if (petType === 'dog' && totalWeightKg > 200) {
//             setError('Dog weight must be 200 kg or less.');
//             return;
//         }

//         if (petType === 'cat' && totalWeightKg > 20) {
//             setError('Cat weight must be 20 kg or less.');
//             return;
//         }

//         const cal = calculateCalories(petType, kg, g, ageLevel, activityLevel);
//         setCalories(cal);
//     };

//     const getAgeOptions = () => {
//         if (petType === 'dog') {
//             return (
//                 <>
//                     <option value="puppy">Puppy (0-1 years)</option>
//                     <option value="adult">Adult (1-7 years)</option>
//                     <option value="senior">Senior (7+ years)</option>
//                 </>
//             );
//         } else if (petType === 'cat') {
//             return (
//                 <>
//                     <option value="kitten">Kitten (0-1 years)</option>
//                     <option value="adult">Adult (1-10 years)</option>
//                     <option value="senior">Senior (10+ years)</option>
//                 </>
//             );
//         } else {
//             return <option value="">Select Pet Type First</option>;
//         }
//     };

//     return (
//         <div className="diet-plan-container">
//             <h2>Diet Plan Calculator</h2>

//             <div className="form-group">
//                 <label>Pet Type:</label>
//                 <select value={petType} onChange={(e) => { setPetType(e.target.value); setAgeLevel(''); }}>
//                     <option value="">Select</option>
//                     <option value="dog">Dog</option>
//                     <option value="cat">Cat</option>
//                 </select>
//             </div>

//             <div className="form-group-two-column">
//                 <div className="form-group">
//                     <label>Weight (kg):</label>
//                     <input type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
//                 </div>

//                 <div className="form-group">
//                     <label> (g):</label>
//                     <input type="number" value={weightG} onChange={(e) => setWeightG(e.target.value)} />
//                 </div>
//             </div>

//             <div className="form-group">
//                 <label>Age Level:</label>
//                 <select value={ageLevel} onChange={(e) => setAgeLevel(e.target.value)}>
//                     <option value="">Select</option>
//                     {getAgeOptions()}
//                 </select>
//             </div>

//             <div className="form-group">
//                 <label>Activity Level:</label>
//                 <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
//                     <option value="">Select</option>
//                     <option value="low">Low (Sick, mostly resting, sedentary, pregnent)</option>
//                     <option value="normal">Normal (regular walks, playtime)</option>
//                     <option value="high">High (very active, daily exercise)</option>
//                 </select>
//             </div>

//             <button onClick={handleCalculate}>Calculate</button>

//             {error && <p className="error-message">{error}</p>}

//             {calories !== null && !error && (
//                 <div className="result-label">
//                     <h3>Daily Calories Needed: {calories} kcal</h3>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default DietPlan;

import React, { useState, useEffect } from 'react';
import './dietPlan.css'; // Assuming you have a CSS file for styling

const calculateCalories = (petType, weightKg, weightG, ageLevel, activityLevel) => {
    const totalWeightKg = weightKg + (weightG / 1000);
    const rer = 70 * Math.pow(totalWeightKg, 0.75);

    let multiplier = 1.0;

    if (petType === 'dog') {
        if (ageLevel === 'puppy') {
            if (activityLevel === 'low') multiplier = 2.5;
            else if (activityLevel === 'normal') multiplier = 3.0;
            else if (activityLevel === 'high') multiplier = 3.5;
        } else if (ageLevel === 'adult') {
            if (activityLevel === 'low') multiplier = 1.4;
            else if (activityLevel === 'normal') multiplier = 1.6;
            else if (activityLevel === 'high') multiplier = 2.0;
        } else if (ageLevel === 'senior') {
            if (activityLevel === 'low') multiplier = 1.2;
            else if (activityLevel === 'normal') multiplier = 1.4;
            else if (activityLevel === 'high') multiplier = 1.6;
        }
    } else if (petType === 'cat') {
        if (ageLevel === 'kitten') {
            if (activityLevel === 'low') multiplier = 2.0;
            else if (activityLevel === 'normal') multiplier = 2.5;
            else if (activityLevel === 'high') multiplier = 3.0;
        } else if (ageLevel === 'adult') {
            if (activityLevel === 'low') multiplier = 1.0;
            else if (activityLevel === 'normal') multiplier = 1.2;
            else if (activityLevel === 'high') multiplier = 1.5;
        } else if (ageLevel === 'senior') {
            if (activityLevel === 'low') multiplier = 1.0;
            else if (activityLevel === 'normal') multiplier = 1.1;
            else if (activityLevel === 'high') multiplier = 1.3;
        }
    }

    const dailyCalories = rer * multiplier;
    return Math.round(dailyCalories * 100) / 100;
};

// Function to fetch food items based on pet type and diet plan
const fetchFoodItems = async (petType) => {
    try {
        const response = await fetch(`/api/foods/dietPlan`);
        const data = await response.json();
        return data.foodItems; // assuming the API returns an array of food items
    } catch (error) {
        console.error("Error fetching food items:", error);
        return [];
    }
};

const DietPlan = () => {
    const [petType, setPetType] = useState('');
    const [weightKg, setWeightKg] = useState('');
    const [weightG, setWeightG] = useState('');
    const [ageLevel, setAgeLevel] = useState('');
    const [activityLevel, setActivityLevel] = useState('');
    const [calories, setCalories] = useState(null);
    const [foodItems, setFoodItems] = useState([]);
    const [error, setError] = useState('');

    // Fetch food items based on selected pet type
    useEffect(() => {
        if (petType) {
            fetchFoodItems(petType).then(items => setFoodItems(items));
        }
    }, [petType]);

    const handleCalculate = () => {
        setError('');

        const kg = parseInt(weightKg, 10) || 0;
        const g = parseInt(weightG, 10) || 0;

        const totalWeightKg = kg + (g / 1000);

        // Check if both weight fields are positive integers
        if (!petType || !ageLevel || !activityLevel) {
            setError('Please fill in all fields.');
            return;
        }

        if (kg < 0 || g < 0 || !Number.isInteger(kg) || !Number.isInteger(g)) {
            setError('Please enter positive integer numbers for weight.');
            return;
        }

        // If kg is filled, g should be less than 1000
        if (kg > 0 && g >= 1000) {
            setError('If kg is filled, g should be less than 1000.');
            return;
        }

        if (kg === 0 && g === 0) {
            setError('Please enter at least one weight value (kg or g).');
            return;
        }

        // Validate max weight for dogs and cats
        if (petType === 'dog' && totalWeightKg > 200) {
            setError('Dog weight must be 200 kg or less.');
            return;
        }

        if (petType === 'cat' && totalWeightKg > 20) {
            setError('Cat weight must be 20 kg or less.');
            return;
        }

        const cal = calculateCalories(petType, kg, g, ageLevel, activityLevel);
        setCalories(cal);
    };

    const getAgeOptions = () => {
        if (petType === 'dog') {
            return (
                <>
                    <option value="puppy">Puppy (0-1 years)</option>
                    <option value="adult">Adult (1-7 years)</option>
                    <option value="senior">Senior (7+ years)</option>
                </>
            );
        } else if (petType === 'cat') {
            return (
                <>
                    <option value="kitten">Kitten (0-1 years)</option>
                    <option value="adult">Adult (1-10 years)</option>
                    <option value="senior">Senior (10+ years)</option>
                </>
            );
        } else {
            return <option value="">Select Pet Type First</option>;
        }
    };

    const generateDietPlan = () => {
        if (calories === null) return null;

        // Assuming each food item contains information about the daily calorie portion
        const dailyPlan = foodItems.slice(0, 7); // Get top 7 food items for the 7-day plan
        return dailyPlan.map((item, index) => (
            <div key={index}>
                <h4>Day {index + 1}</h4>
                <p>Food: {item.name}</p>
                <p>Calories: {item.calories} kcal</p>
                <p>{item.description}</p>
            </div>
        ));
    };

    return (
        <div className="diet-plan-container">
            <h2>Diet Plan Calculator</h2>

            <div className="form-group">
                <label>Pet Type:</label>
                <select value={petType} onChange={(e) => { setPetType(e.target.value); setAgeLevel(''); }}>
                    <option value="">Select</option>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                </select>
            </div>

            <div className="form-group-two-column">
                <div className="form-group">
                    <label>Weight (kg):</label>
                    <input type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
                </div>

                <div className="form-group">
                    <label> (g):</label>
                    <input type="number" value={weightG} onChange={(e) => setWeightG(e.target.value)} />
                </div>
            </div>

            <div className="form-group">
                <label>Age Level:</label>
                <select value={ageLevel} onChange={(e) => setAgeLevel(e.target.value)}>
                    <option value="">Select</option>
                    {getAgeOptions()}
                </select>
            </div>

            <div className="form-group">
                <label>Activity Level:</label>
                <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
                    <option value="">Select</option>
                    <option value="low">Low (Sick, mostly resting, sedentary, pregnant)</option>
                    <option value="normal">Normal (regular walks, playtime)</option>
                    <option value="high">High (very active, daily exercise)</option>
                </select>
            </div>

            <button onClick={handleCalculate}>Calculate</button>

            {error && <p className="error-message">{error}</p>}

            {calories !== null && !error && (
                <div className="result-label">
                    <h3>Daily Calories Needed: {calories} kcal</h3>
                </div>
            )}

            {foodItems.length > 0 && calories !== null && (
                <div className="diet-plan">
                    <h3>7-Day Diet Plan</h3>
                    {generateDietPlan()}
                </div>
            )}
        </div>
    );
};

export default DietPlan;



