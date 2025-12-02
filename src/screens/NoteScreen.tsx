import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import AddButton from '../components/addFolderButton';
import { AntDesign } from '@expo/vector-icons';

type Note = {
  title: string;
  content: string;
};

type NotesScreenProps = {
  route: { 
    params?: {
       folderName: string;
        folderIndex: number;
        notes: Note[];
        updateNotes: (newNotes: Note[]) => void;//update note function that takes in a note and returns void
      }
     };
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
};


export default function NotesScreen({ route, navigation }: NotesScreenProps) {
  const folderName = route.params?.folderName ?? 'Notes';//will deault the name to Notes if no input
  const [notes, setNotes] = useState<Note[]>(route.params?.notes ?? []);
  const updateNotes = route.params?.updateNotes ?? (() => {});
  const [modalVisible, setModalVisible] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');


  const openNote = (index: number, note: Note) => {
  navigation.navigate('NoteEditor', {//goes to note
    note: note,
    index,
    onSave: (newNote: Note) => {
      const updatedNotes = [...notes];
      updatedNotes[index] = newNote;
      setNotes(updatedNotes);  
      updateNotes(updatedNotes);
    },
  });
};

const createNote = () => {
  if (noteTitle.trim() === '') return;
  const newNote: Note = { title: noteTitle, content: '' };//actually creates a notea
  navigation.navigate('NoteEditor', {
    note: newNote,
    index: notes.length,
    onSave: (savedNote: Note) => {
      const updatedNotes = [...notes, savedNote];//makes the new notes arry with old content + this note
      setNotes(updatedNotes); 
      updateNotes(updatedNotes);
    },
  });
  setNoteTitle('');//closes modal
  setModalVisible(false);
};

const deleteNote = (indexToDelete: number) => {
  const updatedNotes = notes.filter((_, index) => index !== indexToDelete);//removes the note
  setNotes(updatedNotes);  
  updateNotes(updatedNotes);  
};

  return (
    <View style={styles.container}>

      {/* Notes List */}
      <View style={styles.body}>
        <FlatList
          data={notes}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
  <View style={styles.noteItem}>
    <TouchableOpacity
      style={styles.noteContent}
      onPress={() => openNote(index, item)}
    >
      <Text style={styles.noteText}>{item.title || 'Untitled'}</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => deleteNote(index)}>
      <AntDesign name="delete" size={20} color="red" />
    </TouchableOpacity>
  </View>
)}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              No notes yet
            </Text>
          }
        />
      </View>

      {/* Add Note Button */}
      <AddButton onPress={() => setModalVisible(true)} />
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Note</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Note Title"
              value={noteTitle}
              onChangeText={setNoteTitle}
            />
            <TouchableOpacity style={styles.modalButton} onPress={createNote}>
              <Text style={styles.modalButtonText}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#aaa', marginTop: 10 }]} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    backgroundColor: 'yellow',
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
  },

  headerText: { 
    fontSize: 28,
    fontWeight: 'bold' 
  },

  body: { flex: 1, backgroundColor: '#f8f8f8', padding: 20 },
  noteItem: {
  padding: 15,
  backgroundColor: '#fff',
  borderRadius: 8,
  marginBottom: 10,
  elevation: 2,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},
noteContent: {
  flex: 1,
},
  noteText: { fontSize: 18 },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 8, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalInput: { borderWidth: 1, borderColor: '#aaa', padding: 10, borderRadius: 5, marginBottom: 10 },
  modalButton: { backgroundColor: '#ff9900', padding: 12, borderRadius: 5, alignItems: 'center' },
  modalButtonText: { color: 'white', fontWeight: 'bold' },
});
