import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Model from '../../Pages/User/Model';
import {toast , Toaster } from 'react-hot-toast';

const socket = io('https://examination-center.onrender.com', {
  transports: ['websocket']
});

const Threeshold = ({ run, setRun }) => {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Retrieve token from localStorage (adjust this part according to your actual token storage)
        const token = localStorage.getItem('usersdatatoken');

        // Function to handle socket events
        const handleSocketEvents = () => {
            if (token) {
                // Emit token to the server for verification
                socket.emit('verifyToken', token);
            }

            // Listen for Socket.IO connection events
            socket.on('connect', () => {
                console.log('Socket.IO connected successfully!');
                toast.success('Socket.IO connected successfully!');
            });

            socket.on('connect_error', (error) => {
                console.error('Socket.IO connection error:', error.message);
                toast.error(`Socket.IO connection error: ${error.message}`);
            });

            socket.on('valuesCheck', (result) => {
                setShowModal(result);
            });
        };

        // Initial call
        handleSocketEvents();

        // Set up interval to call handleSocketEvents every 10 seconds
        const interval = setInterval(() => {
            if (token) {
                socket.emit('verifyToken', token);
            }
        }, 10000); // 10 seconds in milliseconds

        // Clean up interval and socket event listeners on component unmount
        return () => {
            clearInterval(interval);
            socket.off('connect');
            socket.off('connect_error');
            socket.off('valuesCheck');
        };
    }, []);

    return (
        <div>
            <Toaster />
            {showModal && (
                <div>
                    <Model setRun={setRun} />
                </div>
            )}
        </div>
    );
};

export default Threeshold;
