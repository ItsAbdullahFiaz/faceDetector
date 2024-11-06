import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import EvilIcons from "@expo/vector-icons/EvilIcons";


const CloseButton = ({ handleCloseCamera }: any) => {
  return (
    <View style={styles.btnContainer}>
      <Pressable
        android_ripple={{ color: "#219ebc" }}
        style={styles.pressable}
        onPress={handleCloseCamera.bind(this, false)}
      >
        <EvilIcons name="close" size={20} color="#fff" />
      </Pressable>
    </View>
  )
}

export default CloseButton

const styles = StyleSheet.create({
  btnContainer: {
    height: 30,
    width: 30,
    backgroundColor: "#023047",
    overflow: "hidden",
    borderRadius: 15,
    position: "absolute",
    right: 15,
    top: 15,
    zIndex: 2
  },
  pressable: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 4
  },
})