import { Tabs } from 'expo-router';
import { colors, fontFamilies } from '@studio-fit/design-tokens';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: colors.paper.cream,
        tabBarInactiveTintColor: colors.ink.pencilFaded,
        tabBarStyle: {
          backgroundColor: colors.iron.base,
          borderTopColor: colors.iron.light,
        },
        tabBarLabelStyle: {
          fontFamily: fontFamilies.block,
          fontSize: 10,
          letterSpacing: 1,
          textTransform: 'uppercase',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="book.closed" color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="clock.arrow.circlepath" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: 'Me',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}
