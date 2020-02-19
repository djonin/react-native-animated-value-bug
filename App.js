import React from 'react';
import { Animated, Button, ScrollView, StyleSheet, Text, View } from 'react-native';

const containerWidth = 200
const boxSize = 50

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.x = new Animated.Value(0)
    this.state = {
      boxVisible: true,
      logs: []
    }
  }

  render() {
    const { boxVisible } = this.state
    const toggleText = boxVisible ? 'Hide' : 'Show'
    return (
      <View style={styles.container}>
        {this.renderBox()}
        <View style={styles.buttonsContainer}>
          <Button style={styles.button} title="<-" onPress={this.moveTo(0)} disabled={!boxVisible}/>
          <Button style={styles.button} title={toggleText} onPress={this.toggleVisibility}/>
          <Button style={styles.button} title="->" onPress={this.moveTo(containerWidth - boxSize)} disabled={!boxVisible}/>
        </View>
        {this.renderFix(false)}
        <Text style={styles.instructions}>
          Instructions: Click arrow buttons to move the box. Then hide the box and reveal it again.
          After that the box position will reset to initial position.
        </Text>
        <ScrollView style={styles.logs}>
          {this.state.logs.map(log => {
            return <Text key={log.id}>{log.text}</Text>
          })}
        </ScrollView>
      </View>
    );
  }

  // call this with true and the bug gets "fixed"
  renderFix = (fixIt) => {
    if (fixIt) {
      return <Animated.View style={{ transform: [{ translateX: this.x }] }}/>
    }
  }

  renderBox = () => {
    if (this.state.boxVisible) {
      const horizontalLocation = { transform: [{ translateX: this.x }] }
      return (
        <View style={styles.boxContainer}>
          <Animated.View style={[styles.box, horizontalLocation]}/>
        </View>
      )
    } else {
      return (
        <View style={styles.boxContainer}>
          <Text>The box view is not being rendered</Text>
        </View>
      )
    }
  }

  moveTo = x => {
    return () => {
      this.log(`Animate to ${x}`)
      Animated.timing(this.x, {
        toValue: x,
        duration: 1000,
        useNativeDriver: true
      }).start(({ finished }) => {
        this.log(`Animation finished (${finished}), x is now ${this.x._value}`)
      })
    }
  }

  toggleVisibility = () => {
    const { boxVisible } = this.state
    this.setState({ boxVisible: !boxVisible })
    const log = `${boxVisible ? 'Hide box' : 'Show box'}, x is now ${this.x._value}`
    this.log(log)
  }

  log = text => {
    const logs = [...this.state.logs]
    logs.unshift({ id: logs.length, text })
    this.setState({ logs })
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 30,
  },
  boxContainer: {
    backgroundColor: 'yellow',
    height: boxSize,
    width: containerWidth,
  },
  box: {
    width: boxSize,
    height: boxSize,
    backgroundColor: 'orange',
  },
  buttonsContainer: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: containerWidth,
  },
  button: {
    width: 80,
  },
  instructions: {
    color: 'black',
    fontSize: 10,
    marginVertical: 20,
  },
  log: {
    color: 'gray',
  },
});
