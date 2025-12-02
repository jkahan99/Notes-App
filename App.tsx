import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FolderListScreen from './src/screens/FolderList'; 
import NotesScreen from './src/screens/NoteScreen'; 
import NoteEditorScreen from './src/screens/NoteEditorScreen';

type Note = {
  title: string;
  content: string;
};
export type RootStackParamList = {
  FolderList: undefined;
  Notes: {
    folderName: string 
    folderIndex: number;
    notes: Note[];
    updateNotes: (newNotes: Note[]) => void;
    };
  NoteEditor: { note: Note ; index: number; onSave: (newNote: Note) => void };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
          <Stack.Navigator
  screenOptions={{
    headerStyle: { backgroundColor: 'gold' }, // yellow header
    headerTintColor: 'black',                 // back button color
    headerTitleStyle: { fontSize: 24, fontWeight: 'bold' }, // text style
  }}
>
  <Stack.Screen
    name="FolderList"
    component={FolderListScreen}
    options={{ title: 'Notes' }}
  />
  <Stack.Screen
    name="Notes"
    component={NotesScreen}
    options={({ route }) => ({ title: route.params.folderName })}
  />
  <Stack.Screen
    name="NoteEditor"
    component={NoteEditorScreen}
    options={{ title: 'Edit Note' }}
  />
</Stack.Navigator>
    </NavigationContainer>
  );
}
