import React, { useState, useEffect } from 'react';
import { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const CameraVoiceAccessDialog = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [accessGranted, setAccessGranted] = useState(false);

    useEffect(() => {
        // Check for camera and microphone permissions
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                setAccessGranted(true);
                setIsDialogOpen(false);
                // Close the stream after getting access (optional)
                stream.getTracks().forEach(track => track.stop());
            })
            .catch(() => {
                setIsDialogOpen(true);
            });
    }, []);

    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={(open) => { if (accessGranted) setIsDialogOpen(open); }}>
                <DialogContent>
                    <DialogTitle>Camera and Microphone Access</DialogTitle>
                    <DialogDescription>
                        This application requires access to your camera and microphone. Please grant the necessary permissions.
                    </DialogDescription>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button disabled={!accessGranted}>Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CameraVoiceAccessDialog;
