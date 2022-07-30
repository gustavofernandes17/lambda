import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, ToastAndroid, useColorScheme } from "react-native";
import { Divider, IconButton, List, Menu, ProgressBar } from "react-native-paper";
import TrackPlayer from "react-native-track-player";
import { useApplicationContext } from "../../context/ApplicationContext";
import { Datasource, Music } from "../../services/datasource";
import styles from "./styles";

import RNFS from 'react-native-fs'
import FileManager from "../../native_modules/FileManager";
import { MusicSchemaProperties } from "../../schemas/MusicSchema";


const TrackListItem: React.FC<Music> = (music) => {
  const {title, url, artist, artwork, description, duration, id} = music
  const { musicLibrary, datasource } = useApplicationContext();


  const [visible, setVisible] = React.useState(false);
  const navigation = useNavigation()

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleSkipToMusic =  () => {
    musicLibrary?.forEach((music, musicIndex) => {
      if (music.id === id)  {
        TrackPlayer.skip(musicIndex)
      }
    })
  }

  function handleUpdateMusic() {
    navigation.navigate('EditMusic', music)
    closeMenu(); 
  }

  useEffect
  
  return (
    <>

    <List.Item 
      onPress={handleSkipToMusic}
      style={{
        backgroundColor: useColorScheme() === 'dark' ? 'black' : 'white'
      }}
      title={title}
      description={`${artist} • ${new Date((duration || 0) * 1000).toISOString().slice(14, 19)}`}
      left={(props) => <List.Icon {...props} icon={() => (
        <Image 
          style={styles.image}
          source={{uri: artwork}}
        />
      )} 
      />}
      right={
        (props) => (
          
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={<IconButton {...props} icon="dots-vertical" onPress={openMenu} />}>
          {/* <Menu.Item onPress={() => {}} title="Fazer upload para a Web3" /> */}
          {/* <Menu.Item onPress={() => {}} title="Deletar Arquivo Local" /> */}
          <Menu.Item onPress={async () => {
            const connection = await datasource.connectToDatabase();
            const fullMusic = connection?.objectForPrimaryKey<MusicSchemaProperties>('Music', music.id); 

            if(await RNFS.exists(fullMusic?.url || '')) {
              const result = await FileManager.deleteMusicFile(fullMusic?.url.split('file://')[1] || '');
              

              if (!result) ToastAndroid.show('Houve um problema ao deletar o arquivo', ToastAndroid.LONG);
              if (result) {
                connection?.write(() => {
                  connection.delete(fullMusic); 
                })
              }
            } 

          }} title="Excluir" />
          <Menu.Item onPress={handleUpdateMusic} title="Editar" />
        </Menu>
        

          
        )
      }
    />
  </>
  )
}

export default TrackListItem;