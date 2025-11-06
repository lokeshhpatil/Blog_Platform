from flask import Flask,jsonify
import os
from dotenv import load_dotenv
from extensions import init_extensions
from extensions import mongo


load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config["MONGO_URI"]=os.getenv("MONGO_URI")
    app.config["JWT_SECRET_KEY"]=os.getenv("JWT_SECRET_KEY")

    init_extensions(app)
    print("DEBUG: mongo after init ->", type(mongo), getattr(mongo, "db", None))

    from blueprints.auth import auth_bp
    from blueprints.posts import posts_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(posts_bp, url_prefix="/api/posts")

##CHECKING API STATUS
    @app.route("/api/health")
    def health():
        return jsonify({"status":"OK"})
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(port=5000,debug=True)