import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView, initialWindowMetrics } from 'react-native-safe-area-context';

export default function AppFrame({ children, authScreen }) {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <StatusBar style={authScreen ? 'dark' : 'light'} />
      <SafeAreaView edges={['top', 'left', 'right']} style={[styles.root, { backgroundColor: authScreen ? '#D7E8EF' : '#02457C' }]}>
        <View style={styles.content}>
          {children}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1, backgroundColor: '#D7E8EF' },
});
