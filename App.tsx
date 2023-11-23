import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Camera, CameraProps, useCameraDevice } from "react-native-vision-camera";
const App = () => {

  const [cameraPermission, setCameraPermission] = useState<Boolean>();
  const device = useCameraDevice("front");
  const camera = useRef();



  useEffect(() => {
    const cameraPermission = Camera.requestCameraPermission()
    Camera.getCameraPermissionStatus().then((v) => console.log(v)
    );
  }, []);




  return (
    <View style={{ flex: 1 }} >
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        video={true}
        isActive={true}
        // frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />
    </View>
  )
}

export default App

const styles = StyleSheet.create({})