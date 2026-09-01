import base64
import json

import requests
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allows the Next.js frontend (different port) to call this API


@app.route("/api/skin/<username>", methods=["GET"])
def get_skin(username):
    # Step 1: username -> UUID
    profile_res = requests.get(
        f"https://api.mojang.com/users/profiles/minecraft/{username}"
    )
    if profile_res.status_code != 200:
        return jsonify({"error": "Username not found"}), 404

    uuid = profile_res.json()["id"]

    # Step 2: UUID -> profile (includes base64-encoded skin texture data)
    session_res = requests.get(
        f"https://sessionserver.mojang.com/session/minecraft/profile/{uuid}"
    )
    if session_res.status_code != 200:
        return jsonify({"error": "Could not fetch profile"}), 502

    textures_property = session_res.json()["properties"][0]["value"]
    decoded = json.loads(base64.b64decode(textures_property))
    skin_url = decoded["textures"]["SKIN"]["url"]

    return jsonify({"username": username, "uuid": uuid, "skin_url": skin_url})


if __name__ == "__main__":
    app.run(debug=True, port=8000)