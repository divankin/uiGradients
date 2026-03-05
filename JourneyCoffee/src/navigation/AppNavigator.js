import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Screens
import { BrewScreen } from '../screens/BrewScreen';
import { RecipeSelectScreen } from '../screens/RecipeSelectScreen';
import { BrewSetupScreen } from '../screens/BrewSetupScreen';
import { BrewSessionScreen } from '../screens/BrewSessionScreen';
import { BrewCompleteScreen } from '../screens/BrewCompleteScreen';
import { RecipesScreen } from '../screens/RecipesScreen';
import { RecipeDetailScreen } from '../screens/RecipeDetailScreen';
import { BeansScreen } from '../screens/BeansScreen';
import { BeanDetailScreen } from '../screens/BeanDetailScreen';
import { QuizScreen } from '../screens/QuizScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { WebsiteScreen } from '../screens/WebsiteScreen';

const Tab = createBottomTabNavigator();
const BrewStack = createNativeStackNavigator();
const RecipesStack = createNativeStackNavigator();
const BeansStack = createNativeStackNavigator();
const QuizStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();
const WebsiteStack = createNativeStackNavigator();

function BrewNavigator() {
  const { theme } = useTheme();
  return (
    <BrewStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.textPrimary,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <BrewStack.Screen name="BrewHome" component={BrewScreen} options={{ title: 'Brew' }} />
      <BrewStack.Screen name="RecipeSelect" component={RecipeSelectScreen} options={{ title: 'Choose Recipe' }} />
      <BrewStack.Screen name="BrewSetup" component={BrewSetupScreen} options={{ title: 'Setup' }} />
      <BrewStack.Screen name="BrewSession" component={BrewSessionScreen} options={{ title: 'Brewing', headerBackVisible: false }} />
      <BrewStack.Screen name="BrewComplete" component={BrewCompleteScreen} options={{ title: 'Complete', headerBackVisible: false }} />
    </BrewStack.Navigator>
  );
}

function RecipesNavigator() {
  const { theme } = useTheme();
  return (
    <RecipesStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.textPrimary,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <RecipesStack.Screen name="RecipesList" component={RecipesScreen} options={{ title: 'Recipes' }} />
      <RecipesStack.Screen name="RecipeDetail" component={RecipeDetailScreen} options={{ title: 'Recipe' }} />
    </RecipesStack.Navigator>
  );
}

function BeansNavigator() {
  const { theme } = useTheme();
  return (
    <BeansStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.textPrimary,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <BeansStack.Screen name="BeansList" component={BeansScreen} options={{ title: 'Beans' }} />
      <BeansStack.Screen name="BeanDetail" component={BeanDetailScreen} options={{ title: 'Bean' }} />
    </BeansStack.Navigator>
  );
}

function QuizNavigator() {
  const { theme } = useTheme();
  return (
    <QuizStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.textPrimary,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <QuizStack.Screen name="QuizHome" component={QuizScreen} options={{ title: 'Preferences' }} />
    </QuizStack.Navigator>
  );
}

function SettingsNavigator() {
  const { theme } = useTheme();
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.textPrimary,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <SettingsStack.Screen name="SettingsHome" component={SettingsScreen} options={{ title: 'Settings' }} />
    </SettingsStack.Navigator>
  );
}

function WebsiteNavigator() {
  const { theme } = useTheme();
  return (
    <WebsiteStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.textPrimary,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <WebsiteStack.Screen name="WebsiteHome" component={WebsiteScreen} options={{ title: 'Website' }} />
    </WebsiteStack.Navigator>
  );
}

const TAB_ICONS = {
  BrewTab: { focused: 'cafe', unfocused: 'cafe-outline' },
  RecipesTab: { focused: 'book', unfocused: 'book-outline' },
  BeansTab: { focused: 'leaf', unfocused: 'leaf-outline' },
  QuizTab: { focused: 'sparkles', unfocused: 'sparkles-outline' },
  SettingsTab: { focused: 'settings', unfocused: 'settings-outline' },
  WebsiteTab: { focused: 'globe', unfocused: 'globe-outline' },
};

export function AppNavigator() {
  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            const icons = TAB_ICONS[route.name];
            const iconName = focused ? icons.focused : icons.unfocused;
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.tabActive,
          tabBarInactiveTintColor: theme.tabInactive,
          tabBarStyle: {
            backgroundColor: theme.tabBar,
            borderTopColor: theme.tabBarBorder,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        })}
      >
        <Tab.Screen name="BrewTab" component={BrewNavigator} options={{ title: 'Brew' }} />
        <Tab.Screen name="RecipesTab" component={RecipesNavigator} options={{ title: 'Recipes' }} />
        <Tab.Screen name="BeansTab" component={BeansNavigator} options={{ title: 'Beans' }} />
        <Tab.Screen name="QuizTab" component={QuizNavigator} options={{ title: 'Quiz' }} />
        <Tab.Screen name="WebsiteTab" component={WebsiteNavigator} options={{ title: 'Website' }} />
        <Tab.Screen name="SettingsTab" component={SettingsNavigator} options={{ title: 'Settings' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
