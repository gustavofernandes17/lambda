
import React from "react";
import { YTMusicItem } from "../../services/api";

import ytdl from 'react-native-ytdl'; 

import FileManager from "../../native_modules/FileManager";
import { Card, Snackbar } from "react-native-paper";
import ConfirmationDialog from "./ConfirmationDialog";
import { Alert, ToastAndroid } from "react-native";
import { MusicSchemaProperties } from "../../schemas/MusicSchema";
import { LearnMoreLinks } from "react-native/Libraries/NewAppScreen";
import { useApplicationContext } from "../../context/ApplicationContext";

const YTResultCard: React.FC<YTMusicItem> = ({title, username, thumbnail_src, duration, url, id}) => {

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const {datasource} = useApplicationContext()

  const handleDownloadMusicV2 = async () => {
    try {
      
      const onComplete = () => {console.log('[YTResultCard] completed Download')};

      const urls = await ytdl(url, {quality: 'highestaudio'}); 
      const downloadURL = urls[0].url
      const filename = `lambda-${id}.ogg`

      const baseDirectory = await FileManager.getBaseDirectory();
      const path = `${baseDirectory}/${filename}`

      const wasDownloadedRequestSus = 
      await FileManager.downloadMusicFromURLUsingFetch(
        downloadURL, path
      );

      console.log('[YTResultCard] was download started: ' + wasDownloadedRequestSus); 

    } catch(err) {
      console.log('[YTResultCard] Erro: ')
      console.log(err)
      ToastAndroid.showWithGravity('Um erro ocorreu ao tentar baixar o vídeo', 50 ,ToastAndroid.BOTTOM)
    }
  }


  const handleDownloadMusic = async () => {
    try {
      const urls = await ytdl(url, {quality: 'highestaudio'}); 
      const downloadURL = urls[0].url
      const filename = `lambda-${id}.ogg`


      FileManager.downloadMusicFromURL(downloadURL, filename, title, username);
      const baseDirectory = await FileManager.getBaseDirectory();

      console.log(baseDirectory)
      ToastAndroid.show('Download Iniciado.', ToastAndroid.BOTTOM)
      

      // converting duration to seconds
      let seconds = 0;
      const durationSplit = duration.split(':')

      if (durationSplit.length === 3) {
        seconds = (+durationSplit[0]) * 60 * 60 + (+durationSplit[1]) * 60 + (+durationSplit[2]); 
      } else {
        seconds = (+durationSplit[0]) * 60 + (+durationSplit[1]);
      }


      const musicData: MusicSchemaProperties = {
        url: `file://${baseDirectory}/${filename}`,
        artist: username,
        artwork: thumbnail_src, 
        id: id,
        title: title,
        cid: '',
        description: '', 
        duration: seconds,
        isLocal: true,
        filename: filename,
        ytStreamingUrl: downloadURL
      }

      const connection = await datasource.connectToDatabase(); 
      
      connection?.write(() => {
        connection.create('Music', musicData, 'modified')
      })
      
      ToastAndroid.show('metadados salvos na biblioteca local.', ToastAndroid.BOTTOM)

    } catch(err) {
      console.log('[YTResultCard] Erro: ')
      console.log(err)
      ToastAndroid.showWithGravity('Um erro ocorreu ao tentar baixar o vídeo', 50 ,ToastAndroid.BOTTOM)
    }
  }

  
  return (
    <>
      <ConfirmationDialog 
        title={title}
        visible={visible}
        handleDownloadMusic={handleDownloadMusic}
        hideDialog={hideDialog}
      />
      <Card onPress={showDialog}>
        <Card.Cover source={{uri: thumbnail_src}} />   
        <Card.Title title={title} subtitle={`${username} • ${duration}`}/>
      </Card>
    </>
  )
}

export default YTResultCard