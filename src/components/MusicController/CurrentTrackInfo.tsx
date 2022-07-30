import React, { useState } from 'react';
import { Image } from 'react-native';
import {List} from 'react-native-paper'
import TrackPlayer, { Event, Track, useTrackPlayerEvents } from 'react-native-track-player';
import { useApplicationContext } from '../../context/ApplicationContext';
import Icon from 'react-native-vector-icons/MaterialIcons'


const CurrentTrackInfo: React.FC = () => {

  const [currentTrack, setCurrentTrack] = useState<Track | null>(); 
  const {hideMusicControls} = useApplicationContext()


  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (e) => {
    if (e.type === Event.PlaybackTrackChanged)  {
      const currentTrackIndex = await TrackPlayer.getCurrentTrack()

      const newTrack = await TrackPlayer.getTrack(currentTrackIndex)

      setCurrentTrack(newTrack);
      console.log(newTrack?.url)
    }
  })

  let artwork = currentTrack?.artwork;

  if (!currentTrack) return null; 
  if (hideMusicControls.trackInfo) return null; 


  return (
    <>
    {/* <ProgressBar progress={0} color='orange'  /> */}
    <List.Item
      title={currentTrack.title}
      description={`${currentTrack.artist || 'Artista desconhecido'} • ${new Date((currentTrack.duration || 0) * 1000).toISOString().slice(14, 19)}`}
      left={(props) => <List.Icon {...props} icon={({size, color}) => (
        <Image 
        style={{height: 70, width: 70, borderRadius: 8, }}
          source={{uri: artwork}}
        />
      )} />}
     
    />
    </>
  );
}

export default CurrentTrackInfo;