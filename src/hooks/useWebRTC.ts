import { useState, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const useWebRTC = (roomId: string) => {
    const [isConnected, setIsConnected] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isAudioOn, setIsAudioOn] = useState(true);
    const [participants, setParticipants] = useState<string[]>([]);

    const localStreamRef = useRef<MediaStream | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const signalingChannelRef = useRef<any>(null);

    const rtcConfig = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
        ]
    };

    const initializeConnection = useCallback(async () => {
        try {
            // Get user media
            const stream = await navigator.mediaDevices.getUserMedia({
                video: isVideoOn,
                audio: isAudioOn
            });

            localStreamRef.current = stream;

            // Create peer connection
            const pc = new RTCPeerConnection(rtcConfig);
            peerConnectionRef.current = pc;

            // Add tracks to peer connection
            stream.getTracks().forEach(track => {
                pc.addTrack(track, stream);
            });

            // Handle remote stream
            pc.ontrack = (event) => {
                // Handle incoming stream
                console.log('Received remote stream:', event.streams[0]);
            };

            // Handle ICE candidates
            pc.onicecandidate = (event) => {
                if (event.candidate && signalingChannelRef.current) {
                    signalingChannelRef.current.send({
                        type: 'broadcast',
                        event: 'ice-candidate',
                        payload: { candidate: event.candidate }
                    });
                }
            };

            // Setup signaling channel
            const signalingChannel = supabase.channel(`webrtc_${roomId}`)
                .on('broadcast', { event: 'offer' }, async ({ payload }) => {
                    await pc.setRemoteDescription(payload.offer);
                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);

                    signalingChannel.send({
                        type: 'broadcast',
                        event: 'answer',
                        payload: { answer }
                    });
                })
                .on('broadcast', { event: 'answer' }, async ({ payload }) => {
                    await pc.setRemoteDescription(payload.answer);
                })
                .on('broadcast', { event: 'ice-candidate' }, async ({ payload }) => {
                    await pc.addIceCandidate(payload.candidate);
                })
                .subscribe();

            signalingChannelRef.current = signalingChannel;
            setIsConnected(true);

            return stream;
        } catch (error) {
            console.error('Error initializing WebRTC:', error);
            throw error;
        }
    }, [roomId, isVideoOn, isAudioOn]);

    const createOffer = useCallback(async () => {
        if (!peerConnectionRef.current || !signalingChannelRef.current) return;

        try {
            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);

            signalingChannelRef.current.send({
                type: 'broadcast',
                event: 'offer',
                payload: { offer }
            });
        } catch (error) {
            console.error('Error creating offer:', error);
        }
    }, []);

    const toggleVideo = useCallback(() => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !isVideoOn;
                setIsVideoOn(!isVideoOn);
            }
        }
    }, [isVideoOn]);

    const toggleAudio = useCallback(() => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !isAudioOn;
                setIsAudioOn(!isAudioOn);
            }
        }
    }, [isAudioOn]);

    const disconnect = useCallback(() => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }

        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        if (signalingChannelRef.current) {
            signalingChannelRef.current.unsubscribe();
            signalingChannelRef.current = null;
        }

        setIsConnected(false);
        setParticipants([]);
    }, []);

    return {
        isConnected,
        isVideoOn,
        isAudioOn,
        participants,
        localStream: localStreamRef.current,
        initializeConnection,
        createOffer,
        toggleVideo,
        toggleAudio,
        disconnect
    };
};