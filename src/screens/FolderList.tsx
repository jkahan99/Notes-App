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
};
type Note = {
  title: string;//how is title different then name?
  content: string;
};

//securestorage

export default function FolderList({ navigation }: FolderListScreenProps) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [folderName, setFolderName] = useState<string>('');//tracks what the user types in the modal

  const createFolder = () => {
    if (folderName.trim() === '') return;
    setFolders([...folders, {name: folderName, notes: [] as Note[] }]);
    setFolderName('');
    setModalVisible(false);
  };

  const updateFolderNotes = (folderIndex: number, newNotes: Note[]) => {
  const updatedFolders = [...folders];
  updatedFolders[folderIndex].notes = newNotes;
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
      const defaultFolder: Folder = { name: 'Default Notes', notes: [] };
      setFolders([defaultFolder]);
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
              <TouchableOpacity onPress={() => deleteFolder(index)}>
                <AntDesign name="delete" size={20} color="red" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No folders yet</Text>}
        />
      </View>

      <AddFolderButton onPress={() => setModalVisible(true)} />

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
