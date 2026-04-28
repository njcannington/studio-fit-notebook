import { useFonts } from 'expo-font';

export function useBrandFonts() {
  return useFonts({
    Caveat: require('../assets/fonts/Caveat-Regular.ttf'),
    Oswald: require('../assets/fonts/Oswald-Regular.ttf'),
    'Architects Daughter': require('../assets/fonts/ArchitectsDaughter-Regular.ttf'),
    'Special Elite': require('../assets/fonts/SpecialElite-Regular.ttf'),
  });
}
