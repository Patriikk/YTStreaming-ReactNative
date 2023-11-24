import React, {useEffect, useRef, useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {Camera, CameraProps, useCameraDevice} from 'react-native-vision-camera';
import axios from 'axios';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const App = () => {
  const [cameraPermission, setCameraPermission] = useState();
  const device = useCameraDevice('back');
  const camera = useRef();
  const [broadcastId, setBroadcastId] = useState(null);
  const [streamUrl, setStreamUrl] = useState(null);
  const PROFILE_IMAGE_SIZE = 150;

  useEffect(() => {
    const cameraPermission = Camera.requestCameraPermission();
    Camera.getCameraPermissionStatus().then(v => setCameraPermission(v));
  }, []);
  GoogleSignin.configure({
    webClientId:
      '568591053508-1eh48q3d3nju4nkgd759lajpmnri0sut.apps.googleusercontent.com',
    offlineAccess: false,
    profileImageSize: PROFILE_IMAGE_SIZE,
  });

  const createLiveBroadcast = async () => {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/liveBroadcasts?part=id,snippet&key=AIzaSyCNgo6F2hlHxEt2o9XXY2jeI_vYDqZcpnc`,
    );
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
    return data;
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
      // setState({ userInfo });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        console.log(error);
      }
    }
  };

  return (
    <View style={{flex: 1}}>
      {cameraPermission == 'granted' && (
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          video={true}
          isActive={true}
          // frameProcessor={frameProcessor}
          frameProcessorFps={5}
        />
      )}
      <Button title="Hello" onPress={() => createLiveBroadcast()} />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
