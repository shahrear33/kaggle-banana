export async function sendSMS(phoneNumber, message) {
    const api_key = 'huCqtTC4s44wPSkNKI0b'
    const url = ` http://bulksmsbd.net/api/smsapi?api_key=${api_key}&type=text&number=${phoneNumber}&senderid=8809617613117&message=${message}`
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      return data
    } catch (error) {
      console.error('Error sending SMS:', error);
      return 'Error sending SMS'
    }
};


export function emailSend(receiver_email, name, message, templateId) {
    let data = {
        service_id: process.env.NEXT_PUBLIC_SERVICE_ID,
        template_id: templateId,
        user_id: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
        template_params: {
            'receiver_email': receiver_email,
            'to_name': name,
            'message' : message
        }
    };

    fetch(`https://api.emailjs.com.0/email/send`, {
        method: 'POST',
        headers : { 'Content-Type': 'application/json' },
        body : JSON.stringify(data)
      }).then(res => console.log(res))
  }