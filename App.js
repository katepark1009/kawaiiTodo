import React from 'react';
import { StyleSheet, Text, StatusBar, View, TextInput, Dimensions, Platform, ScrollView } from 'react-native';
import ToDo from './todo';
import { AppLoading } from "expo";
const { height, width } = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newToDo : '',
    loadedToDos: false
  }
  render() {
    const { newToDo, loadedToDos } = this.state;
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
          />
          <ScrollView contentContainerStyle={styles.toDos}> 
            <ToDo text={"Hi sdkjfhalskjdflka"}/>
          </ScrollView>
        </View>
      </View>
    );
  }
  _controlNewToDo = text => {
    this.setState({
      newToDo: text
    })
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
