import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet } from 'react-native';
import AddFolderButton from '../components/addFolderButton';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';

type FolderListScreenProps = {
  navigation: any;
};
type Folder = {
  name: string;
  notes: Note[];
  lastModified: number;

};
type Note = {
  title: string;//how is title different then name?
  content: string;
  lastModified: number;
};

//securestorage

export default function FolderList({ navigation }: FolderListScreenProps) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [folderName, setFolderName] = useState<string>('');//tracks what the user types in the modal

  const createFolder = () => {
  if (folderName.trim() === '') return;
  setFolders([...folders, {
    name: folderName, 
    notes: [] as Note[],
    lastModified: Date.now()
  }]);
  setFolderName('');//might need to be deketed
  setModalVisible(false);
}; // ADD THIS CLOSING BRACE


  const openDefaultFolder = () => {
      if (folders.length === 0) {
    // No folders exist, create default folder
    const defaultFolder: Folder = {
      name: 'Notes',
      notes: [],
      lastModified: Date.now()
    };
    
    const newNote: Note = {
      title: '',
      content: '',
      lastModified: Date.now()
    };
    
    defaultFolder.notes = [newNote];
    setFolders([defaultFolder]);
    
    // Navigate to it
    navigation.navigate('Notes', {
      folderName: defaultFolder.name,
      folderIndex: 0,
      notes: defaultFolder.notes,
      updateNotes: (newNotes: Note[]) => updateFolderNotes(0, newNotes),
      autoOpenLastNote: true,
    });
    return;}
    
        const defaultFolderIndex = 0;
        const defaultFolder = folders[defaultFolderIndex];
        
        // Create a new empty note
        const newNote: Note = {
          title: '',
          content: '',
          lastModified: Date.now()
        };
        
        // Add it to the folder
        const updatedNotes = [...defaultFolder.notes, newNote];
        updateFolderNotes(defaultFolderIndex, updatedNotes);
        
        // Navigate to the Notes screen with the updated notes
        navigation.navigate('Notes', {
          folderName: defaultFolder.name,
          folderIndex: defaultFolderIndex,
          notes: updatedNotes,
          updateNotes: (newNotes: Note[]) => updateFolderNotes(defaultFolderIndex, newNotes),
          autoOpenLastNote: true, // Signal to open the note we just created
        });
      };

        const updateFolderNotes = (folderIndex: number, newNotes: Note[]) => {
        const updatedFolders = [...folders];
          updatedFolders[folderIndex].notes = newNotes; // ADD THIS LINE - actually update the notes!
        updatedFolders[folderIndex].lastModified = Date.now(); // Update folder timestamp
        setFolders(updatedFolders);
};

const deleteFolder = (indexToDelete: number) => {
  const updatedFolders = folders.filter((_, index) => index !== indexToDelete);
  setFolders(updatedFolders);
};


const loadFolders = async () => {
  try {
    const savedFolders = await AsyncStorage.getItem('folders');
    if (savedFolders !== null) {
      setFolders(JSON.parse(savedFolders));
    }
    else {
      // No folders exist, create default "Notes" folder
const defaultFolder: Folder = { 
  name: 'Default Notes', 
  notes: [],
  lastModified: Date.now()
};      setFolders([defaultFolder]);
    }
  } catch (error) {
    console.error('Failed to load folders:', error);
  }
};

const saveFolders = async () => {
  try {
    await AsyncStorage.setItem('folders', JSON.stringify(folders));
  } catch (error) {
    console.error('Failed to save folders:', error);
  }
};

useEffect(() => {
  loadFolders();
}, []);

useEffect(() => {
    saveFolders();
}, [folders]);



  return (
    <View style={styles.container}>
      

      <View style={styles.body}>
        <FlatList
          data={folders}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.folderItem}>
              <TouchableOpacity 
                style={styles.folderContent}
                onPress={() => navigation.navigate('Notes', {
                  folderName: item.name,
                  folderIndex: index,
                  notes: item.notes,
                  updateNotes: (newNotes: Note[]) => updateFolderNotes(index, newNotes),
                })}
              >
                <Text style={styles.folderText}>{item.name}</Text>
              </TouchableOpacity>
              {index !== 0 && (
  <TouchableOpacity onPress={() => deleteFolder(index)}>
    <AntDesign name="delete" size={20} color="red" />
  </TouchableOpacity>
)}
            </View>
          )}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No folders yet</Text>}
        />
      </View>

              <View style={styles.buttonRow}>
  <TouchableOpacity 
    style={[styles.bottomButton, { backgroundColor: '#22cf4aa2' }]} 
    onPress={openDefaultFolder}
  >
    <Text style={styles.buttonText}>+ Note</Text>
  </TouchableOpacity>
  
  <TouchableOpacity 
    style={styles.bottomButton} 
    onPress={() => setModalVisible(true)}
  >
    <Text style={styles.buttonText}>+ Folder</Text>
  </TouchableOpacity>
</View>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}> 
        <View style={styles.modalOverlay}> 
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Folder</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Folder Name"
              value={folderName}
              onChangeText={setFolderName}
            />
            <TouchableOpacity style={styles.modalButton} onPress={createFolder}>
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
  header: { backgroundColor: 'yellow', paddingTop: 50, paddingBottom: 20, alignItems: 'center' },
  headerText: { fontSize: 28, fontWeight: 'bold' },
  body: { flex: 1, backgroundColor: '#f8f8f8', padding: 20 },
  folderItem: { 
    padding: 15, 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    marginBottom: 10, 
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonRow: {
  position: 'absolute',
  bottom: 20,
  right: 20,
  flexDirection: 'row',
  gap: 10,
},
bottomButton: {
  backgroundColor: '#ff9900',
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 25,
  elevation: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
},
buttonText: {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 14,
},

  folderContent: {
    flex: 1,
  },
  folderText: { fontSize: 18 },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 8, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalInput: { borderWidth: 1, borderColor: '#aaa', padding: 10, borderRadius: 5, marginBottom: 10 },
  modalButton: { backgroundColor: '#ff9900', padding: 12, borderRadius: 5, alignItems: 'center' },
  modalButtonText: { color: 'white', fontWeight: 'bold' },
});
