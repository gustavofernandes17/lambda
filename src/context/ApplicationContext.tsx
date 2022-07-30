import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { PermissionsAndroid, ToastAndroid } from 'react-native';
import { selectDirectory } from 'react-native-directory-picker';
import { Track } from 'react-native-track-player';
import { Results, Object } from 'realm';
import { configurationSchemaProperties } from '../schemas/Configuration';
import { createYTScrapper, YTScrapperAPI } from '../services/api';

import datasource, { Datasource, Music } from '../services/datasource';
import TrackPlayerServices from '../services/MusicControlsServices/TrackPlayerServices';


export interface IAplicationContext {
  musicLibrary: Music[] | undefined 
  setMusicLibrary: React.Dispatch<React.SetStateAction<Music[] | undefined>>
  hideMusicControls: MusicControlVisibility 
  setHideMusicControls: React.Dispatch<React.SetStateAction<MusicControlVisibility>>
  ytScraperAPI: YTScrapperAPI
  setYTScrapperAPI: React.Dispatch<React.SetStateAction<YTScrapperAPI>>
  applicationSettings: (configurationSchemaProperties & Object) | undefined
  setApplicationSettings: React.Dispatch<React.SetStateAction<(configurationSchemaProperties & Object) | undefined>>
  readWritePermissions: [Boolean, Boolean]
  setReadWritePermissions: React.Dispatch<React.SetStateAction<[Boolean, Boolean]>>,
  datasource: Datasource ,

}

export interface MusicControlVisibility {
  trackController: Boolean;
  trackInfo: Boolean;
}

const ApplicationContext = createContext<IAplicationContext>({} as IAplicationContext)

const AplicationContextProvider: React.FC<{children: ReactNode}> = ({children}) => {


  const datasource = new Datasource();

  const [musicLibrary, setMusicLibrary] = useState<Music[] | undefined>();
  const [hideMusicControls, setHideMusicControls] = useState<MusicControlVisibility>({
    trackController: false, 
    trackInfo: false
  })
  const [ytScraperAPI, setYTScrapperAPI] = useState<YTScrapperAPI>(createYTScrapper())
  const [readWritePermissions, setReadWritePermissions] = useState<[Boolean, Boolean]>([false, false])

  const [applicationSettings, setApplicationSettings] = useState<(configurationSchemaProperties & Object) | undefined>()

  useEffect(() => {
    async function startup() {

      // Load Application Configuration
      const settings = await datasource.loadApplicationSettings()
      setApplicationSettings(settings)


      // Eh... tá ruim, mas o importante é o que importa
      settings?.addListener(async (obj, changes) => {

        console.log('[AppContext] Configuration Object being updated.')

        const updatedSettings = await datasource.loadApplicationSettings();
        setApplicationSettings(updatedSettings)

        ytScraperAPI.rawAPI.defaults.baseURL = updatedSettings?.yt_api_base_url

        ToastAndroid.show('Configurações alteradas.', ToastAndroid.BOTTOM)

      })

      // pelo amor de deus otimiza isso
      const allmusics = await datasource.getAllMusics(); 
      const musics = await datasource.getAllMusicsInTrackPlayerFormat();

      allmusics?.addListener(async (obj, changes) => {
        console.log('[AppContext] Musics being updated');
        const musics = await datasource.getAllMusicsInTrackPlayerFormat();
        setMusicLibrary(musics)

        await TrackPlayerServices.initilizeMusicQueue(musics);
      })
      
      setMusicLibrary(musics); 
      await TrackPlayerServices.initilizeMusicQueue(musics);
      ToastAndroid.show('Lista de Músicas recarregada', ToastAndroid.BOTTOM)
      
    }
    startup()
  }, [])

  
  return (
    <ApplicationContext.Provider value={{
      musicLibrary, 
      setMusicLibrary,
      hideMusicControls,
      setHideMusicControls,
      ytScraperAPI, 
      setYTScrapperAPI,
      readWritePermissions,
      setReadWritePermissions,
      datasource,
      applicationSettings,
      setApplicationSettings
    }}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplicationContext(): IAplicationContext {
  const appcontext = useContext(ApplicationContext); 
  return appcontext;
}

export async function handleGetPermissions(): Promise<[boolean, boolean]> {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    ]);
  } catch (err) {
    console.warn(err);
  }
  const readGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE); 
  const writeGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
  
  return [readGranted, writeGranted]
}

export default AplicationContextProvider;