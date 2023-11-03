"use client"
import React from 'react'
import { useState, useEffect } from 'react';

const Data = () => {
    const [data, setData] = useState<any[]>([])
    const [sortBy, setSortBy] = useState('created');
    const [sortDirection, setsortDirection] = useState('asc');

    useEffect(() => {
        const res = fetch(`http://localhost:3000/api?sort=${sortBy}&type=${sortDirection}`).then(res => {
            res.json().then(posts => {
                setData(posts);
            });
        });
    }, [sortBy, sortDirection])

    const handleOptionChange = (event: any) => {
        switch (event.target.name) {
            case 'sortBy':
                setSortBy(event.target.value);
                break;
            case 'sortDirection':
                setsortDirection(event.target.value);
            default:
                break;
        }
      };

    if (data) {

        return (
            <>
                <h1>List</h1>
                <div>
                    <label>Sort by:</label>
                    <select name="sortBy" value={sortBy} onChange={handleOptionChange}>
                        <option value="created">Created Date</option>
                        <option value="filename">File Name</option>
                    </select>
                </div>
                <div>
                    <label>Direction:</label>
                    <select name="sortDirection" value={sortDirection} onChange={handleOptionChange}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>

                <ul>
                    {data.map((item, index) => (
                        <li key={index}>
                            <p>Name: {JSON.stringify(item.filename)}. Created At: {item.created}.</p>
                        </li>
                    )
                    )}
                </ul>
            </>
        )
    }

    return (
        <div>
            No data available
        </div>
    )


}

export default Data