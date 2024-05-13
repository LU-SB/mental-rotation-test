// pages/index.js
import React, { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/styles.module.css'; // Import CSS module

const HomePage = () => {
    const [participantId, setParticipantId] = useState('');

    const handleInputChange = (e) => {
        setParticipantId(e.target.value);
    };

    return (
        <div className={styles.container}>
            <h1>Rotācijas tests</h1>
            <div className={styles.inputField}>
                <label htmlFor="participantId">Ievadi dalībnieka ID:</label>
                <input
                    type="text"
                    id="participantId"
                    value={participantId}
                    onChange={handleInputChange}
                />
            </div>
            <Link href={`/MentalRotationTest?id=${participantId}`}>
                <button className={styles.button}>Sākt testu</button>
            </Link>
        </div>
    );
};

export default HomePage;
