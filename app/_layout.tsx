import React from 'react';

import { View } from 'react-native';

import { Stack } from 'expo-router';

import { StatusBar } from 'expo-status-bar';

import { AlertProvider } from '../template/ui';
import { AuthProvider } from '../template';
import { GhostStealthProvider } from '../context/GhostStealthContext';

import StatusBarOverlay from '../components/common/StatusBarOverlay';





export default function RootLayout() {






  return (

    <View style={{ flex: 1, backgroundColor: '#000000' }}>

      {/* Premium Status Bar Overlay - Global */}

      <StatusBarOverlay style="light" backgroundColor="transparent" translucent={true} />

      

      <AlertProvider>

        <AuthProvider>

          <GhostStealthProvider>

          <Stack 

            screenOptions={{ 

              headerShown: false,

              animation: 'none',

              animationTypeForReplace: 'push',

              contentStyle: { backgroundColor: '#000' }

            }}

          >

                <Stack.Screen name="(tabs)" />

                <Stack.Screen name="login" />

                <Stack.Screen name="edit-profile" />

                <Stack.Screen name="help-center" />

                <Stack.Screen 

                  name="chat" 

                  options={{ 

                    headerShown: false,

                    animation: 'none',

                    presentation: 'modal',

                    contentStyle: { backgroundColor: '#000' }

                  }} 

                />

                <Stack.Screen 

                  name="notifications" 

                  options={{ 

                    headerShown: false,

                    animation: 'none',

                    presentation: 'modal',

                    contentStyle: { backgroundColor: '#000' }

                  }} 

                />

                <Stack.Screen 

                  name="songs" 

                  options={{ 

                    headerShown: false,

                    animation: 'none',

                    presentation: 'modal',

                    contentStyle: { backgroundColor: '#000' }

                  }} 

                />

                <Stack.Screen 

                  name="video/[id]" 

                  options={{ 

                    headerShown: false,

                    animation: 'none',

                    presentation: 'modal',

                    contentStyle: { backgroundColor: '#000' }

                  }} 

                />

                <Stack.Screen 
                  name="settings" 
                  options={{ 
                    headerShown: false,
                    animation: 'none',
                    contentStyle: { backgroundColor: '#000' }
                  }} 
                />

                <Stack.Screen 
                  name="verification" 
                  options={{ 
                    headerShown: false,
                    animation: 'none',
                    contentStyle: { backgroundColor: '#000' }
                  }} 
                />

              </Stack>

          </GhostStealthProvider>

        </AuthProvider>

      </AlertProvider>

    </View>

  );

}

