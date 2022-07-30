import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { handleGetPermissions, useApplicationContext } from '../../context/ApplicationContext';
import { YTMusicItem } from '../../services/api';


import YTResultCard from '../../components/YTResultCard';


const Explorer: React.FC = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [ytScrapedData, setYTScrapedData] = useState<YTMusicItem[]>()

  const {ytScraperAPI, readWritePermissions, setReadWritePermissions} = useApplicationContext()

  async function handleSearch(query: string) {
    const data = await ytScraperAPI.search(query)
    setYTScrapedData(data)
    console.log(data.length)
  }

  useEffect(() => {

    async function runPermisionVerification() {
      const [readPermision, writePermision] = await handleGetPermissions()
      setReadWritePermissions([readPermision, writePermision])
    }

    runPermisionVerification()
  },[])

  // Do not render if permissions not granted  
  if (!readWritePermissions[0] || !readWritePermissions[1]) return null;

  return (
    <View>
      <Searchbar 
        value={searchQuery} 
        onChangeText={(text) => setSearchQuery(text)}
        onSubmitEditing={() => handleSearch(searchQuery)}
      />

      <FlatList 
        data={ytScrapedData}
        renderItem={({item}) => <YTResultCard {...item} key={item.id}/> }
      />
    </View>
  );
}

export default Explorer;