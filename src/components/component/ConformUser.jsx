import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Webcam from "react-webcam";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { LoginContext } from "../Context/Context";
import * as faceapi from "face-api.js";
import toast, { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCamera, faRetweet, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: "user",
};

const Profile = ({ onVerification }) => {
    const { examId } = useParams(); // Get examId from URL parameters
    const { logindata, setLoginData } = useContext(LoginContext);
    const [data, setData] = useState(false);
    const history = useNavigate();
    const [photoUrl, setPhotoUrl] = useState("");
    const handle = useFullScreenHandle();
    const webcamRef = useRef(null);
    const [picture, setPicture] = useState("");
    const [matchStatus, setMatchStatus] = useState("");
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = "/models";
            await Promise.all([
                faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.mtcnn.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
                faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
            ]);
            setModelsLoaded(true);
        };
        loadModels();
    }, []);

    const capture = React.useCallback(() => {
        const pictureSrc = webcamRef.current.getScreenshot();
        setPicture(pictureSrc);
    }, [webcamRef, setPicture]);

    const DashboardValid = async () => {
        let token = localStorage.getItem("usersdatatoken");
        const res = await fetch("https://examination-center.onrender.com/validuser", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });
        const data = await res.json();
        if (data.status === 401 || !data) {
            history("*");
        } else {
            setLoginData(data);
            setData(data);
            setPhotoUrl(data.ValidUserOne.photo);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            DashboardValid();
            setData(true);
        }, 2000);
    }, []);

    const compareImages = async () => {
        setLoading(true);
        try {
            if (!modelsLoaded) {
                console.log("Models not loaded yet!");
                return;
            }

            const image = await faceapi.fetchImage(picture);
            const faceDetections = await faceapi
                .detectAllFaces(image)
                .withFaceLandmarks()
                .withFaceDescriptors();
            if (!faceDetections.length) {
                console.log("No faces detected in the captured image!");
                toast.error("No faces detected in the captured image!", { position: 'bottom-right' });
                return;
            }

            const storedImage = await faceapi.fetchImage(photoUrl);
            const storedFaceDetections = await faceapi
                .detectAllFaces(storedImage)
                .withFaceLandmarks()
                .withFaceDescriptors();

            if (!storedFaceDetections.length) {
                console.log("No faces detected in the stored image!");
                toast.error("No faces detected in the stored image!", { position: 'bottom-right' });
                return;
            }

            const faceMatcher = new faceapi.FaceMatcher(storedFaceDetections);
            const matchResults = faceDetections.map((faceDetection) =>
                faceMatcher.findBestMatch(faceDetection.descriptor)
            );

            const bestMatch = matchResults.reduce((prev, current) =>
                prev.distance < current.distance ? prev : current
            );

            if (bestMatch.label === "unknown") {
                console.log("Face not matched!");
                setMatchStatus("Face not matched!");
                toast.error("Face not matched!", { position: 'bottom-right' });
            } else {
                console.log(`Face matched with ${bestMatch.label}!`);
                setMatchStatus(`Face matched with ${logindata ? logindata.ValidUserOne.fname : null}!`);
                toast.success(`Face matched with ${logindata ? logindata.ValidUserOne.fname : ""}!`, { position: 'bottom-right' });
            }
        } catch (error) {
            console.log("Error: ", error);
            toast.error("An error occurred while comparing images!", { position: 'bottom-right' });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndNavigate = () => {
        if (isChecked) {
            onVerification(true); // Notify parent that user is verified
            history(`/exam/${examId}`);
        } else {
            toast.error("Please agree to the Terms & Conditions before starting the exam.", { position: 'bottom-right' });
        }
    };

    return (
<div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
  <Toaster position="top-center" reverseOrder={false} />
  
  <h2 className="text-2xl font-bold mb-4 text-center">Capture Your Image</h2>

  <p className={`font-bold mb-4 ${matchStatus && matchStatus.includes("not") ? "text-red-600" : "text-green-600"}`}>
    {matchStatus}
  </p>

  <div className="mb-4">
    {picture === "" ? (
      <Webcam
        audio={false}
        height={400}
        ref={webcamRef}
        width={400}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
    ) : (
      <img src={picture} alt="captured" className="w-400 h-400 object-cover" />
    )}
  </div>

  <div className="flex space-x-4 mb-4">
    {picture !== "" ? (
      <button
        onClick={(e) => {
          e.preventDefault();
          setPicture("");
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center space-x-2 disabled:bg-blue-300"
        disabled={matchStatus.includes("Face matched with")}
      >
        <FontAwesomeIcon icon={faRetweet} className="text-lg" />
        <span>Retake</span>
      </button>
    ) : (
      <button
        onClick={(e) => {
          e.preventDefault();
          capture();
        }}
        className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center space-x-2"
      >
        <FontAwesomeIcon icon={faCamera} className="text-lg" />
        <span>Capture</span>
      </button>
    )}
    <button
      onClick={(e) => {
        e.preventDefault();
        compareImages();
      }}
      className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center space-x-2 disabled:bg-green-300"
      disabled={picture === "" || matchStatus.includes("Face matched with")}
    >
      <FontAwesomeIcon icon={faCheckCircle} className="text-lg" />
      <span>Verify</span>
    </button>
  </div>

  <p className="text-center">
    <input
      type="checkbox"
      name="checkbox"
      id="checkbox"
      required
      disabled={!matchStatus || matchStatus.includes("not")}
      onChange={(e) => setIsChecked(e.target.checked)}
      className="mr-2 leading-tight"
      title={
        !matchStatus
          ? "Please capture your image and click Verify first"
          : matchStatus.includes("not")
            ? "Images do not match, please try again"
            : ""
      }
    />
    <span className={`text-gray-600 ${!matchStatus ? "text-gray-400" : ""}`}>
      I agree to all Terms & Conditions.
    </span>
  </p>

  <div className="text-center mt-4">
    <FullScreen handle={handle}>
      <Link to={`/exam/${examId}`}>
        <button
          onClick={handleVerifyAndNavigate}
          disabled={!isChecked}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:bg-blue-300"
          title={
            isChecked
              ? "Click to start the exam"
              : "Please agree to the Terms & Conditions first"
          }
        >
          Start Exam
        </button>
      </Link>
    </FullScreen>
  </div>

</div>

    );
};

export default Profile;
