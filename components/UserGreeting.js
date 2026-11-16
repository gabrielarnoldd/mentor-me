import { StyleSheet, Text, View } from 'react-native';

export default function UserGreeting({ username, message, style }) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.welcome}>
        Bem-vindo, <Text style={styles.name}>{username}</Text>
      </Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    minWidth: 0,
    backgroundColor: '#EAF3F7',
    borderRadius: 14,
    borderLeftWidth: 2,
    borderLeftColor: '#02457C',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  welcome: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 20,
    lineHeight: 26,
    color: '#46677B',
  },
  name: {
    fontFamily: 'Montserrat_700Bold',
    color: '#02457C',
  },
  message: {
    marginTop: 3,
    fontFamily: 'Montserrat_500Medium',
    fontSize: 13,
    lineHeight: 19,
    color: '#46677B',
  },
});
