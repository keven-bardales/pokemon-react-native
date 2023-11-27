import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="pokemon"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
