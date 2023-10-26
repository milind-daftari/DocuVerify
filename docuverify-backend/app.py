from flask import Flask, request, jsonify
import magic
import os

app = Flask(__name__)

ALLOWED_EXTENSIONS = {'pdf'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify(error="No file part"), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify(error="No selected file"), 400

    if file and allowed_file(file.filename):
        mime = magic.from_buffer(file.read(), mime=True)
        file.seek(0)  # reset file pointer to beginning

        if mime != "application/pdf":
            return jsonify(error="Invalid file type"), 400

        if os.path.getsize(file.filename) > MAX_FILE_SIZE:
            return jsonify(error="File size exceeds the limit of 5 MB"), 400

        # Here you'd typically save the file or process it.
        # For now, we'll just return a success message.

        return jsonify(success=True, message="File successfully uploaded")

    return jsonify(error="File type not allowed"), 400


if __name__ == '__main__':
    app.run(debug=True)
