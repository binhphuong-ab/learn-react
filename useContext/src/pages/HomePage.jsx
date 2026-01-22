import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6 sm:p-8 md:p-12">
            <div className="container mx-auto max-w-6xl">
                <div className="w-full">
                    {/* Header */}
                    <header className="text-center mb-12 md:mb-16">
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            React Learning Examples
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
                            Interactive examples to master React concepts
                        </p>
                    </header>

                    {/* Examples Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Example 1: Lifting State Up */}
                        <Link
                            to="/example-1-lifting-state-up"
                            className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-indigo-500"
                        >
                            <div className="flex items-center mb-4">
                                <span className="text-3xl mr-3">🔼</span>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Lifting State Up
                                </h2>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">
                                Learn how to share state between components by lifting it to their closest common ancestor.
                            </p>
                            <div className="mt-4 text-indigo-600 dark:text-indigo-400 font-semibold">
                                View Example →
                            </div>
                        </Link>

                        {/* Placeholder for future examples */}
                        <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md border-2 border-dashed border-gray-300 dark:border-gray-600 opacity-60">
                            <div className="flex items-center mb-4">
                                <span className="text-3xl mr-3">📦</span>
                                <h2 className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                                    More Examples
                                </h2>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">
                                Additional examples coming soon...
                            </p>
                        </div>

                        <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md border-2 border-dashed border-gray-300 dark:border-gray-600 opacity-60">
                            <div className="flex items-center mb-4">
                                <span className="text-3xl mr-3">🚀</span>
                                <h2 className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                                    More Examples
                                </h2>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">
                                Additional examples coming soon...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
