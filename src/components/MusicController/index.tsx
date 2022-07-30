import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { State, usePlaybackState, useProgress } from 'react-native-track-player';

import Icon from 'react-native-vector-icons/MaterialIcons'
import styles from './styles';
import TrackPlayer from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import CurrentTrackInfo from './CurrentTrackInfo';
import theme from '../../styles/theme';
import { useApplicationContext } from '../../context/ApplicationContext';


const MusicController: React.FC = () => {

  const progress = useProgress()

  const playbackState = usePlaybackState()  
  const playOrPauseIcon = playbackState === State.Playing ? 'pause' : 'play-arrow';

  const { hideMusicControls } = useApplicationContext()

  const handleTogglePlayState = async () => {

    if (playbackState === State.Playing) {
      TrackPlayer.pause()
    } else {
      TrackPlayer.play()
    }
  }

  const handleSkipNext = () => TrackPlayer.skipToNext()
  const handleSkipPrevious = () => TrackPlayer.skipToPrevious()

  if (hideMusicControls.trackController) return null; 


  return (
    <>
    <CurrentTrackInfo />
    <View>
      <Slider 
        maximumValue={progress.duration}
        minimumValue={0}
        value={progress.position}
        maximumTrackTintColor={theme.colors.primary}
        minimumTrackTintColor={theme.colors.primary}
        thumbTintColor={theme.colors.primary}
        onSlidingComplete={value => {
          TrackPlayer.seekTo(value);
        }}
      />
    </View>
    <View style={styles.container}>
        <TouchableOpacity onPress={handleSkipPrevious}>
          <Icon name="skip-previous" size={32} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleTogglePlayState}>
          <Icon name={playOrPauseIcon} size={32} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSkipNext}>
          <Icon name="skip-next" size={32} />
        </TouchableOpacity>
    </View>
    </>
  );
}

export default MusicController;