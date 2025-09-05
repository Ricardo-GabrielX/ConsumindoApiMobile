// app/_layout.tsx
import { Stack } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function RootLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerTitle: 'Sistema de Clientes',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/clientes/novo')}>
              <Text style={styles.headerButton}>Novo</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="clientes/novo"
        options={{
          title: 'Novo Cliente',
        }}
      />
      <Stack.Screen
        name="clientes/[id]"
        options={{
          title: 'Editar Cliente',
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 16,
  },
});