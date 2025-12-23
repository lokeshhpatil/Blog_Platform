from flask import Blueprint,request,jsonify,current_app
from extensions import mongo
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token,jwt_required,get_jwt_identity
import datetime
from bson.objectid import ObjectId
import hashlib
import hmac
import secrets
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os
import urllib.parse

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

def _generate_token(length:int=32)->str:
    return secrets.token_hex(length)

def _not_utc():
    return datetime.datetime.now(datetime.timezone.utc)

##THIS IS WHERE EMAIL IS GET TRIGGERED

def send_reset_email_sendgrid(to_email:str,reset_url:str,user_name:str=""):
    api_key=os.getenv("SENDGRID_API_KEY")
    from_email = os.getenv("FROM_EMAIL")
    from_name = os.getenv("FROM_NAME")
    template_id = os.getenv("SENDGRID_TEMPLATE_RESET_ID")

    if not api_key:
        print("⚠️ Missing SendGrid API key or template ID")
        print("Reset link:", reset_url)
        current_app.logger.warning("SENDGRID_API_KEY not set. Reset URL: %s", reset_url)
        return jsonify({"msg":"problem in sendgrid api env variables"})
    
    
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>We received a request to reset your password. Click the button below to choose a new password.</p>
        <p style="text-align: center; margin: 30px 0;">
            <a href="{reset_url}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        </p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p><a href="{reset_url}">{reset_url}</a></p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">This link expires in 1 hour. If you did not request a password reset, you can safely ignore this email.</p>
    </div>
    """

    message = Mail(
        from_email=(from_email, from_name),
        to_emails=to_email,
        subject="Reset Your Password",
        html_content=html_content
    )

    # message.template_id = template_id
    # message.dynamic_template_data = {
    #     "user_name": user_name or to_email.split("@")[0].capitalize(),
    #     "reset_url": reset_url,
    # }

    try:
        sg=SendGridAPIClient(api_key)
        resp=sg.send(message)
        current_app.logger.info("SendGrid response: status=%s", resp.status_code)
    except Exception as e:
        current_app.logger.exception("SendGrid send failed: %s", e)

@auth_bp.route("/request_reset",methods=["POST"])
def request_reset_password():
    data=request.get_json() or {}
    email=(data.get("email")or"")
    if not email:
        return jsonify({"msg":"If an account exists, you will receive a reset email"})
    
    users = mongo.db.users
    user = users.find_one({"email":email})

    if user:
        raw_token = _generate_token(32)   # 64 hex chars
        token_hash = _hash_token(raw_token)
        expires_at = _not_utc() + datetime.timedelta(hours=1)

        users.update_one({"_id": user["_id"]}, {"$set": {
            "reset_password_token": token_hash,
            "reset_password_expires": expires_at
        }})

        frontend_base = os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")
        encoded_email = urllib.parse.quote(email)
        reset_path = f"/reset-password?token={raw_token}&email={encoded_email}"
        reset_url = frontend_base + reset_path
        
        print(f"DEBUG: Generated Reset URL: {reset_url}")

        try:
            send_reset_email_sendgrid(email, reset_url)
        except Exception:
            # Log already handled inside helper
            pass

    return jsonify({"msg": "If an account exists, you will receive a reset email"}), 200


@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    token = (data.get("token") or "").strip()
    new_password = data.get("password") or ""

    if not email or not token or not new_password:
        return jsonify({"msg": "email, token and password are required"}), 400

    users = mongo.db.users
    user = users.find_one({"email": email})
    if not user:
        return jsonify({"msg": "Invalid token or expired"}), 400
    
    stored_hash = user.get("reset_password_token")
    expires_at = user.get("reset_password_expires")
    if not stored_hash or not expires_at:
        return jsonify({"msg": "Invalid token or expired"}), 400

    if expires_at < _not_utc():
        return jsonify({"msg": "Token expired"}), 400

    if not _compare_hashesh(_hash_token(token), stored_hash):
        return jsonify({"msg": "Invalid token or expired"}), 400
    
    new_pw_hash = generate_password_hash(new_password)
    users.update_one({"_id": user["_id"]}, {"$set": {"password": new_pw_hash}, "$unset": {
        "reset_password_token": "", "reset_password_expires": ""
    }})

    return jsonify({"msg": "Password updated"}), 200


