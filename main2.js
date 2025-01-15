const socket = io.connect('https://call-p2p.onrender.com');

const myPeerId = prompt('Please enter your phone number to use as your Peer ID:', '');

const peer = new Peer(myPeerId);

peer.on('open', (id) => {
    console.log('My peer ID is: ' + id);
    alert('Your Peer ID is: ' + id);
});

socket.on('signal', (data) => {
    peer.signal(data.signal);
});

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
        const callButton = document.getElementById('callButton');
        const myVideo = document.getElementById('myVideo');
        const theirVideo = document.getElementById('theirVideo');

        myVideo.srcObject = stream;
        myVideo.play();

        callButton.onclick = () => {
            const peerId = prompt('Please enter the phone number of the peer you want to call:', '');
            const call = peer.call(peerId, stream);
            call.on('stream', (remoteStream) => {
                theirVideo.srcObject = remoteStream;
                theirVideo.play();
            });
            call.on('error', (err) => {
                console.error('Call error:', err);
            });
        };

        peer.on('call', (call) => {
            call.answer(stream);
            call.on('stream', (remoteStream) => {
                theirVideo.srcObject = remoteStream;
                theirVideo.play();
            });
        });
    })
    .catch((err) => {
        console.error('Failed to get local stream', err);
    });
