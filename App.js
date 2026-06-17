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
import { login, register, updateUser } from './api';

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
  const [currentUser, setCurrentUser] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
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

  const handleLogin = async ({ email, password }) => {
    setLoginError('');
    setLoginLoading(true);
    try {
      const user = await login({ email, password });
      setCurrentUser(user);
      setScreen('home');
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async ({ name, email, password }) => {
    setRegisterError('');
    setRegisterLoading(true);
    try {
      await register({ name, email, password });
      setScreen('login');
    } catch (error) {
      setRegisterError(error.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleUpdateProfile = async (payload) => {
    if (!currentUser?.id) return;
    setProfileError('');
    setProfileLoading(true);
    try {
      const updated = await updateUser(currentUser.id, payload);
      setCurrentUser(updated);
    } catch (error) {
      setProfileError(error.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setScreen('login');
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
          onLogin={handleLogin}
          onForgotPassword={() => setScreen('forgot')}
          onRegister={() => setScreen('register')}
          loading={loginLoading}
          error={loginError}
        />
      )}
      {screen === 'forgot' && (
        <ForgotPasswordScreen
          onFinish={() => setScreen('login')}
          onBack={() => setScreen('login')}
        />
      )}
      {screen === 'register' && (
        <RegisterScreen
          onRegister={handleRegister}
          onLogin={() => setScreen('login')}
          loading={registerLoading}
          error={registerError}
        />
      )}
      {screen === 'home' && (
        <HomeScreen
          username={currentUser?.name || '(usuário)'}
          onLogout={handleLogout}
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
          currentUser={currentUser}
          onUpdateProfile={handleUpdateProfile}
          loading={profileLoading}
          error={profileError}
          onLogout={handleLogout}
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
