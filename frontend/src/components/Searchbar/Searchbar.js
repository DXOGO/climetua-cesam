// Searchbar.js
import React, { useState, useRef, useEffect } from 'react';
import { setSelectedCity } from '../../redux/actions';

import SearchbarDropdown from './SearchbarDropdown';
import { IoMdSearch } from "react-icons/io";
import './Searchbar.css';

const Searchbar = ({ cities, selectedCity, handleCityClick }) => {

    const [input, setInput] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Add event listener to listen for clicks on the document
        document.addEventListener('click', handleDocumentClick);

        // Cleanup function to remove event listener when component unmounts
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    const handleDocumentClick = (e) => {
        // Close the dropdown if the click occurs outside of it
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setShowDropdown(false);
        }
    };

    const handleCitySelect = (city) => {
        setSelectedCity(city);
        handleCityClick(city.name); // Call the handleCityClick function from the parent
        setInput('');
        setShowDropdown(false);
    };

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setInput(inputValue);
        setShowDropdown(inputValue.length > 0);
    }

    return (
        <div className='searchbar-container'>
            <IoMdSearch className='searchbar-icon' />
            <input
                className='searchbar-input'
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder='ex: Aveiro'
            />
            {showDropdown && (
                <div ref={dropdownRef}>
                    <SearchbarDropdown
                        cities={cities.filter(city =>
                            city.name.toLowerCase().startsWith(input.toLowerCase())
                        )}
                        handleCitySelect={handleCitySelect}
                    />
                </div>
            )}
        </div>
    );
}

export default Searchbar;