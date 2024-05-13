// pages/index.js

import React from 'react';
import Link from 'next/link';

const HomePage = () => {
    return (
        <div>
            <h1>Welcome to My Next.js App</h1>
            <Link href="/mentalRotationTest">
                Start Mental Rotation Test
            </Link>
        </div>
    );
};

export default HomePage;
