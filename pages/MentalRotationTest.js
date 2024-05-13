import React, { useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../supabaseClient'; // Import the Supabase client
import styles from '../styles/styles.module.css'; // Import CSS module

const MentalRotationTest = () => {
    const router = useRouter();
    const { id } = router.query;

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [reactionTimes, setReactionTimes] = useState({});
    const [points, setPoints] = useState({});
    const [isTestCompleted, setIsTestCompleted] = useState(false);

    // List of all image names
    const imageNames = [
        '1_0', '1_0_R', '1_50', '1_50_R', '1_100', '1_100_R', '1_150', '1_150_R',
        '8_0', '8_0_R', '8_50', '8_50_R', '8_100', '8_100_R', '8_150', '8_150_R',
        '21_0', '21_0_R', '21_50', '21_50_R', '21_100', '21_100_R', '21_150', '21_150_R',
        '25_0', '25_0_R', '25_50', '25_50_R', '25_100', '25_100_R', '25_150', '25_150_R',
        '29_0', '29_0_R', '29_50', '29_50_R', '29_100', '29_100_R', '29_150', '29_150_R',
        '43_0', '43_0_R', '43_50', '43_50_R', '43_100', '43_100_R', '43_150', '43_150_R'
    ];

    // Function to load next image
    const loadNextImage = () => {
        if (currentImageIndex < imageNames.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
            setStartTime(Date.now());
        } else {
            setIsTestCompleted(true);
        }
    };

    // Function to handle user answer
    const handleAnswer = (userAnswer) => {
        const endTime = Date.now();
        const currentReactionTime = endTime - startTime;

        const currentImageName = imageNames[currentImageIndex];
        setReactionTimes({ ...reactionTimes, [`${currentImageName}_rt`]: currentReactionTime });

        const isCorrect = (userAnswer === 'vienāds' && !currentImageName.endsWith('_R')) ||
                          (userAnswer === 'atšķirīgs' && currentImageName.endsWith('_R')) ? 1 : 0;
        setPoints({ ...points, [currentImageName]: isCorrect });

        console.log(`Reaction time for ${currentImageName}: ${currentReactionTime}ms`);
        console.log(`Points for ${currentImageName}: ${isCorrect}`);

        loadNextImage();
    };

    // Function to commit results to database
    const commitResultsToDB = async () => {
        const data = {
            participant_id: id,
            ...reactionTimes,
            ...points
        };

        try {
            await supabase.from('Results_table').insert([data]);
            console.log('Results successfully stored in the database:', data);
        } catch (error) {
            console.error('Error inserting data to the database:', error.message);
        }
    };

    // If test is completed, commit results to database
    if (isTestCompleted) {
        commitResultsToDB();
        return <div>Paldies!</div>;
    }

    // Render test interface
    const currentImageName = imageNames[currentImageIndex];
    const imagePath = currentImageName ? `/stimuli/${currentImageName}.jpg` : null;

    return (
        <div className={styles.container}>
            <h1>Mental Rotation Test</h1>
            {currentImageName && <img src={imagePath} alt="Rotation Test" />}
            <div className={styles.answerButtons}>
                <button onClick={() => handleAnswer('vienāds')}>vienāds</button>
                <button onClick={() => handleAnswer('atšķirīgs')}>atšķirīgs</button>
            </div>
        </div>
    );
};

export default MentalRotationTest;
