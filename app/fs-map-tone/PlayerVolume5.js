'use client';
import { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';

export default function PlayerVolume5(props) {
  // const playerRef = useRef(null);
  // const panVol = useRef(null);
  const [sound, setSound] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [volumeControl, setVolumeControl] = useState(0);
  const [panControl, setPanControl] = useState(0);
  const [delayWet, setDelayWet] = useState(0);
  const [revWet, setRevWet] = useState(0);

  useEffect(() => {
    async function fetchSound() {
      const response = await fetch(props.soundUrl);
      // const theSound = await response.json();
      setSound(response.url);
      setIsLoading(false);
    }
    fetchSound().catch((error) => {
      console.log(error);
    });
  }, [props.soundUrl]);

  if (isLoading) {
    // early return
    return 'Loading...';
  }

  console.log('sound', sound);

  const player = new Tone.Player(sound).toDestination();
  // const pitchShift = new Tone.PitchShift(12).toDestination();
  // const filter = new Tone.Filter('G5').toDestination();
  // const feedbackDelay = new Tone.FeedbackDelay('8n', 0.5).toDestination();
  player.volume.value = volumeControl;

  // const panVol = new Tone.PanVol({
  //   pan: panControl,
  //   volume: volumeControl,
  //   mute: false,
  // });

  // player.fan(panVol, feedbackDelay);

  // const panVol = new Tone.PanVol({
  //   pan: panControl,
  //   volume: volumeControl,
  //   mute: false,
  // }).toDestination()

  // const panVol = new Tone.PanVol({
  //   pan: panControl,
  //   volume: volumeControl,
  //   mute: false,
  // });

  // useEffect(() => {
  //   playerRef.current = new Tone.Player(sound);
  // }, [sound]);

  // const pitchShift = new Tone.PitchShift(4).toDestination();
  // const filter = new Tone.Filter('G5').toDestination();
  // const reverb = new Tone.Reverb(14).toDestination;
  // // connect a node to the pitch shift and filter in parallel
  // // playerRef.fan(pitchShift, filter);

  // useEffect(() => {
  //   playerRef.current.fan(pitchShift, filter, reverb);
  // }, [filter, pitchShift, reverb]);

  // useEffect(() => {
  //   const panVol = new Tone.PanVol({
  //     pan: panControl,
  //     volume: volumeControl,
  //     mute: false,
  //   });
  //   const reverb = new Tone.Reverb({ decay: 14, wet: revWet });
  //   const feedbackDelay = new Tone.FeedbackDelay({
  //     delayTime: '4n',
  //     feedback: 0.7,
  //     wet: delayWet,
  //   });
  //   playerRef.current.chain(panVol, feedbackDelay, reverb, Tone.Destination);
  // }, [delayWet, panControl, revWet, volumeControl]);

  // useEffect(() => {
  //   panVol.current = { pan: panControl, volume: volumeControl, mute: false };
  // }, [panControl, volumeControl]);

  // useEffect(() => {
  //   playerRef.current.volume.value = volumeControl;
  // }, [volumeControl]);

  const play = () => {
    player.start();
  };

  // async function startPlayer() {
  //   // player.current.start();
  //   await Tone.loaded().then(() => {
  //     playerRef.current.start();
  //   });
  // }

  const stop = () => {
    player.stop();
  };

  return (
    <>
      <button onClick={play}>play</button>
      <button onClick={stop}>stop</button>
      <div>
        <input
          type="range"
          id="volume"
          name="volume"
          min={-20}
          max={20}
          step="0.1"
          value={Number(volumeControl)}
          onChange={(event) => {
            setVolumeControl(event.currentTarget.value);
          }}
        />
        <label htmlFor="volume">Volume</label>
      </div>
      <div>
        <input
          type="range"
          id="pan"
          name="pan"
          min={-1}
          max={1}
          step="0.1"
          value={Number(panControl)}
          onChange={(event) => {
            setPanControl(event.currentTarget.value);
          }}
        />
        <label htmlFor="feedback">Pan</label>
      </div>
      <div>
        <input
          type="range"
          id="delayWet"
          name="delayWet"
          min={0}
          max={0.5}
          step="0.1"
          value={Number(delayWet)}
          onChange={(event) => {
            setDelayWet(event.currentTarget.value);
          }}
        />
        <label htmlFor="feedback">Feedback</label>
      </div>
      <div>
        <input
          type="range"
          id="revWet"
          name="revWet"
          min={0}
          max={1}
          step="0.1"
          value={Number(revWet)}
          onChange={(event) => {
            setRevWet(event.currentTarget.value);
          }}
        />
        <label htmlFor="feedback">Reverb amount</label>
      </div>
    </>
  );
}
