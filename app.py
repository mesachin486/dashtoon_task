from flask import Flask, render_template, request, jsonify,  session, redirect, url_for
import requests
import base64
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)
API_URL = "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud"
headers = {
	"Accept": "image/png",
	"Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
	"Content-Type": "application/json"
}




@app.route('/')
def index():
    return render_template('index.html')

@app.route('/show_comic', methods=['GET'])
def show_comic():
    if 'images' not in session:
        return redirect(url_for('index'))
    
    images = session['images']
    session.pop('images', None)  # Clear the images from the 



@app.route('/generate_comic', methods=['POST'])
def generate_comic():
    texts = request.form.getlist('texts[]')
    images = []

    for text in texts:
        try:
            # response = requests.post("https://clipdrop-api.co/text-to-image/v1", files={None, text, 'text/plain' }, headers={"Authorization": f"Bearer {'3b53f17f6f6d452c556f4c02eecb2351e7218003f9d3ad7c411bbcc62b5e93094d89e5e32a624069a528c86afd5963ee'}"})
            response = requests.post(API_URL, headers=headers, json={"inputs": text,})

            if response.ok:
                encoded_img = base64.b64encode(response.content).decode('utf-8')
                img_data_url = f"data:image/jpeg;base64,{encoded_img}"
                images.append(img_data_url)
                # session['images'] = images  # Store the images in session
                # return redirect(url_for('show_comic'))    

            else:
                images.append(f"Error: Unable to process panel. Status code {response.status_code}")
                
            # session['images'] = images  # Store the images in session
            # return redirect(url_for('show_comic'))
        
        except requests.exceptions.RequestException as e:
            images.append(f"Error: {e}")

    return jsonify(images)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)


