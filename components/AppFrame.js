import { StatusBar } from 'expo-status-bar';

// The browser keeps the existing layout used as the visual reference.
export default function AppFrame({ children }) {
  return <><StatusBar style="dark" />{children}</>;
}
