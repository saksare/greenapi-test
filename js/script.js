async function callAPI(endpoint, method, body) {
    const idInstance = document.getElementById('idInstance').value.trim();
    const apiToken = document.getElementById('apiToken').value.trim();
    const output = document.getElementById('responseOutput');

    if (!idInstance || !apiToken) {
        output.value = 'Error: Please enter both idInstance and ApiTokenInstance';
        return;
    }

    const url = 'https://api.green-api.com/waInstance' + idInstance + '/' + endpoint + '/' + apiToken;

    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    output.value = 'Sending request to: ' + endpoint + '...\n\n';

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        output.value = 'Status: ' + response.status + ' ' + response.statusText + '\n';
        output.value = output.value + 'Endpoint: ' + endpoint + '\n';
        output.value = output.value + '----------------------------------------\n\n';
        output.value = output.value + JSON.stringify(data, null, 2);

        return data;
    } catch (error) {
        output.value = 'Error: ' + error.message + '\n\nPlease check:\n- Your internet connection\n- idInstance and ApiTokenInstance are correct\n- Instance is active (QR code scanned)';
        console.error('API Error:', error);
    }
}

function formatPhoneNumber(phone) {
    // Remove all non-numeric characters except + (keep + for country code detection)
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');
    
    // If number starts with +, remove it
    if (cleaned.startsWith('+')) {
        cleaned = cleaned.substring(1);
    }
    
    // If number starts with 00, remove it (international format alternative)
    if (cleaned.startsWith('00')) {
        cleaned = cleaned.substring(2);
    }
    
    // Remove any remaining non-numeric characters
    cleaned = cleaned.replace(/[^0-9]/g, '');
    
    // Add @c.us
    return cleaned + '@c.us';
}

function callGetSettings() {
    callAPI('getSettings', 'GET', null);
}

function callGetStateInstance() {
    callAPI('getStateInstance', 'GET', null);
}

function callSendMessage() {
    const phone = document.getElementById('msgPhone').value.trim();
    const message = document.getElementById('msgText').value.trim();

    if (!phone) {
        document.getElementById('responseOutput').value = 'Error: Please enter a phone number';
        return;
    }

    if (!message) {
        document.getElementById('responseOutput').value = 'Error: Please enter a message';
        return;
    }

    const formattedChatId = formatPhoneNumber(phone);

    console.log('Original:', phone);
    console.log('Formatted:', formattedChatId);
    console.log('Message:', message);

    const body = {
        chatId: formattedChatId,
        message: message
    };

    callAPI('sendMessage', 'POST', body);
}

function callSendFileByUrl() {
    const phone = document.getElementById('filePhone').value.trim();
    const fileUrl = document.getElementById('fileUrl').value.trim();

    if (!phone) {
        document.getElementById('responseOutput').value = 'Error: Please enter a phone number';
        return;
    }

    if (!fileUrl) {
        document.getElementById('responseOutput').value = 'Error: Please enter a file URL';
        return;
    }

    const formattedChatId = formatPhoneNumber(phone);

    console.log('Original:', phone);
    console.log('Formatted:', formattedChatId);
    console.log('File URL:', fileUrl);

    const body = {
        chatId: formattedChatId,
        urlFile: fileUrl
    };

    callAPI('sendFileByUrl', 'POST', body);
}
