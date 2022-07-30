import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

import styles from './styles';

const ApplicationHeader: React.FC<NativeStackHeaderProps> = ({navigation, options, route, back}) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.logoText}>
          λ
        </Text>
      </View>
      <TouchableOpacity 
      onPress={() => navigation.navigate('Configurações')}
      style={styles.settingsButton}>
        <Icon name="settings" size={18} />
      </TouchableOpacity>
    </View>
  )
}
export default ApplicationHeader