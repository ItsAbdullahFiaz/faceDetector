import React, { useState } from 'react';
import { View, Button, FlatList, Image, StyleSheet } from 'react-native';
import DocumentScanner from 'react-native-document-scanner-plugin';

const DocumentCapture = () => {
    const [scannedImages, setScannedImages] = useState<any>([]);
    const onScan = async () => {
        try {
            const result = await DocumentScanner.scanDocument({
                maxNumDocuments: 2,
                overlay: {
                    borderColor: '#FF0000',
                    borderWidth: 2,
                    borderRadius: 10,
                    height: '80%',
                    width: '80%',
                },
            });
            // const base64Image = result.uri;
            setScannedImages(result.scannedImages);
            console.log(result.scannedImages);
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <View style={styles.container}>
            <Button title="Scan Document" onPress={onScan} />
            {scannedImages.length > 0 ? (
                <View>
                    <FlatList
                        data={scannedImages}
                        renderItem={({ item }) => (
                            <View>
                                <Image style={styles.image} source={{ uri: item }} />
                            </View>
                        )}
                    />
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: 200,
        height: 200,
    },
});

export default DocumentCapture;
