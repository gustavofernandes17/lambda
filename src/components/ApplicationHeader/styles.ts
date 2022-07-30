import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  settingsButton: {
    position: 'absolute',
    margin: 8, 
    marginLeft: 24
  },
  logoText: {
    fontSize: 18,
    fontWeight: '600'
  },
  container: {
    // flex: 1,
    flexDirection: 'row',
    height: 40,
    alignItems: 'center', 
  },
  textContainer: {
    alignItems: 'center', 
    justifyContent: "center",
    flex: 1
  }
})

export default styles