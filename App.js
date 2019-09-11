import React from 'react';
import { 
  StyleSheet, 
  Text, 
  StatusBar, 
  View, 
  TextInput, 
  Dimensions, 
  Platform, 
  ScrollView,
  AsyncStorage
} from 'react-native';
import ToDo from './todo';
import { AppLoading } from "expo";
import uuidv1 from "uuid/v1"

const { height, width } = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newToDo : '',
    loadedToDos: false,
    toDos: {}
  }
  componentDidMount = () => {
    this._loadedTodos();
  }
  _loadedTodos = async () => {
    try {
      const toDos = await AsyncStorage.getItem("toDos")
      console.log("mu", toDos)
      this.setState({
        loadedToDos: true,
        toDos: JSON.parse(toDos)
      })
    } catch(err) {
      console.log(err)
    }
  } 
  _addToDo = () => {
    const { newToDo } = this.state;
    if (newToDo !== "") {
      this.setState( prevState => {
        const ID = uuidv1()
        const newToDoObjects = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newToDo,
            createdAt: Date.now()
          }  
        }
        const newState = {
          ...prevState,
          newToDo: "",
          toDos: {
            ...prevState.toDos,
            ...newToDoObjects
          }
        }
        this._saveToDos(newState.toDos);
        return {...newState};
      })
    } 
  }
  _deleteToDo = (id) => {
   this.setState(prevState => {
     const toDos = prevState.toDos;
     console.log('prevtodos', toDos)
     delete toDos[id];
     const newState = {
       ...prevState,
       ...toDos
     }
     this._saveToDos(newState.toDos);
     return {...newState};
   }) 
  }
  _uncompleteTodo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false
          }
        }
      }
      this._saveToDos(newState.toDos);
      return {...newState};
    })
  }
  _completeTodo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: true
          }
        }
      }
      this._saveToDos(newState.toDos);
      return {...newState};
    })
  }
  _updateTodo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id], //! id 빼먹으면 에러남
            text: text
          }
        }
      }
      this._saveToDos(newState.toDos);
      return {...newState};
    })
  }
  _controlNewToDo = text => {
    this.setState({
      newToDo: text
    })
  }
  _saveToDos = (newToDos) => {
    const saveTodos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
  }
  render() {
    const { newToDo, loadedToDos, toDos } = this.state;
    console.log(toDos)
    if(!loadedToDos){
      return <AppLoading />
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Kawaii To Do</Text>
        <View style={styles.card}>
          <TextInput 
            style={styles.input} 
            placeholder={"New To Do"} 
            value={newToDo} 
            onChangeText={this._controlNewToDo} 
            placeholderTextColor={"#999"} 
            returnKeyType={"done"} 
            autoCorrect={false}
            onSubmitEditing={this._addToDo}
          />
          <ScrollView contentContainerStyle={styles.toDos}> 
            {Object.values(toDos)
              .reverse()
              .map( toDo => 
            <ToDo 
              key={toDo.id} 
              deleteTodo={this._deleteToDo} 
              completeTodo={this._completeTodo}
              uncompleteTodo={this._uncompleteTodo}
              updateTodo={this._updateTodo}
              {...toDo} 
            />)}
          </ScrollView>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f23657',
    alignItems: 'center'
  },
  title: {
    color: "white",
    fontSize: 30,
    marginTop: 50,
    fontWeight: "200",
    marginBottom: 30
  }, 
  card: {
    backgroundColor: "white",
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    //! ios : shadowColor,shadowOpacity,shadowRadius 
    //! androis : elevation 다르기때문에 platform 사용
    ...Platform.select({
      ios: {
        shadowColor: "rgb(50,50,50)",
        shadowOpacity: 0.5,
        shadowRadius: 5, 
        shadowOffser: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 3
      }
    })
  },
  input: {
    padding: 20,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    fontSize: 25
  },
  toDos: {
    alignItems: 'center'
  }
});
