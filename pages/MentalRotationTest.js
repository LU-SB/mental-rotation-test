// pages/mentalRotationTest.js

import React, { useState } from 'react';
import supabase from '../supabaseClient'; // Import the Supabase client
import styles from '../styles/mentalRotationTest.module.css'; // Import CSS module

const MentalRotationTest = () => {
    const [participantId, setParticipantId] = useState('');
    const [stimulusIndex, setStimulusIndex] = useState(-1); // -1 means participant code input
    const [startTime, setStartTime] = useState(null);
    const [answers, setAnswers] = useState([]); // Store participant's answers

    const handleIdChange = (event) => {
        setParticipantId(event.target.value);
    };

    const generateStimulusName = (setId, rotAngle, isReverse) => {
        let name = `${setId}_${rotAngle}`;
        if (isReverse) {
            name += '_R';
        }
        return name;
    };

    const handleNext = (answer) => {
        if (stimulusIndex < 47) {
            const endTime = Date.now();
            const reactionTime = endTime - startTime;
            const stimulus = generateStimulusName(1, stimulusIndex * 50, false);
            console.log('Participant ID:', participantId);
            console.log('Stimulus:', stimulus);
            console.log('Answer:', answer);
            console.log('Reaction Time:', reactionTime);

            setAnswers([...answers, { stimulus, reactionTime, answer }]);
            setStimulusIndex(stimulusIndex + 1);
            setStartTime(Date.now());
        }
    };

    const startTest = () => {
        if (participantId.trim() !== '') { // Check if participant ID is not empty
            setStimulusIndex(0); // Start with the first stimulus
            setStartTime(Date.now());
        } else {
            alert('Please enter your ID before starting the test.');
        }
    };

    const saveData = async () => {
        // Format the data to match the structure of your Supabase table
        const formattedData = answers.map(answer => ({
            participant_id: participantId,
            stimulus_index: answer.stimulus,
            answer: answer.answer,
            reaction_time: answer.reactionTime
        }));

        console.log('Formatted Data:', formattedData);

        // Save formatted data to Supabase
        try {
            const { data, error } = await supabase.from('Results_table').insert(formattedData);
            if (error) {
                throw error;
            }
            console.log('Data saved successfully:', data);
            alert('Data saved successfully!');
            // Clear participant ID and answers after saving data
            setParticipantId('');
            setAnswers([]);
            setStimulusIndex(-1);
        } catch (error) {
            console.error('Error saving data:', error.message);
            alert('Error saving data. Please try again.');
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Mental Rotation Test</h1>
            {stimulusIndex === -1 ? (
                <div>
                    <label className={styles.inputWrapper}>
                        Participant ID:
                        <input type="text" value={participantId} onChange={handleIdChange} className={styles.input} />
                    </label>
                    <br />
                    <button onClick={startTest} className={styles.button}>Start Test</button>
                </div>
            ) : (
                <div>
                    <img
                        src={`/stimuli/${generateStimulusName(1, stimulusIndex * 50, false)}.jpg`}
                        alt={`Stimulus ${stimulusIndex}`}
                        className={styles.image}
                    />
                    <div>
                        <button onClick={() => handleNext('<- Atšķirīgi')} className={styles.button}>&lt;- Atšķirīgi</button>
                        <button onClick={() => handleNext('Vienādi ->')} className={styles.button}>Vienādi -&gt;</button>
                    </div>
                    {stimulusIndex === 47 && (
                        <div>
                            <button onClick={saveData} className={styles.button}>Finish Test</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MentalRotationTest;
