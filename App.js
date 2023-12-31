import { View } from 'react-native';
import { PaperProvider, MD3DarkTheme as Theme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from './src/components/TopBar';
import Home from './src/screens/Home';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <PaperProvider theme={Theme}>
      <SafeAreaView>
        <TopBar />
        <View className="h-screen p-4 bg-black">
          <Home />
        </View>
      </SafeAreaView>
      <StatusBar style="light" backgroundColor='#000'/>
    </PaperProvider>
  );
}