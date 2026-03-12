import React, {Component} from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableHighlight,
    StyleSheet
} from "react-native";
import formatTime from "minutes-seconds-milliseconds";

class Stopwatch extends Component {
    constructor(props){
        super(props);
        this.state = {
            timeElapsed: null,
            running: false,
            startTime: null,
            laps: [],
        };
        this.handleStartPress = this.handleStartPress.bind(this);
        this.startStopButton = this.startStopButton.bind(this);
        this.handleLapPress = this.handleLapPress.bind(this);
    }

    laps(){
        return this.state.laps.map((time, index) => {
            return <View key={index} style={styles.lap}>
                <Text style={styles.lapText}>Lap #{index + 1}</Text>
                <Text style={styles.lapTime}>{formatTime(time)}</Text>
            </View>
        });
    }

    startStopButton(){
        var style = this.state.running ? styles.stopButton : styles.startButton;

        return <TouchableHighlight underlayColor={"gray"} onPress={this.handleStartPress} style={[styles.button, style]}>
            <Text>{this.state.running ? "Stop" : "Start"}</Text>
        </TouchableHighlight>
    }
    
    lapButton(){
        return <TouchableHighlight underlayColor={"gray"} onPress={this.handleLapPress} style={styles.button}>
            <Text>Lap</Text>
        </TouchableHighlight>
    }

    handleLapPress(){
        var lap = this.state.timeElapsed;

        this.setState({
            startTime: new Date(),
            laps: this.state.laps.concat([lap]),
        });
    }

    handleStartPress(){
        if(this.state.running){
            clearInterval(this.interval);
            this.setState({running: false});
            return;
        }

        this.setState({startTime: new Date()});

        this.interval = setInterval(() => {
            this.setState({
                timeElapsed: new Date() - this.state.startTime,
                running: true,
            });
        }, 30);
    }

    render(){
        return <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.timerWrapper}>
                    <Text style={styles.timer}>
                        {formatTime(this.state.timeElapsed)}
                    </Text>
                </View>
                <View style={styles.buttonWrapper}>
                    {this.lapButton()}
                    {this.startStopButton()}
                </View>
            </View>
            <ScrollView style={styles.footer}>
                {this.laps()}
            </ScrollView>
        </View>
    };

    componentWillUnmount(){
        if(this.interval){
            clearInterval(this.interval);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        margin: 20,
    },
    header: {
        flex: 1,
    },
    footer: {
        flex: 1,
    },
    timerWrapper: {
        flex: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timer: {
        fontSize: 60,
        fontWeight: '100',
    },
    buttonWrapper: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    button: {
        borderWidth: 2,
        height: 100,
        width: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    startButton: {
        borderColor: 'green',
    },
    stopButton: {
        borderColor: 'red',
    },
    lap: {
        justifyContent: 'space-around',
        flexDirection: 'row',
        backgroundColor: 'lightgray',
        padding: 10,
        marginTop: 10,
    },
    lapText: {
        fontSize: 30,
    },
    lapTime: {
        fontSize: 20,
    },
});

export default Stopwatch;
