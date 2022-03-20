import React from "react";
import './App.css';
import io from "socket.io-client";

import Webcam from "react-webcam";


class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            count: 0,
            response: '',
            answers: [],
        };
        this.webcamRef = React.createRef();
    }
    render() {
        // const socket = io("https://147.47.85.199:3001/", {
        //     // secure: false,
        //     // rejectUnauthorized : false,
        //     // transports: ['websocket'], rejectUnauthorized: false
        // });
        // socket.emit("fromClient", ['hello', 'world']);

        const videoConstraints = {
            facingMode: { exact: "environment" }
        };

        const receiveMedia = () => {
            const socket = io("http://147.47.85.199:3001/", {
                // secure: true,
            });
            socket.emit("fromClient", this.webcamRef.current.getScreenshot());

            socket.on("fromAPI", data => {
                const answers = this.state.answers
                if (answers.length > 119) {
                    answers.shift()
                }
                answers.push(new Date())

                this.setState({
                    answers: answers,
                    response: data
                })

                socket.emit("fromClient", this.webcamRef.current.getScreenshot());
            });
        }

        fetch('http://147.47.85.199:3001/')
        .then(response => response.json())
        .then(data => console.log(data));

        const answers = this.state.answers
        const diffs = answers.slice(1).map((x,i)=> x - answers[i]);
        const fps = (diffs.reduce((a, b) => a + b, 0) / answers.length) || -1

        return (
            <div className="App">
                <Webcam
                    audio={false}
                    ref={this.webcamRef}
                    // onUserMedia={receiveMedia}
                    onPlay={receiveMedia}
                    // videoConstraints={videoConstraints}
                    // screenshotFormat="image/jpeg"
                />
                <p>
                    data: {this.state.response} {1000/fps}
                    {/*It's <time dateTime={response}>{response}</time>*/}
                </p>
            </div>
        );
    }
}

//    "start": "npm-run-all --parallel dev:*",
// function App() {
//     const videoConstraints = {
//         facingMode: { exact: "environment" }
//     };
//
//     const webcamRef = React.useRef(null);
//     const [response, setResponse] = React.useState("");
//
//     const receiveMedia = () => {
//         // const socket = io("https://192.168.0.3:3001/", {
//         //     secure: true,
//         // });
//         const socket = io("https://192.168.0.3:3001/", {
//             // secure: true,
//         });
//         // socket.emit("fromClient", 'def');
//         sendImage(socket, webcamRef.current.getScreenshot());
//         socket.on("fromAPI", data => {
//             setResponse(data);
//             sendImage(socket, webcamRef.current.getScreenshot());
//         });
//     }
//
//     return (
//         <div className="App">
//             <Webcam
//                 audio={false}
//                 ref={webcamRef}
//                 // onUserMedia={receiveMedia}
//                 onPlay={receiveMedia}
//                 videoConstraints={videoConstraints}
//                 // screenshotFormat="image/jpeg"
//             />
//             <p>
//                 data: {response}
//                 {/*It's <time dateTime={response}>{response}</time>*/}
//             </p>
//         </div>
//     );
// }

export default App;
