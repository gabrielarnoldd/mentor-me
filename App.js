import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useFonts as usePaytoneOne, PaytoneOne_400Regular } from '@expo-google-fonts/paytone-one';
import {
  useFonts as useMontserrat,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_700Bold_Italic,
} from '@expo-google-fonts/montserrat';
import { useFonts as useCustomFonts } from 'expo-font';
import LoginScreen from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import QuizScreen from './screens/QuizScreen';
import QuizQuestionScreen from './screens/QuizQuestionScreen';
import ProgressScreen from './screens/ProgressScreen';
import VideoPlayerScreen from './screens/VideoPlayerScreen';

export default function App() {
  const [paytoneLoaded] = usePaytoneOne({ PaytoneOne_400Regular });
  const [montserratLoaded] = useMontserrat({
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_700Bold_Italic,
  });
  const [natsLoaded] = useCustomFonts({
    NATS_400Regular: require('./assets/fonts/NATS-Regular.ttf'),
  });

  const [screen, setScreen] = useState('login');
  const [quizTopic, setQuizTopic] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [quizResults, setQuizResults] = useState({
    'Como criar um currículo acertivo': { score: 7, total: 10 },
    'Como se conectar com as pessoas certas': { score: 9, total: 10 },
    'Perfil Profissional': { score: 4, total: 10 },
  });

  const startQuiz = (topic) => {
    setQuizTopic(topic);
    setScreen('quizQuestion');
  };

  const saveQuizResult = (score, total) => {
    setQuizResults((prev) => ({ ...prev, [quizTopic]: { score, total } }));
    setScreen('quiz');
  };

  const playVideo = (title) => {
    setVideoTitle(title);
    setScreen('videoPlayer');
  };

  const ready = paytoneLoaded && montserratLoaded && natsLoaded;

  if (!ready) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#02457C" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      {screen === 'login' && (
        <LoginScreen
          onLogin={() => setScreen('home')}
          onForgotPassword={() => setScreen('forgot')}
          onRegister={() => setScreen('register')}
        />
      )}
      {screen === 'forgot' && (
        <ForgotPasswordScreen
          onFinish={() => setScreen('login')}
          onBack={() => setScreen('login')}
        />
      )}
      {screen === 'register' && (
        <RegisterScreen onLogin={() => setScreen('login')} />
      )}
      {screen === 'home' && (
        <HomeScreen
          onLogout={() => setScreen('login')}
          onNavigate={setScreen}
          onPlayVideo={playVideo}
        />
      )}
      {screen === 'videoPlayer' && (
        <VideoPlayerScreen
          title={videoTitle}
          onLogout={() => setScreen('login')}
          onNavigate={setScreen}
          onHome={() => setScreen('home')}
        />
      )}
      {screen === 'profile' && (
        <ProfileScreen
          onLogout={() => setScreen('login')}
          onNavigate={setScreen}
          onHome={() => setScreen('home')}
        />
      )}
      {screen === 'quiz' && (
        <QuizScreen
          onLogout={() => setScreen('login')}
          onNavigate={setScreen}
          onHome={() => setScreen('home')}
          onSelectTopic={startQuiz}
          quizResults={quizResults}
        />
      )}
      {screen === 'quizQuestion' && (
        <QuizQuestionScreen
          topic={quizTopic}
          onFinish={saveQuizResult}
          onLogout={() => setScreen('login')}
          onNavigate={setScreen}
          onHome={() => setScreen('home')}
        />
      )}
      {screen === 'progress' && (
        <ProgressScreen
          onLogout={() => setScreen('login')}
          onNavigate={setScreen}
          onHome={() => setScreen('home')}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: '#D7E8EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
