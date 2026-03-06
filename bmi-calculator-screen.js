import React, { Component } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet
} from "react-native";

class BMI extends Component {

    constructor(props){
        super(props);
        this.state = {weight: '0', height: '0', bmi: 0};
        this.compute = this.compute.bind(this);
    }

    compute(){
        console.log("On pressed");
        let weight = parseFloat(this.state.weight);
        let height = parseFloat(this.state.height);
        this.setState({bmi: weight / Math.pow(height/100, 2)});
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.group}>
                    <Text style={styles.title}>Weight (KG)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={this.state.weight}
                        onChangeText={(text) => this.setState({weight: text})}
                    />
                </View>
                <View style={styles.group}>
                    <Text style={styles.title}>Height (CM)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={this.state.height}
                        onChangeText={(text) => this.setState({height: text})}
                    />
                </View>
                <View style={styles.center}>
                    <View style={styles.group}>
                        <Text style={styles.title}>BMI: {this.state.bmi.toFixed(2)}</Text>
                    </View>
                    <View style={styles.group}>
                        <TouchableOpacity onPress={this.compute} style={styles.button}>
                            <Text style={styles.buttonText}>Compute</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
     container: {
         flex: 1,
         justifyContent: 'center',
         flexDirection: 'column',
         padding: 20
     },
     group: {
         marginTop: 20
     },
     button: {
         backgroundColor: 'lightblue',
         padding: 20,
         borderWidth: 1
     },
     buttonText: {
         fontSize: 30
     },
     input: {
         padding: 10,
         borderWidth: 1
     },
     title: {
         fontSize: 20
     },
     center: {
         alignItems: 'center'
     },
     result: {
         fontSize: 24
     }
 });
 
 export default BMI;

