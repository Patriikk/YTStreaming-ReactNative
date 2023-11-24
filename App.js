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
  // GoogleSignin.configure({
  //   webClientId:
  //     '568591053508-1eh48q3d3nju4nkgd759lajpmnri0sut.apps.googleusercontent.com',
  //   offlineAccess: false,
  //   profileImageSize: PROFILE_IMAGE_SIZE,
  // });

  GoogleSignin.configure({
    scopes: [
      'https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/youtube.readonly',
    ], // what API you want to access on behalf of the user, default is email and profile
    webClientId:
      '407570391570-8tt7tn1f6s52g92v2v108u893elfpo06.apps.googleusercontent.com',
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    hostedDomain: '', // specifies a hosted domain restriction
    forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
    accountName: '', // [Android] specifies an account name on the device that should be used
    // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
    openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
    profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
  });

  const createLiveBroadcast = async accessToken => {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/liveBroadcasts?part=id,snippet&key=AIzaSyCP2WemHVqYALBw-t47RzFUSYwZAPrwlGQ`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const data = await response.json();

    console.log(JSON.stringify(data, null, 2));
    return data;
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      // setState({ user: null }); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const {accessToken} = await GoogleSignin.getTokens();
      // setState({ userInfo });
      createLiveBroadcast(accessToken);
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
      <Button title="Hello" onPress={() => signIn()} />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
