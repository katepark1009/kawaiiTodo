import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput } from "react-native";
import PropTypes from 'prop-types';

const { height, width } = Dimensions.get("window");

export default class ToDo extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isEditing: false,
      todoValue: props.text,
    }
  }
  static propTypes = {
    text: PropTypes.string.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    deleteTodo: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    completeTodo: PropTypes.func.isRequired,
    uncompleteTodo: PropTypes.func.isRequired,
    updateTodo: PropTypes.func.isRequired
  }

  render(){
    const { isEditing, todoValue } = this.state;
    const { text, id, deleteTodo, isCompleted } = this.props;
    return (  
      <View style={styles.container}>
        <View style={styles.column}>
         <TouchableOpacity onPress={this._toggleComplete}>
          <View 
            style={[
              styles.circle, 
              isCompleted? styles.completedCircle : styles.uncompletedCircle
            ]} 
          />
        </TouchableOpacity>
        {isEditing? (
          <TextInput 
            style={[styles.input, styles.text, isCompleted? styles.completedText : styles.uncompletedText]} 
            value={todoValue} 
            multiline={true}
            onChangeText={this._controllInput}
            returnKeyType={"done"}
            onBlur={this._finishEditing}
            underlineColorAndroid={"transparent"}
          />
        ) : ( 
          <Text 
            style={[
            styles.text, 
            isCompleted? styles.completedText : styles.uncompletedText
            ]}
          >
            {text}
          </Text>
        )
        }
      </View>
        {isEditing? (
          <View style={styles.actions}>
            <TouchableOpacity onPressOut={this._finishEditing}>
              <View style={styles.actionsContainer}>
                <Text style={styles.actionsText}>✅</Text>
              </View>
            </TouchableOpacity> 
          </View>
        ) : (
          <View style={styles.actions}>
            <TouchableOpacity onPressOut={this._startEditing}>
            <View style={styles.actionsContainer}>
              <Text style={styles.actionsText}>✏️</Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPressOut={(e) => {e.stopPropagation(); deleteTodo(id)}}>
              <View style={styles.actionsContainer}>
                <Text style={styles.actionsText}>❌</Text>
              </View>
            </TouchableOpacity>
          </View>
          )
        }
      </View>
    )
  }
  _toggleComplete = (event) => {
    event.stopPropagation();
    const { isCompleted, completeTodo, uncompleteTodo, id } = this.props;
    if( isCompleted ){
      uncompleteTodo(id);
    }else{
      completeTodo(id);
    }
  }
  _startEditing = (event) => {
    event.stopPropagation();
    this.setState({
      isEditing: true
    })
  }
  _finishEditing = (event) => {
    event.stopPropagation();
    const { todoValue } = this.state;
    const { id, updateTodo } = this.props;
    updateTodo(id, todoValue);
    this.setState({
      isEditing: false
    })
  }
  _controllInput = (text) => {
    this.setState({
      todoValue: text
    })
  }
}

const styles = StyleSheet.create({
  container: {
    width: width -50,
    borderBottomColor: "#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  text: {
    fontSize: 20,
    marginVertical: 20,
    fontWeight: "600"
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    marginRight: 20
  }, 
  completedCircle: {
    borderColor: "#bbb",
  },
  uncompletedCircle: {
    borderColor: "#f23657",
  },
  completedText: {
    color: "#bbb",
    textDecorationLine: "line-through"
  },
  uncompletedText: {
    color: "#353535"
  },
  column: {
    flexDirection: "row",
    alignItems: "center",
    width: width / 2
  },
  actions: {
    flexDirection: "row",
  },
  actionsContainer : { //손가락 두껍기때문에 마진 줌 ㅋㅋ
    marginVertical: 10,
    marginHorizontal: 10
  }, 
  input: {
    marginVertical: 10,
    width: width / 2
  }
})