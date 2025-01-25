import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import CameraComponent from "./CameraComponent";
import DocumentScanner from "react-native-document-scanner-plugin";

const Welcome = () => {
  const [openCamera, setOpenCamera] = useState(false);
  const [pictures, setPictures] = useState<any>([]);
  const [scannedImages, setScannedImages] = useState<any>([]);

  const handlePictures = (newPic) => {
    setPictures((prev) => [...prev, newPic]);
  };
  const handleOpenCamera = (val) => {
    setOpenCamera(val);
  };

  const onScan = async () => {
    try {
      const result = await DocumentScanner.scanDocument({
        maxNumDocuments: 2,
        croppedImageQuality: 100,
        overlay: {
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderColor: '#ffffff',
          borderWidth: 2,
          height: '70%',
          width: '90%',
          marginTop: 0,
        }
      });
      setScannedImages(result.scannedImages);
      console.log(result.scannedImages);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View style={styles.container}>
      {openCamera ? (
        <CameraComponent
          handleOpenCamera={handleOpenCamera}
          handlePictures={handlePictures}
        />
      ) : (
        <>
          <View style={styles.buttonContainer}>
            <Pressable
              android_ripple={{ color: "#219ebc" }}
              style={styles.pressable}
              onPress={handleOpenCamera.bind(this, true)}
            >
              <Text style={styles.btnText}>Open Camera</Text>
            </Pressable>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              android_ripple={{ color: "#219ebc" }}
              style={styles.pressable}
              onPress={onScan}
            >
              <Text style={styles.btnText}>Scan Document</Text>
            </Pressable>
          </View>
          <View style={styles.listContainer}>
            <FlatList
              data={pictures}
              renderItem={({ item }) => {
                console.log("ITEM==>", item.uri);
                return (
                  <View style={styles.imageContainer}>
                    <Image style={styles.image} source={{ uri: item.uri }} />
                  </View>
                );
              }}
            />
            <FlatList
              data={scannedImages}
              renderItem={({ item }) => {
                return (
                  <View style={styles.imageContainer}>
                    <Image style={styles.image} source={{ uri: item }} />
                  </View>
                );
              }}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    height: 44,
    width: 130,
    marginVertical: 30,
    alignSelf: "center",
    backgroundColor: "#023047",
    overflow: "hidden",
    borderRadius: 8,
  },
  pressable: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
  },
  listContainer: {
    flex: 1,
  },
  imageContainer: {
    alignSelf: "center",
    marginVertical: 10,
  },
  image: {
    height: 200,
    width: 200,
  },
});
