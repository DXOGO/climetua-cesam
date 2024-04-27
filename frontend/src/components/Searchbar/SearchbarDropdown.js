// SearchbarDropdown.js
import React from 'react';
import './SearchbarDropdown.css';

const SearchbarDropdown = ({ cities, handleCitySelect }) => {
    return (
        <div className="dropdown">
            {cities.length > 0 ? (
                cities.map(city => (
                    <div
                        key={city.id}
                        className="dropdown-item found"
                        onClick={() => handleCitySelect(city)}
                    >
                        {city.name}
                    </div>
                ))
            ) : (
                <div className="dropdown-item not-found">
                    Sem resultados
                </div>
            )}
        </div>
    );
}

export default SearchbarDropdown;
