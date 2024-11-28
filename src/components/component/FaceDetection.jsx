import React, { useEffect, useRef, useState } from 'react';
import vision from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3';
import Threeshold from './Threeshold';
const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;
import AudioDetector from './Mic';

const FaceDetection = ({ run , setRun }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const [webcamRunning, setWebcamRunning] = useState(true); 
  const videoWidth = 480;
  const [results, setResults] = useState(undefined);

  useEffect(() => {
    async function createFaceLandmarker() {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
      );
      const faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: 'GPU',
        },
        outputFaceBlendshapes: true,
        runningMode: 'VIDEO',
        numFaces: 1,
      });
      setFaceLandmarker(faceLandmarker);
    }

    createFaceLandmarker();

    const constraints = { video: true };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener('loadeddata', () => setWebcamRunning(true));
      }
    });

    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!run) {
      // If `run` is false, stop face detection and clear the canvas
      setWebcamRunning(false);
      if (canvasRef.current) {
        const canvasCtx = canvasRef.current.getContext('2d');
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      return; // Exit early if `run` is false
    }

    if (webcamRunning && faceLandmarker) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const canvasCtx = canvas.getContext('2d');

      let lastVideoTime = -1;
      const drawingUtils = new DrawingUtils(canvasCtx);

      const predictWebcam = async () => {
        if (video && canvas) {
          if (video.videoWidth === 0 || video.videoHeight === 0) {
            requestAnimationFrame(predictWebcam);
            return;
          }

          const ratio = video.videoHeight / video.videoWidth;
          video.style.width = `${videoWidth}px`;
          video.style.height = `${videoWidth * ratio}px`;
          canvas.style.width = `${videoWidth}px`;
          canvas.style.height = `${videoWidth * ratio}px`;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          let startTimeMs = performance.now();
          if (lastVideoTime !== video.currentTime) {
            lastVideoTime = video.currentTime;
            try {
              const results = await faceLandmarker.detectForVideo(video, startTimeMs);
              setResults(results);
              canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

              if (results.faceLandmarks) {
                for (const landmarks of results.faceLandmarks) {
                  // drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: '#FF3030' });
                }
              }
              
              if (run) {
                handleLookError(results.faceBlendshapes);
              }

            } catch (error) {
              console.error('Error during face detection:', error);
            }
          }

          if (webcamRunning) {
            requestAnimationFrame(predictWebcam);
          }
        }
      };

      predictWebcam();
    }
  }, [webcamRunning, faceLandmarker, run]);

  const handleLookError = async (blendShapes) => {
    const token = localStorage.getItem('usersdatatoken');
    if (blendShapes[0].categories[13].score >= 0.8) {
      try {
        await fetch('/api/cheats/left', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ left: true })
        });
      } catch (error) {
        console.error('Error sending left count to backend:', error);
        console.log(error)
      }
    }

    if (blendShapes[0].categories[14].score >= 0.8) {
      try {
        await fetch('/api/cheats/right', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ right: true })
        });
      } catch (error) {
        console.error('Error sending right count to backend:', error);
      }
    }
  };

  return (
    <div className='harshthebob'>
      <Threeshold run={run} setRun={setRun} />
      <video ref={videoRef} autoPlay />
      <canvas ref={canvasRef} />
      <ul id="blend-shapes"></ul>
      <AudioDetector />
    </div>
  );
};

export default FaceDetection;
