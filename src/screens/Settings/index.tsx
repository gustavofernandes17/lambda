import React, { useEffect, useState } from 'react';
import { Image, ToastAndroid, View } from 'react-native';
import { Button, Dialog, Paragraph, Portal, Text, TextInput, Title } from 'react-native-paper';
import { useApplicationContext } from '../../context/ApplicationContext';
import { Caption } from 'react-native-paper'
import { configurationSchemaProperties } from '../../schemas/Configuration';

// import { Container } from './styles';

const Settings: React.FC = () => {


  const {
    setHideMusicControls,
    applicationSettings,
    readWritePermissions,
    datasource
  } = useApplicationContext()

  const [downloadDirectory, setDownloadDirectory] = useState(applicationSettings?.download_directory_path); 
  const [ytBaseURL, setytBaseURL] = useState(applicationSettings?.yt_api_base_url); 
  const [web3BaseURL, setWeb3BaseURL] = useState(applicationSettings?.web3proxy_api_base_url); 

  const [visible, setVisible] = useState(false)

  const openDialog = () => setVisible(true);
  const closeDialog = () => setVisible(false)

  async function handleUpdateSettings() {
    const connection = await datasource.connectToDatabase(); 

    connection?.write(() => {
      const settings = connection.objects<configurationSchemaProperties>('Configuration')[0]

      settings.download_directory_path = downloadDirectory; 
      settings.yt_api_base_url = ytBaseURL; 
      settings.web3proxy_api_base_url = web3BaseURL; 
    })

    closeDialog(); 
  }

  useEffect(() => {
    // Hides the music controls from the screem
    setHideMusicControls({
      trackController: true,
      trackInfo: true
    })

    return () => {
      setHideMusicControls({
        trackController: false,
        trackInfo: false
      })
    }

  }, [])


  return (
  <>
    <Portal>
          <Dialog visible={visible} onDismiss={closeDialog}>
            <Dialog.Title>Confirmação</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Tem certeza que deseja alterar as configuraçãos</Paragraph>
              <Paragraph>Tome cuidado ao alterar essas configurações. valores incorretos podem levar a um comportamento imprevisivel</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={handleUpdateSettings}>Alterar</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

    <View style={{
      flex: 1,
      
    }}>
      <View style={{height: 100, alignItems: 'center', justifyContent: 'center'}}>
        <Image 
          source={require("../../assets/Logo.png")}
          style={{height: 50, width: 50}}
        />
        <Caption>1.0.0</Caption>
        
      </View>
      <Caption 
      style={{alignSelf: 'center', margin: '5%', marginBottom: 16, textAlign: 'center'}}>
        Tome cuidado ao alterar essas configurações. valores incorretos podem levar a um comportamento imprevisivel</Caption>
      <View style={{
        marginLeft: '5%',
        marginRight: '5%',
        flex: 1
      }}>
          <TextInput 
            label="youtube scrape api"
            value={ytBaseURL}
            onChangeText={(text) => setytBaseURL(text)}
            style={{marginBottom: 16}}
          />

          <TextInput 
            label="Diretório de Download"
            value={downloadDirectory}
            onChangeText={(text) => setDownloadDirectory(text)}
            style={{marginBottom: 16}}
          />
          <TextInput 
            label="Web3 Proxy API"
            value={web3BaseURL}
            disabled
            onChangeText={(text) => setWeb3BaseURL(text)}
            style={{marginBottom: 16}}
          />
            <Paragraph>
              O status da permissão de leitura de dados (read) é: {' '}
              {
                readWritePermissions[0] ? 
                <Text style={{fontWeight:'800'}}>Permitido</Text> : 
                <Text style={{fontWeight:'800'}}>Negado</Text> 
              }  
            </Paragraph>
            <Paragraph>
            O status da permissão de alteração de dados (write) é: {' '} 
            {
              readWritePermissions[1] ?  
              <Text style={{fontWeight:'800'}}>Permitido</Text> : 
              <Text style={{fontWeight:'800'}}>Negado</Text> 
            }
            </Paragraph>
            <Button 
              onPress={openDialog}
              mode="contained" 
              style={{
                marginBottom: 16,
                marginTop: 16 
              }}>
              Salvar
            </Button>
            <Button mode='contained' disabled>
              Carregar Biblioteca Local
            </Button>
      </View>
        
    </View>

    </>
  );
}

export default Settings;