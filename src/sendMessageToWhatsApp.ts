import request_promise from 'request-promise'
const { post } = request_promise
const sendMessageToWhatsApp = (message: string) => {
    post({
        uri: 'https://api.zenvia.com/v2/channels/whatsapp/messages',
        headers: {
            'IJ0VvASFK5LKtyTSVO6yEZc8HQKWYav7iMVP': '',
        },
        body: {
            from: 'luxurious-microwave',
            to: '5579998786100',
            contents: [
                {
                    type: 'text',
                    text: message,
                },
            ],
        },
        json: true,
    })
        .then((response) => {
            console.log('Response:', response)
        })
        .catch((error) => {
            console.log('Error:', error)
        })
}

export default sendMessageToWhatsApp