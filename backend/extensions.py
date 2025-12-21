# backend/extensions.py
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# single instances to import across app
mongo = PyMongo()
jwt = JWTManager()

def init_extensions(app):
    # config should be set on app before calling this
    mongo.init_app(app)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
