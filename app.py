from io import BytesIO
import numpy as np
import base64

from flask import Flask, request, render_template, make_response
from sklearn.externals import joblib
from skimage import io as skio
from skimage.transform import resize
from utils.digits_classifier import make_mnist
import sys

app = Flask(__name__)

clf = joblib.load('/Users/luke/Documents/lnewman_deploy_v1/digits_cls_sml/clf_2.pkl')
print(sys.getsizeof(clf))


@app.route('/')
def home():
    return render_template("index.html")


@app.route('/digits')
def digits_class():
    return render_template("digits.html")


@app.route('/recognizer', methods=['POST'])
def recognize():
    data = request.get_json(silent=True)['image']
    data = data[22:]

    img = skio.imread(BytesIO(base64.b64decode(data)))[:, :, 3]

    img = make_mnist(img)

    number = clf.predict(img.reshape(1, -1))[0]

    return make_response(str(number), 200)


if __name__ == '__main__':
    app.run(debug=True)
