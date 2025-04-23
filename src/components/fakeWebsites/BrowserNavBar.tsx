"use client";

import React from 'react';
import { FaArrowLeft, FaArrowRight, FaLock } from 'react-icons/fa';

interface BrowserNavBar {
    url: string;
}

const BrowserNavBar: React.FC<BrowserNavBar> = ({ url }) => {
    return (
        <div className="flex items-center px-4 py-2 border-b border-gray-200 bg-gray-100">
            <div className="flex items-center space-x-2">
                <FaArrowLeft className="text-gray-500" />
                <FaArrowRight className="text-gray-500" />
            </div>
            <div className="flex items-center ml-4 flex-1">
                <FaLock className="text-gray-500 mx-2" />
                <span className="text-gray-600 text-sm">{url}</span>
            </div>
        </div>
    );
};

export default BrowserNavBar;