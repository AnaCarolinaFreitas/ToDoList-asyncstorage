import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, FlatList, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from 'expo-font';

const STORAGE_KEY = "@tasks"; // chave única e consistente para armazenar as tarefas

export default function App() {
  const [task, setTask] = useState("");
  const [savedTask, setSavedTask] = useState([]); // array de objetos {id, value}

  useEffect(() => {
    async function loadTasks() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setSavedTask(parsed);
          }
        }
      } catch (e) {
        console.error("Erro ao carregar tarefas:", e);
      }
    }
    loadTasks();
  }, []);

  const saveTask = async () => {
    if (!task.trim()) {
      alert("Por favor, insira uma tarefa.");
      return;
    }
    try {
      const newTasks = [...savedTask, { id: Date.now().toString(), value: task.trim() }];
      setSavedTask(newTasks);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
      setTask("");
    } catch (e) {
      console.error("Erro ao salvar tarefa:", e);
      alert("Erro ao salvar a tarefa.");
    }
  };

  const deleteAllTasks = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setSavedTask([]);
    } catch (e) {
      console.error("Erro ao remover todas as tarefas:", e);
      alert("Erro ao remover todas as tarefas.");
    }
  };

  const deleteTask = async (id) => {
    try {
      const newTasks = savedTask.filter((item) => item.id !== id);
      setSavedTask(newTasks);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
    } catch (e) {
      console.error("Erro ao remover tarefa:", e);
      alert("Erro ao remover a tarefa.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Text style={styles.titulo}>MANAGE YOUR TASKS</Text>

      <TextInput
        style={styles.input}
        placeholder="Qual a tarefa?..."
        value={task}
        onChangeText={setTask}
      />
      <View style={styles.buttonsdiv}>
          <Button color="#6a5acd" title="Salvar Tarefa" onPress={saveTask} />
       
          <Button color="#6f22b2ff" title="Remover Todas as Tarefas" onPress={deleteAllTasks} />
        
      </View>

      <FlatList
        data={savedTask}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskText}>{item.value}</Text>
            <View style={{ borderRadius: 50, overflow: 'hidden' }}>
              <Button color="#6f22b2ff" title="Remover" onPress={() => deleteTask(item.id)} />
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ marginTop: 20 }}>Nenhuma tarefa.</Text>}
        contentContainerStyle={savedTask.length === 0 && { flexGrow: 1, justifyContent: 'center' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffffff",
  },
  titulo: {
    fontSize: 37,
    fontStyle: "italic",
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 40,
    flexWrap: "wrap",
  },
  input: {
    borderWidth: 1,
    borderColor: "#8b03cfff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  taskContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#e0c7fdff",
    borderRadius: 15,
    marginBottom: 10,
    marginTop: 10,
  },
  taskText: {
    fontSize: 18,
  },
  button: {
    borderRadius: 50,
  },
  buttonsdiv:{
    flexDirection: "row",
    justifyContent: "space-between",
  },
 
});
