import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

type Note = {
  title: string;
  content: string;
};

export default function NoteEditorScreen({ route, navigation }: any) {
  const note = route.params?.note ?? { title: '', content: '' };
  const onSave = route.params?.onSave;

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const richText = useRef(null);//new for the ricktext

  useEffect(() => {
    return () => {
      // Save when leaving the screen
      if (onSave && (title.trim() !== '' || content.trim() !== '')) {
        onSave({ title, content });
      }
    };
  }, [title, content, onSave]);

  return (
  <KeyboardAvoidingView 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}
  >
    <TextInput
      style={styles.titleInput}
      value={title}
      onChangeText={setTitle}
      placeholder="Title"
      autoFocus
    />
    
    <RichToolbar
      editor={richText}
      actions={[
        actions.setBold,
        actions.setItalic,
        actions.setUnderline,
        actions.setStrikethrough,
        actions.heading1,
        actions.insertBulletsList,
        actions.insertOrderedList,
        actions.checkboxList,
        actions.undo,
        actions.redo,
      ]}
      style={styles.toolbar}
    />
    
    <RichEditor
      ref={richText}
      initialContentHTML={content}
      onChange={setContent}
      placeholder="Write your note here..."
      style={styles.richEditor}
    />
  </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  titleInput: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  toolbar: {
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  richEditor: {
    flex: 1,
    padding: 20,
  },
});