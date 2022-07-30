import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Image, Text, useColorScheme, ScrollView} from 'react-native';
import { Appbar, Button, Paragraph, ProgressBar, TextInput } from 'react-native-paper';
import { useApplicationContext } from '../../context/ApplicationContext';
import FileManager from '../../native_modules/FileManager';
import { MusicSchemaProperties } from '../../schemas/MusicSchema';
import { Music } from '../../services/datasource';
import theme from '../../styles/theme';

// import { Container } from './styles';
// it's just here i promise
import RNFS from 'react-native-fs';

const EditMusic: React.FC = () => {

  const { setHideMusicControls, datasource, applicationSettings } = useApplicationContext();
  const navigation = useNavigation()
  const data: Music = useRoute().params

  const [visible, setVisible] = useState(true);
  // fix this later
  const [musicData, setMusicData] = useState<(MusicSchemaProperties & Realm.Object) | undefined>(undefined)

  const [title, setTitle] = useState(musicData?.title)
  const [artist, setArtist] = useState(musicData?.artist)
  const [URL, setURL] = useState(musicData?.url)
  const [description, setDescription] = useState(musicData?.description)
  const [filename, setFilename] = useState(musicData?.filename)
  const [connection, setConnection] = useState<Realm | undefined>()


  async function handleUpdateMusicInfo() {

    // const musicToBeUpdated = connection?.objectForPrimaryKey<MusicSchemaProperties>('Music', data.id)

    if (musicData) {
      connection?.write(() => {
        musicData.artist = artist 
        musicData.filename = filename
        musicData.description = description
        musicData.url = URL
        musicData.title = title
      }) 
    }

  }

  // this should delete the file from the file system and delete the metada from the 
  // realm db
  async function handleDeleteAllInfoAndFile() {

    if (!musicData?.isLocal) {
      connection?.write(() => {

        // const musicMetadata = connection.objectForPrimaryKey('Music', data.id);

        connection.delete(musicData); 
        navigation.navigate('App');
      })
      return; 
    }

    // needs to remove the 'file://' from the file
    const result = await FileManager.deleteMusicFile(musicData?.url.split('file://')[1])


    console.log(result);
    // if file deleted. Delete the metadata
    if (result) {
    
      connection?.write(() => {
        // const musicMetadata = connection.objectForPrimaryKey('Music', data.id);
        connection.delete(musicData); 
        navigation.navigate('App');
      })

    }

  }


  useEffect(() => {
    setHideMusicControls({
      trackController: true,
      trackInfo: true,
    })
    
    // Please Refactor this later
    async function getMusicData() {
      const connection = await datasource.connectToDatabase()
      setConnection(connection);

      const obj = connection?.objectForPrimaryKey<MusicSchemaProperties>('Music', data.id)
      setMusicData(obj)
      setArtist(obj?.artist)
      setDescription(obj?.description)
      setFilename(obj?.filename)
      setTitle(obj?.title)
      setURL(obj?.url)


      const exists = await RNFS.exists(obj?.url || '');
      console.log(`[EditMusic] does ${obj?.filename} exists: ${exists}`); 
      // check if music is local (workarround to fix some issues with using the download manager)
    
      
      // actually it does not fix, but gives an alternative for the user to work with
      // fix the non-existance bug

      // update existance of the file
      connection?.write(() => {
        obj.isLocal = exists
      })
    }

    getMusicData()
    
    return () => {
      setHideMusicControls({
        trackController: false,
        trackInfo: false,
      })   
    }
  }, [])


  return (
    <View
      style={{
        flex: 1,
       
      }}
    >
      <Appbar.Header
        style={{
          backgroundColor: useColorScheme() == 'dark' ? 'black' : 'white'
        }}
      >
        <Appbar.BackAction onPress={() => navigation.goBack()}/>
        <Appbar.Content title={title} subtitle={artist}/>
      </Appbar.Header>
      {
        // Indicator that the Music is not Local
        musicData?.isLocal ? <></> : <ProgressBar progress={1} color="red" />
      }

      <ScrollView>
      
      <Image 
        source={{
          uri: musicData?.artwork
        }}
        style={{
          width: 250,
          height: 250,
          alignSelf: 'center',
          margin: 32,
          borderRadius: 8
        }}
      />

      <Paragraph style={{alignSelf: 'center', margin: 16}}>
        Tem um arquivo local: <Text style={{fontWeight: '600'}}>{musicData?.isLocal ? 'Sim' : 'Não'}</Text>
      </Paragraph>

      <View style={{
        marginLeft: '5%',
        marginRight: '5%',
        margin: 32
      }}>
        <TextInput 
          label="Título"
          style={{marginBottom: 16}}
          value={title}
          onChangeText={(text) => setTitle(text)}

        />
          <TextInput 
          label="Artista"
          style={{marginBottom: 16}}
          value={artist}
          onChangeText={(text) => setArtist(text)}
        />
        <TextInput 
          label="URL"
          style={{marginBottom: 16}}
          value={URL}
          onChangeText={(text) => setURL(text)}
        />
        <TextInput 
          label='Nome do Arquivo'
          style={{marginBottom: 16}}
          value={filename}
          onChangeText={(text) => setFilename(text)}
        />
        <TextInput 
          label='Descrição'
          numberOfLines={3}

          style={{marginBottom: 16}}
          value={description}
          onChangeText={(text) => setDescription(text)}
        />
        <TextInput 
          label='ID'
          style={{marginBottom: 16}}
          value={musicData?.id}
          disabled
        />
        <TextInput 
          label='CID'
          style={{marginBottom: 16}}
          value={musicData?.cid}
          disabled

        />
        <Button 
          mode='contained'
          style={{marginBottom: 16}}
          onPress={handleUpdateMusicInfo}
        >
          Salvar
        </Button>
  
        <Button
          mode='contained'
          style={{marginBottom: 16}}
          disabled
        >
          Fazer Upload para Web3
        </Button>

        <Button
          mode='contained'
          style={{marginBottom: 16}}
          color={theme.colors.accent}
          onPress={handleDeleteAllInfoAndFile}
        >
          Excluir
        </Button>
      </View>
      </ScrollView>
    </View>
  );
}

export default EditMusic;