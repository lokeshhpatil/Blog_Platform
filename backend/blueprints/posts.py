from flask import Blueprint, request, jsonify,current_app
# from extensions import mongo
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
import datetime
import cloudinary
import cloudinary.uploader
import os
from extensions import mongo
posts_bp = Blueprint("posts", __name__)


cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret_key=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

ALLOWED_EXT = {"png", "jpg", "jpeg", "webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def allowed_file(filename):
    return "." in filename and filename.rsplit(".",1)[1].lower() in ALLOWED_EXT 

##CREATE POST
@posts_bp.route("/", methods=["POST"])
@jwt_required()
def create_post():
    # mongo = current_app.extensions["mongo"]
    user_id = get_jwt_identity()

    if request.content_type and request.content_type.startswith("application/json"):
        data = request.get_json() or {}
        title = (data.get("title") or "").strip()
        body = (data.get("body") or "").strip()
        tags = data.get("tags", [])
        image_meta = data.get("image")
    else:
        title = (request.form.get("title") or "").strip()
        body = (request.form.get("body") or "").strip()
        tags = (request.form.get("tag") or "").strip()
        if tags:
            tags = [t.strip() for t in tags.split(",") if t.strip()]
        else:
            tags = []
        
        file = request.files.get("image")
        image_meta = None

        
        if file:
            filename = file.filename or ""
            if not allowed_file(filename):
                return jsonify({"msg": "invalid image type"}), 400
            
            file.seek(0, os.SEEK_END)
            size = file.tell()
            file.seek(0)
            if size > current_app.config.get("MAX_FILE_SIZE", MAX_FILE_SIZE):
                return jsonify({"msg": "file too large"}), 400
            

            try:
                upload_result = cloudinary.uploader.upload(
                file,
                folder="blog_platform/posts",
                use_filename=True,
                unique_filename=True,
                resource_type="image",
                transformation=[{"width": 1600, "crop": "limit"}]
                )
                print("Cloudinary upload result:", upload_result)
            except Exception as e:
    # debug: print full exception
                import traceback
                traceback.print_exc()
                return jsonify({"msg": f"upload error: {str(e)}"}), 500

            
            image_meta = {
                "url": upload_result.get("secure_url") or upload_result.get("url"),
                "public_id": upload_result.get("public_id"),
                "width": upload_result.get("width"),
                "height": upload_result.get("height"),
                "size": upload_result.get("bytes"),
                "format": upload_result.get("format"),
            }

    if not title or not body:
        return jsonify({"msg": "title and body are required"}), 400
    

    post = {
        "title": title,
        "body": body,
        "author_id": user_id,
        "tags": tags,
        "image": image_meta,
        "created_at": datetime.datetime.utcnow(),
        "updated_at": None
    }
    res = mongo.db.posts.insert_one(post)
    post_id = str(res.inserted_id)
    post["id"] = post_id
    post.pop("_id", None)
    return jsonify(post), 201 


##GET LIST OF POSTS
@posts_bp.route("/", methods=["GET"])
def list_posts():
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 10))
    skip = (page - 1) * per_page
    cursor = mongo.db.posts.find().sort("created_at", -1).skip(skip).limit(per_page)
    posts = []
    for p in cursor:
        p["id"] = str(p["_id"])
        p.pop("_id", None)
        posts.append(p)
    return jsonify({"posts": posts, "page": page})



##GET POST BY UID
@posts_bp.route("/<post_id>", methods=["GET"])
def get_post(post_id):
    try:
        p = mongo.db.posts.find_one({"_id": ObjectId(post_id)})
    except:
        return jsonify({"msg": "invalid id"}), 400
    if not p:
        return jsonify({"msg": "not found"}), 404
    p["id"] = str(p["_id"])
    p.pop("_id", None)
    return jsonify(p)


