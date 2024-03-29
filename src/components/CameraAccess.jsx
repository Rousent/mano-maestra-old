
import * as tf from "@tensorflow/tfjs"
import * as handpose from "@tensorflow-models/handpose"
import * as fp from "fingerpose"
import { gestures } from "@/config/LSMGestures";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

export default function CameraAccess() {

    const [camera, setCamera] = useState(false)

    if (!camera) {
        return (
            <div className="grid grid-cols-1 bg-gray-800 rounded-lg mx-auto left-0 right-0 self-center text-center w-[640px] h-[480px]">
                <button onClick={() => setCamera(true)} className="bg-blanco place-self-center">Abrir camara</button>
            </div>
        )
    }

    return (
        <Camera setCamera={setCamera}/>
    )
}

function Camera({ setCamera }) {
    const webcamRef = useRef(null)
    const canvasRef = useRef(null)
    const [prediction, setPrediction] = useState("Esperando a que cargue el modelo...")

    const runHandpose = async () => {
        const net = await handpose.load()
        const GE = new fp.GestureEstimator(gestures)
        setInterval(() => {
            detect(net, GE)
        }, 100)
    }

    const detect = async (net, GE) => {
        if (typeof webcamRef !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState===4) {

            const video = webcamRef.current.video
            const videoWidth = webcamRef.current.video.videoWidth
            const videoHeight = webcamRef.current.video.videoHeight
            
            webcamRef.current.video.width = videoWidth
            webcamRef.current.video.height = videoHeight

            canvasRef.current.width = videoWidth
            canvasRef.current.height = videoHeight

            const hand = await net.estimateHands(video)

            if (hand.length > 0) {
                const gesture = await GE.estimate(hand[0].landmarks, 7);
                if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
                    const confidence = gesture.gestures.map(
                        (prediction) => prediction.score
                    );
                    const maxConfidence = confidence.indexOf(
                        Math.max.apply(null, confidence)
                    );
                    setPrediction(gesture.gestures[maxConfidence].name);
                } else {
                    setPrediction("Espera...")
                }
            } else {
                setPrediction("Coloque su mano frente a la camara.")
            }

            const ctx = canvasRef.current.getContext("2d")
            drawHand(hand,ctx)
        }
    }

    useEffect(() => {
        runHandpose()
    },[])

    return (
        <div className="bg-gray-800 rounded-lg text-center self-center border-[5px] border-gray-800 w-fit h-fit">
            <button className="bg-blanco" onClick={() => setCamera(null)}>Cerrar</button>
            <div className="relative">
                <Webcam ref={webcamRef} className="rounded-lg mx-auto text-center w-fit h-fit"/>
                <canvas ref={canvasRef} className="absolute z-10 mx-auto rounded-lg top-0 left-0 w-fit h-fit"/>
            </div>
            <div className="py-3 text-white font-medium text-lg">{prediction}</div>
        </div>
    )
}

const drawHand = (predictions, ctx) => {

    const fingerJoints = {
        thumb: [0,1,2,3,4],
        indexFinger: [0,5,6,7,8],
        middleFinger: [0,9,10,11,12],
        ringFinger: [0,13,14,15,16],
        pinky: [0,17,18,19,20],
    }

    if (predictions.length > 0) {
        predictions.forEach((prediction) => {

            const landmarks = prediction.landmarks

            for (let j=0; j<Object.keys(fingerJoints).length; j++) {
                let finger = Object.keys(fingerJoints)[j]
                for (let k=0; k<fingerJoints[finger].length -1; k++) {
                    const firstJointIndex = fingerJoints[finger][k]
                    const secondJointIndex = fingerJoints[finger][k+1]

                    ctx.beginPath()
                    ctx.moveTo(
                        landmarks[firstJointIndex][0],
                        landmarks[firstJointIndex][1]
                    )
                    ctx.lineTo(
                        landmarks[secondJointIndex][0],
                        landmarks[secondJointIndex][1]
                    )
                    ctx.strokeStyle = "#F9904F";
                    ctx.lineWidth = 4;
                    ctx.stroke();
                }
            }

            for (let i=0; i<landmarks.length; i++) {
                const x = landmarks[i][0]
                const y = landmarks[i][1]
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, 3 * Math.PI)
                ctx.fillStyle = "#2DA4FA"
                ctx.fill()
            }
        });
    }
}