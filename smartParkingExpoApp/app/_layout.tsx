import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screens/reserva"
        options={{
          headerShown: true,
          title: "Reserva",
          headerStyle: {
            backgroundColor: "#e91e63",
          },
          headerTintColor: "#fff",
        }}
      />
    </Stack>
  );
}
