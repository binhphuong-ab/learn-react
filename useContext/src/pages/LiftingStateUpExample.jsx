import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// 1. Child Component A: The Input
// It receives the current value and the function to update it via props.
const TemperatureInput = ({ temperature, onTemperatureChange }) => {
    return (
        <fieldset className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4">
            <legend className="text-lg font-semibold px-2">Enter temperature in Celsius:</legend>
            <input
                value={temperature}
                onChange={(e) => onTemperatureChange(e.target.value)}
                type="number"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
        </fieldset>
    );
};

// 2. Child Component B: The Display
// It receives the temperature via props to decide what to show.
const BoilingVerdict = ({ celsius }) => {
    if (celsius >= 100) {
        return <p className="text-green-600 font-bold text-xl mt-4">The water would boil. 💧🔥</p>;
    }
    return <p className="text-red-600 text-xl mt-4">The water would not boil. ❄️</p>;
};

// 3. The Parent Component: Calculator
// This is where the state "lives" (The Single Source of Truth)
const LiftingStateUpExample = () => {
    // B2: State is initialized here, not in the Input
    const [temperature, setTemperature] = useState('');

    // The handler function that updates the state
    const handleChange = (newTemperature) => {
        setTemperature(newTemperature);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-6 sm:p-8 md:p-12">
            <div className="max-w-3xl mx-auto w-full">
                {/* Back Button */}
                <Link
                    to="/"
                    className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-6 font-semibold"
                >
                    ← Back to Home
                </Link>

                {/* Main Card */}
                <div className="bg-white dark:bg-gray-800 p-8 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl">
                    <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                        Lifting State Up Example
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        This example demonstrates how to share state between components by lifting it to their closest common ancestor.
                    </p>

                    {/* B3: Pass the function down to Input */}
                    <TemperatureInput
                        temperature={temperature}
                        onTemperatureChange={handleChange}
                    />

                    {/* B3: Pass the state down to Display */}
                    <BoilingVerdict
                        celsius={parseFloat(temperature)}
                    />

                    {/* Explanation Section */}
                    <div className="mt-8 p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg">
                        <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">💡 Key Concept</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                            <li>The <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">temperature</code> state lives in the parent component (Single Source of Truth)</li>
                            <li>The input component receives both the value and the updater function via props</li>
                            <li>The verdict component receives the state to display the result</li>
                            <li>Both child components stay in sync because they share the same state</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiftingStateUpExample;
