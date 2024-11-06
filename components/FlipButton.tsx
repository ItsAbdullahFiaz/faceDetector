import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { isIOS } from '../utils/utils';

const FlipButton = ({ toggleCameraFacing }: any) => {
  return (
    <View style={styles.flipBtnContainer}>
      <Pressable
        android_ripple={{ color: "#219ebc" }}
        style={styles.pressable}
        onPress={toggleCameraFacing}
      >
        <MaterialIcons name={isIOS ? "flip-camera-ios" : "flip-camera-android"} size={24} color="#fff" />
      </Pressable>
    </View>
  )
}

export default FlipButton

const styles = StyleSheet.create({
  flipBtnContainer: {
    height: 40,
    width: 40,
    backgroundColor: "rgba(2, 48, 71, 0.5)",
    overflow: "hidden",
    borderRadius: 20,
    position: "absolute",
    right: 25,
    bottom: 50,
    zIndex: 2
  },
  pressable: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
})