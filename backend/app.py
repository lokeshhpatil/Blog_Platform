from flask import Flask, jsonify
import os
from dotenv import load_dotenv
from flask_cors import CORS

from extensions import init_extensions
from extensions import mongo

load_dotenv()

def create_app():
    app = Flask(__name__)

    app.config["MONGO_URI"] = os.getenv("MONGO_URI")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

    # Enable CORS for frontend (Vercel)
    CORS(app)

    init_extensions(app)

    print("DEBUG: mongo after init ->", type(mongo), getattr(mongo, "db", None))

    from blueprints.auth import auth_bp
    from blueprints.posts import posts_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(posts_bp, url_prefix="/api/posts")

    # Health check endpoint
    @app.route("/api/health")
    def health():
        return jsonify({"status": "OK"})

    return app


# IMPORTANT: expose app globally for Gunicorn
app = create_app()


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", debug=True, port=port)
