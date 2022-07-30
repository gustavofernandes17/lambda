import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';


import { Datasource, Music } from './services/datasource';

import { Provider as PaperProvider } from 'react-native-paper';
import theme from './styles/theme';

import Routes from './routes';

import MusicController from './components/MusicController'
import AplicationContextProvider from './context/ApplicationContext';

import TrackServices from './services/MusicControlsServices/TrackPlayerServices'
// import { MusicSchemaProperties } from './schemas/MusicSchema';


const App = () => {

  const { initializeMusicPlayer, initilizeMusicQueue } = TrackServices

  // Stores if the player is ready or not
  const [isPlayerReady, setIsPlayerReady] = useState(false); 
  // const [musicLibrary, setMusicLibrary] = useState<Music[] | undefined>([])

  const db = new Datasource()
  
  // const [database, setDatabase] = useState<Realm | undefined>({} as Realm);

  // run all necessary initializations when the main application mounts
  async function startup() {
    // await db.loadAllLocalFilesToDatabase()

    const loadedMusicLibrary = await db.getAllMusicsInTrackPlayerFormat();
    const isInitializationComplete = await initializeMusicPlayer();

    setIsPlayerReady(isInitializationComplete);
    
    await initilizeMusicQueue(loadedMusicLibrary)
  }

  useEffect(() => {
    startup()
  }, [])

  // if it's not ready do not render the Application
  if (!isPlayerReady) {
    return (
    <View style={styles.container}> 
      <ActivityIndicator color={theme.colors.primary}/> 
    </View>
    )
  }

  return (
    <AplicationContextProvider>
      <PaperProvider theme={theme}>
        <Routes />
        <MusicController />
      </PaperProvider>
    </AplicationContextProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default App;
