import { useEffect, useState } from 'react';
import AppFrame from './components/AppFrame';
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
import {
  finishVideo,
  getQuizResults,
  getVideoProgress,
  getVideos,
  login,
  register,
  requestPasswordReset,
  resetPassword,
  saveQuizResult as saveQuizResultApi,
  startVideo,
  updateUser,
  uploadProfilePhoto,
} from './api';

const VIDEO_PLAYLISTS = {
  curriculo: [
    { title: 'Parte 1', source: require('./assets/parte 1.mov'), durationSeconds: 28.337 },
    { title: 'Parte 2', source: require('./assets/parte 2.mp4'), durationSeconds: 32.392 },
    { title: 'Parte 3 - Final', source: require('./assets/parte 3 - final.mp4'), durationSeconds: 28.062 },
  ],
  conexoes: [
    { title: 'Parte 1', source: require('./assets/se conect 1.mp4'), durationSeconds: 34.433 },
    { title: 'Parte 2 - Final', source: require('./assets/se conect 2.mp4'), durationSeconds: 38.2 },
  ],
  'imagem-profissional': [
    { source: require('./assets/de bom dia em bom dia.mp4'), durationSeconds: 32.833 },
  ],
};

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
  const [quizTopic, setQuizTopic] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoPart, setSelectedVideoPart] = useState(0);
  const [videos, setVideos] = useState([]);
  const [videoProgress, setVideoProgress] = useState({ watchedCount: 0, totalVideos: 0, videos: [] });
  const [quizResults, setQuizResults] = useState({});

  const startQuiz = (video) => {
    setQuizTopic(video);
    setScreen('quizQuestion');
  };

  const saveQuizResult = async (score, total) => {
    if (!currentUser?.id || !quizTopic?.id) {
      setScreen('quiz');
      return;
    }

    try {
      const result = await saveQuizResultApi(currentUser.id, quizTopic.id, { score, total });
      setQuizResults((prev) => ({
        ...prev,
        [quizTopic.id]: { score: result.score, total: result.total, answered_at: result.answered_at },
      }));
    } catch (error) {
      console.warn('Erro ao salvar resultado do quiz:', error.message);
    }

    setScreen('quiz');
  };

  const loadVideoProgress = async (userId = currentUser?.id) => {
    if (!userId) return;

    try {
      const progress = await getVideoProgress(userId);
      setVideoProgress(progress);
    } catch (error) {
      console.warn('Erro ao carregar progresso dos videos:', error.message);
    }
  };

  const loadVideos = async () => {
    try {
      const nextVideos = await getVideos();
      setVideos(Array.isArray(nextVideos) ? nextVideos : []);
    } catch (error) {
      console.warn('Erro ao carregar videos:', error.message);
    }
  };

  const loadQuizResults = async (userId = currentUser?.id) => {
    if (!userId) return;

    try {
      const results = await getQuizResults(userId);
      const nextResults = {};
      for (const result of results || []) {
        nextResults[result.video_id] = {
          score: result.score,
          total: result.total,
          answered_at: result.answered_at,
        };
      }
      setQuizResults(nextResults);
    } catch (error) {
      console.warn('Erro ao carregar resultados dos quizzes:', error.message);
    }
  };

  useEffect(() => {
    let active = true;

    const loadUserData = async () => {
      await loadVideos();

      if (!active) return;

      await Promise.all([
        loadVideoProgress(currentUser.id),
        loadQuizResults(currentUser.id),
      ]);
    };

    if (currentUser?.id) {
      loadUserData();
    } else {
      setVideos([]);
      setVideoProgress({ watchedCount: 0, totalVideos: 0, videos: [] });
      setQuizResults({});
    }

    return () => {
      active = false;
    };
  }, [currentUser?.id]);

  const playVideo = async (video) => {
    setSelectedVideo(video);
    setSelectedVideoPart(0);
    setScreen('videoPlayer');

    if (currentUser?.id && video?.id) {
      try {
        const progress = await startVideo(currentUser.id, video.id);
        setVideoProgress(progress);
      } catch (error) {
        console.warn('Erro ao iniciar video:', error.message);
      }
    }
  };

  const finishCurrentVideo = async () => {
    const playlist = VIDEO_PLAYLISTS[selectedVideo?.id] || [];

    if (selectedVideoPart < playlist.length - 1) {
      setSelectedVideoPart((currentPart) => currentPart + 1);
      return;
    }

    if (currentUser?.id && selectedVideo?.id) {
      try {
        const progress = await finishVideo(currentUser.id, selectedVideo.id);
        setVideoProgress(progress);
      } catch (error) {
        console.warn('Erro ao finalizar video:', error.message);
      }
    }

    setScreen('home');
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
      return updated;
    } catch (error) {
      setProfileError(error.message);
      throw error;
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUploadProfilePhoto = async (asset) => {
    if (!currentUser?.id) return;
    setProfileError('');
    setProfileLoading(true);
    try {
      const updated = await uploadProfilePhoto(currentUser.id, asset);
      setCurrentUser(updated);
      return updated;
    } catch (error) {
      setProfileError(error.message);
      throw error;
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setScreen('login');
  };

  const quizVideos = videos.length ? videos : videoProgress.videos;
  const homeVideos = videos.map((video) => {
    const playlist = VIDEO_PLAYLISTS[video.id] || [];
    return {
      ...video,
      video_count: playlist.length,
      duration_seconds: playlist.reduce((total, part) => total + part.durationSeconds, 0),
    };
  });
  const selectedPlaylist = VIDEO_PLAYLISTS[selectedVideo?.id] || [];
  const selectedPart = selectedPlaylist[selectedVideoPart];

  const ready = paytoneLoaded && montserratLoaded && natsLoaded;

  if (!ready) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#02457C" />
      </View>
    );
  }

  return (
    <AppFrame authScreen={['login', 'register', 'forgot'].includes(screen)}>
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
          onRequestCode={requestPasswordReset}
          onResetPassword={resetPassword}
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
          videos={homeVideos}
          onLogout={handleLogout}
          onNavigate={setScreen}
          onPlayVideo={playVideo}
        />
      )}
      {screen === 'videoPlayer' && (
        <VideoPlayerScreen
          key={`${selectedVideo?.id}:${selectedVideoPart}`}
          title={selectedVideo?.title}
          partTitle={selectedPart?.title}
          source={selectedPart?.source}
          partNumber={selectedVideoPart + 1}
          partCount={selectedPlaylist.length}
          initialDuration={selectedPart?.durationSeconds || 0}
          onPrevious={selectedVideoPart > 0
            ? () => setSelectedVideoPart((currentPart) => Math.max(0, currentPart - 1))
            : undefined}
          isLastVideo={selectedVideoPart >= selectedPlaylist.length - 1}
          onLogout={() => setScreen('login')}
          onNavigate={setScreen}
          onHome={() => setScreen('home')}
          onFinish={finishCurrentVideo}
        />
      )}
      {screen === 'profile' && (
        <ProfileScreen
          currentUser={currentUser}
          videos={quizVideos}
          quizResults={quizResults}
          onUpdateProfile={handleUpdateProfile}
          onUploadProfilePhoto={handleUploadProfilePhoto}
          loading={profileLoading}
          error={profileError}
          onLogout={handleLogout}
          onNavigate={setScreen}
          onHome={() => setScreen('home')}
        />
      )}
      {screen === 'quiz' && (
        <QuizScreen
          username={currentUser?.name || '(usuário)'}
          videos={quizVideos}
          onLogout={() => setScreen('login')}
          onNavigate={setScreen}
          onHome={() => setScreen('home')}
          onSelectTopic={startQuiz}
          quizResults={quizResults}
        />
      )}
      {screen === 'quizQuestion' && (
        <QuizQuestionScreen
          video={quizTopic}
          onFinish={saveQuizResult}
          onLogout={() => setScreen('login')}
          onNavigate={setScreen}
          onHome={() => setScreen('home')}
        />
      )}
      {screen === 'progress' && (
        <ProgressScreen
          username={currentUser?.name || '(usuário)'}
          videos={quizVideos}
          quizResults={quizResults}
          onRefreshProgress={() => loadQuizResults()}
          onLogout={() => setScreen('login')}
          onNavigate={setScreen}
          onHome={() => setScreen('home')}
        />
      )}
    </AppFrame>
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
