import React from 'react';
import { View } from 'react-native';
import { Dialog, Paragraph, Portal, Button} from 'react-native-paper';

// import { Container } from './styles';

export interface ConfirmationDialogProps {
  title: string
  handleDownloadMusic: () => Promise<void>; 
  visible: boolean; 
  hideDialog: () => void
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  visible,
  hideDialog,
  title,
  handleDownloadMusic
}) => {
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={hideDialog}
      >
        <Dialog.Title>
          Baixar
        </Dialog.Title>
        <Dialog.Content>
          <Paragraph>
            Tem certeza que deseja baixar "{title}"
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button 
            onPress={() => {
              handleDownloadMusic(); 
              hideDialog();
            }}>
              Baixar
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export default ConfirmationDialog;