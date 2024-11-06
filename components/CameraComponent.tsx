import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import CloseButton from "./CloseButton";

const CameraComponent = ({ handleOpenCamera, handlePictures }) => {
    const [hasPermission, setHasPermission] = useState<any>(null);
    const [faces, setFaces] = useState([]);
    const [autoCaptureStarted, setAutoCaptureStarted] = useState(false);
    const [nodUpDownDetected, setNodUpDownDetected] = useState(false);
    const [nodLeftRightDetected, setNodLeftRightDetected] = useState(false);
    const [imageCaptured, setImageCaptured] = useState(false);
    const cameraRef = useRef(null);
    const captureTimeoutRef = useRef(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    const handleFacesDetected = ({ faces }) => {
        if (imageCaptured) return;

        setFaces(faces);

        if (faces.length > 0) {
            const face = faces[0];
            const { rollAngle, yawAngle, bounds } = face;
            const { origin, size } = bounds;
            const faceCenterX = origin.x + size.width / 2;
            const faceCenterY = origin.y + size.height / 2;
            const screenCenterX = 200;
            const screenCenterY = 350;
            const tolerance = 100;

            const isFaceCentered =
                Math.abs(faceCenterX - screenCenterX) < tolerance &&
                Math.abs(faceCenterY - screenCenterY) < tolerance;

            if (!isFaceCentered) {
                console.log("Face not centered");
                clearAutoCapture();
                return;
            }
            if (!nodUpDownDetected && rollAngle > 50) {
                setNodUpDownDetected(true);
            }

            if (nodUpDownDetected && !nodLeftRightDetected && Math.abs(yawAngle) > 50) {
                setNodLeftRightDetected(true);
                startAutoCapture();
            }

            if (autoCaptureStarted && (!nodUpDownDetected || !nodLeftRightDetected)) {
                clearAutoCapture();
            }
        } else {
            clearAutoCapture();
        }
    };


    const startAutoCapture = () => {
        setAutoCaptureStarted(true);
        captureTimeoutRef.current = setTimeout(async () => {
            if (cameraRef.current) {
                const photo = await cameraRef.current.takePictureAsync({
                    base64: true,
                });
                handlePictures(photo);
                handleOpenCamera(false);
                setImageCaptured(true);
                clearAutoCapture();
            }
        }, 5000);
    };

    const clearAutoCapture = () => {
        setAutoCaptureStarted(false);
        setNodUpDownDetected(false);
        setNodLeftRightDetected(false);
        if (captureTimeoutRef.current) {
            clearTimeout(captureTimeoutRef.current);
            captureTimeoutRef.current = null;
        }
    };

    const handleCloseCamera = (val) => {
        handleOpenCamera(val);
        clearAutoCapture();
    };

    if (hasPermission === null) {
        return <Text>Requesting camera permission...</Text>;
    }

    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <Camera
            ref={cameraRef}
            type={"front"}
            style={styles.camera}
            onFacesDetected={handleFacesDetected}
            faceDetectorSettings={{
                mode: FaceDetector.FaceDetectorMode.accurate,
                detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
                runClassifications: FaceDetector.FaceDetectorClassifications.all,
                minDetectionInterval: 100,
                tracking: true,
            }}
        >
            <View style={styles.buttonContainer}>
                <View style={styles.overlay}>
                    <View style={styles.faceOutline}></View>
                </View>
                <CloseButton handleCloseCamera={handleCloseCamera} />
            </View>
            {nodUpDownDetected
                ? nodLeftRightDetected
                    ? <Text>Stay Still</Text>
                    : <Text>Please nod your head left and right</Text>
                : <Text>Please nod your head up and down</Text>}
        </Camera>
    );
};

export default CameraComponent;

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "transparent",
    },
    button: {
        flex: 1,
        alignSelf: "flex-end",
        alignItems: "center",
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
    faceInfo: {
        position: "absolute",
        top: 15,
        left: 15,
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },
    faceOutline: {
        width: 250,
        height: 350,
        borderRadius: 175,
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.8)",
        backgroundColor: "transparent",
    },
    camera: {
        flex: 1,
    },
});