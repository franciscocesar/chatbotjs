import AssistantV2 from 'ibm-watson/assistant/v2'
import { IamAuthenticator } from 'ibm-watson/auth'
import express from 'express'
import bodyParser from 'body-parser'
import authenticationValues from './authenticationValues'
import sendMessageToWhatsApp from './src/sendMessageToWhatsApp' // Função que envia mensagem ao usuário via WhatsApp (será criada posteriormente)


// Inicializa o express e define uma porta
const app = express()
const port = 3000

// Indica para o express usar o JSON parsing do body-parser
app.use(bodyParser.json())

// Separa os valores de autenticação armazenados no arquivo authenticationValues.ts (substitua seus dados nesse arquivo)
const { apikey, serviceUrl, version, assistantId } = authenticationValues

// Inicializa o assistant e faz a autenticação na API
const assistant = new AssistantV2({
    authenticator: new IamAuthenticator({
        apikey,
    }),
    serviceUrl,
    version,
})

app.post('/hook', (req, res) => {
    // Verifica se a mensagem veio do WhatsApp
    if (req.body.message) { // Se sim:
        const message = req.body.message.contents[0].text // Armazena em uma variável a mensagem

        assistant
            // Inicia a sessão com o assistant
            .createSession({
                assistantId,
            })
            .then((res) => {
                // Manda a mensagem vinda da API da Zenvia para o assistant
                sendMessageToWatson(
                    {
                        message_type: 'text',
                        text: message,
                    },
                    res.result.session_id
                )
            })
            .catch((err) => {
                console.log(err)
            })

        res.status(200).end() // Responde quem solicitou o webhook com status 200
        // Verifica se a mensagem veio do Watson
    } else {
            sendMessageToWhatsApp(req.body.send) // Se for outros casos, mande a resposta do Assistant para o WhatsApp
    }
})
const sendMessageToWatson = (messageInput: AssistantV2.MessageInput, sessionId: string) => {
    assistant
        .message({
            assistantId,
            sessionId,
            input: messageInput,
        })
        .then((res) => {
            processResponse(res.result)
        })
        .catch((err) => {
            console.log(err)
        })
}

// Processa a resposta e exibe ela no console
const processResponse = (response: any) => {
    // Exibe a saída do assistant
    if (response.output.generic) {
        if (response.output.generic.length > 0) {
            if (response.output.generic[0].response_type === 'text') {
                console.log('process')
                console.log(response.output.generic[0].text)
            }
        }
    }
}

app.listen(port, () => console.log(`Running on port ${port}`))