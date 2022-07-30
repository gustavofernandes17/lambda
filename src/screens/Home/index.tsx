import React, { useState } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useApplicationContext } from '../../context/ApplicationContext';

import TrackListItem from '../../components/TrackListItem';
import TrackPlayerServices from '../../services/MusicControlsServices/TrackPlayerServices';

const Home: React.FC = () => {
  
  const {musicLibrary, setMusicLibrary, datasource} = useApplicationContext()

  const [refreshing, setRefreshing] = useState(false)

  async function handleRefresh() {
    setRefreshing(true);

    const musics = await datasource.getAllMusicsInTrackPlayerFormat()
    console.log('refresig')

    setMusicLibrary(musics)
    await TrackPlayerServices.initializeMusicPlayer()
    await TrackPlayerServices.initilizeMusicQueue(musics)
    setRefreshing(false);

  }

  return (
    <View>
      <FlatList 
        data={musicLibrary}
        renderItem={({item}) => <TrackListItem {...item}/>}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      />
    </View>
  );
}

export default Home;