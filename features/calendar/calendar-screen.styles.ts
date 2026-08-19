import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAF9F7' },
  addButton: {
    position: 'absolute', right: 20, bottom: 20, width: 56, height: 56,
    borderRadius: 18, backgroundColor: '#6758D9', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#342A82', shadowOpacity: 0.3, shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 }, elevation: 6,
  },
});
