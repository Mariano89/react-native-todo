/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  Button,
  NavigatorIOS,
  View
} from "react-native";
import { StackNavigator } from "react-navigation";
import Auth0 from "react-native-auth0";

const auth0 = new Auth0({
  domain: "mariano89.auth0.com",
  clientId: "V0gcX0da8slfjcbQeF4a4hSoYgzaRryA"
});

const width = "90%";

export default class yingTodo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      tasks: [],
      currentTask: "",
      selectTask: ""
    };
  }

  _pushTask() {
    console.log("you entered ", this.state.currentTask);
    this.setState(
      {
        tasks: [...this.state.tasks, this.state.currentTask],
        currentTask: ""
      },
      () => {
        console.log(this.state.tasks);
        // assure task gets emptied
        console.log("current task is now blank", this.state.currentTask);
      }
    );
  }

  _removeTask(task, key) {
    let arr = this.state.tasks;
    arr.splice(key, 1);
    this.setState({ tasks: arr }, () => {
      console.log("you deleted task: ", task);
    });
  }

  _onLogin(props) {
    auth0.webAuth
      .authorize({
        scope: "openid email",
        audience: "https://mariano89.auth0.com/userinfo"
      })
      .then(credentials => {
        this.setState({
          loggedIn: true
        });
        console.log(credentials);
      })
      // Successfully authenticated
      // Store the accessToken
      .catch(error => console.log(error));
  }

  render() {
    if (this.state.loggedIn) {
      return (
        <View style={styles.container}>
          <Text style={{ marginTop: 20, textAlign: "center", fontSize: 20 }}>
            Create a Task
          </Text>
          <TextInput
            style={styles.taskInput}
            placeholder="What do you have to do?"
            onChangeText={currentTask => this.setState({ currentTask })}
            value={this.state.currentTask}
          />
          <View style={styles.buttonContainer}>
            <Button onPress={this._pushTask.bind(this)} title="Add Task" />
          </View>
          <View style={styles.taskContainer}>
            {this.state.tasks.map((task, key) => {
              return (
                <View style={styles.taskText} key={key}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <Text>
                      {task}
                    </Text>
                    <Button
                      onPress={() => {
                        this._removeTask(
                          task,
                          key
                        ), (this._removeTask = this._removeTask.bind(this));
                      }}
                      title="X"
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Button onPress={this._onLogin.bind(this)} title="Log In" />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  taskInput: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderBottomWidth: 1,
    borderColor: "black"
  },
  buttonContainer: {
    backgroundColor: "black",
    padding: 3,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 5
  },
  taskContainer: {
    flex: 1,
    width
  },
  taskText: {
    justifyContent: "center",
    height: 50,
    borderBottomWidth: 1,
    borderColor: "black"
  }
});

AppRegistry.registerComponent("yingTodo", () => yingTodo);
