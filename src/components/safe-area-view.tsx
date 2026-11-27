import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

/** react-native-safe-area-context의 SafeAreaView에 className을 쓸 수 있게 한 것 */
export const SafeAreaView = withUniwind(RNSafeAreaView);
