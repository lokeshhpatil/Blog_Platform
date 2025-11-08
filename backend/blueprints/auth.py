from flask import Blueprint,request,jsonify,current_app
from extensions import mongo
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token,jwt_required,get_jwt_identity
import datetime
from bson.objectid import ObjectId
import hashlib
import hmac
import secrets

auth_bp = Blueprint("auth",__name__)

##REGISTER 
@auth_bp.route("/register",methods=["POST"])
def register():
    data = request.get_json() or {}
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    if not (username and email and password):
        return jsonify({"msg":"username, email, and password are required"}),400
    
    users = mongo.db.users
    if users.find_one({"email": email}):
        return jsonify({"msg": "email already registered"}), 400
    
    hashed = generate_password_hash(password)
    res = users.insert_one({
        "username": username,
        "email": email,
        "password": hashed,
        "created_at": datetime.datetime.now()
    })
    return jsonify({"msg":"user created", "user_id": str(res.inserted_id)}),201


##LOGIN
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    if not (email and password):
        return jsonify({"msg": "email and password are required"}), 400

    users = mongo.db.users
    user = users.find_one({"email": email})
    if not user or not check_password_hash(user.get("password",""), password):
        return jsonify({"msg": "invalid credentials"}), 401

    access_token = create_access_token(identity=str(user["_id"]))
    return jsonify({
        "access_token": access_token,
        "user": {"id": str(user["_id"]), "username": user["username"], "email": user["email"]}
    }), 200


##VALIDATE
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    uid = get_jwt_identity()
    user = mongo.db.users.find_one({"_id": ObjectId(uid)}, {"password": 0})
    if not user:
        return jsonify({"msg": "not found"}), 404
    user["id"] = str(user["_id"])
    user.pop("_id", None)
    return jsonify(user)


def _hash_token(raw_token:str)->str:
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()

def _compare_hashesh(a:str,b:str)->bool:
    return hmac.compare_digest(a,b)

def generate_token(length:int=32)->str:
    return secrets.token_hex(length)


