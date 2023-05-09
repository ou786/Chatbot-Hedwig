import React, {Component} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {Dialogflow_V2} from 'react-native-dialogflow';

import {dialogflowConfig} from './env';

const BOT = {
    id:2,
    name:'Hedwig',
    
}

class App extends Component {
    state ={
        messages: [{ id:2,text:'Hedwig here!', createdAt: new Date(), user:BOT},
        { id:1,text:'Hi', createdAt: new Date(), user:BOT}],
        id:1,
        name:''
    };

    componentDidMount() {
        Dialogflow_V2.setConfiguration(
            dialogflowConfig.client-email,
            dialogflowConfig.private_key,
            dialogflow_V2.LANG_ENGLISH_US,
            dialogflowConfig.project_id,
        );
    }

    handleGoogleResponse(result) {
        let text = result.queryResult.fulfilmentMessages[0].text[0].text[0];

        this.sendBotResponse(text);
    }

    sendBotResponse(text) {
        let msg= {
            id:this.state.messages.length+1,
            text,
            createdAt: new Date(),
            user:BOT
        }
        this.setState((previousState) => ({
          messages:GiftedChat.append(previousState.messages,[msg]),  
        }))
    }

    onSend(messages =[]) {
        this.setState((previousState) =>({
            messages: GiftedChat.append(previousState.messages,messages)
        }))
        
        let message = messages[0].text;

        Dialogflow_V2.requestQuery(
            message,
            (result) => this.handleGoogleResponse(result),
            (error) =>console.log(error)
        )



    }


    onQuickReply(quickReply){
        this.setState((previousState) =>({
            messages: GiftedChat.append(previousState.messages,quickReply)
        }))
        
        let message = quickReply[0].value;

        Dialogflow_V2.requestQuery(
            message,
            (result) => this.handleGoogleResponse(result),
            (error) =>console.log(error)
        )


    }
    render() {
        return (
            <View style={{flex:1, backgroundColor: '#fff'}}>
                <GiftedChat
                message={this.state.messages}
                onSend={(message) => this.onSend(message)}
                onQuickReply={(quickReply) => this.onQuickReply(quickReply)}
                user={{id:1}}
                />
            </View>
        );
    }
}

export default App;