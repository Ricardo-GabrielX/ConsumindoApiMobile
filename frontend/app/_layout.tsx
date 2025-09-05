// app/_layout.tsx
import { Stack } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function RootLayout() {
  const router = useRouter();
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#00C851',
          ...(Platform.OS === 'ios' && {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          }),
          ...(Platform.OS === 'android' && {
            elevation: 4,
          }),
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerTitle: () => (
            <View style={styles.titleContainer}>
              <Text style={styles.titleEmoji}>👥</Text>
              <Text style={styles.titleText}>Sistema de Clientes</Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => router.push('/clientes/novo')}
              style={styles.headerButton}
            >
              <Text style={styles.headerButtonText}>+ Novo</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="clientes/novo"
        options={{
          title: 'Novo Cliente',
          headerBackTitle: 'Voltar',
        }}
      />
      <Stack.Screen
        name="clientes/[id]"
        options={{
          title: 'Editar Cliente',
          headerBackTitle: 'Voltar',
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleEmoji: {
    fontSize: 20,
  },
  titleText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  headerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});