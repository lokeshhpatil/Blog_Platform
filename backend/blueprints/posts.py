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


@posts_bp.route("/<post_id>", methods=["PUT"])
@jwt_required()
def update_post(post_id):
    user_id = get_jwt_identity()

    try:
        post = mongo.db.posts.find_one({"_id": ObjectId(post_id)})
    except Exception:
        return jsonify({"msg": "invalid id"}), 400
    if not post:
        return jsonify({"msg": "post not found"}), 404
    
    if str(post.get("author_id")) != str(user_id):
        return jsonify({"msg": "forbidden"}), 403
    
    is_json = request.content_type and request.content_type.startswith("application/json")
    
    updates = {}
    new_image_meta = None
    remove_old_image = False

    if is_json:
        data = request.get_json() or {}
        # Partial updates allowed
        if "title" in data:
            updates["title"] = (data.get("title") or "").strip()
        if "body" in data:
            updates["body"] = (data.get("body") or "").strip()
        if "tags" in data:
            updates["tags"] = data.get("tags") or []
        # To remove image explicitly via JSON you can send image: null
        if "image" in data and data.get("image") is None:
            updates["image"] = None
            # mark for removal of old image from Cloudinary if exists
            if post.get("image") and post["image"].get("public_id"):
                remove_old_image = True
    else:
        # multipart: accept form fields and optional file under 'image'
        title = request.form.get("title")
        body = request.form.get("body")
        tags = request.form.get("tags")
        if title is not None:
            updates["title"] = title.strip()
        if body is not None:
            updates["body"] = body.strip()
        if tags is not None:
            updates["tags"] = [t.strip() for t in tags.split(",") if t.strip()]

        file = request.files.get("image")
        # If file is provided, upload to Cloudinary and prepare image metadata
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
                # upload to Cloudinary
                upload_result = cloudinary.uploader.upload(
                    file,
                    folder="blog_platform/posts",
                    use_filename=True,
                    unique_filename=True,
                    resource_type="image",
                    transformation=[{"width": 1600, "crop": "limit"}]
                )
            except Exception as e:
                current_app.logger.exception("Cloudinary upload failed")
                return jsonify({"msg": f"upload error: {str(e)}"}), 500
            
            new_image_meta = {
                "url": upload_result.get("secure_url") or upload_result.get("url"),
                "public_id": upload_result.get("public_id"),
                "width": upload_result.get("width"),
                "height": upload_result.get("height"),
                "size": upload_result.get("bytes"),
                "format": upload_result.get("format"),
            }
            updates["image"] = new_image_meta
            # mark to remove old image if present
            if post.get("image") and post["image"].get("public_id"):
                remove_old_image = True

    # Basic validation: we don't allow empty title/body after update if not intentionally removing
    if "title" in updates and not updates["title"]:
        return jsonify({"msg": "title cannot be empty"}), 400
    if "body" in updates and not updates["body"]:
        return jsonify({"msg": "body cannot be empty"}), 400

    if updates:
        updates["updated_at"] = datetime.datetime.utcnow()
        mongo.db.posts.update_one({"_id": ObjectId(post_id)}, {"$set": updates})

    # If requested to remove old image, delete it from Cloudinary
    if remove_old_image:
        old_img = post.get("image") or {}
        public_id = old_img.get("public_id")
        if public_id:
            try:
                cloudinary.uploader.destroy(public_id, invalidate=True, resource_type="image")
            except Exception as e:
                # log but do not fail the request: post already updated in DB
                current_app.logger.exception(f"failed to delete old image {public_id}: {e}")

    # Return updated post
    updated = mongo.db.posts.find_one({"_id": ObjectId(post_id)})
    updated["id"] = str(updated["_id"])
    updated.pop("_id", None)
    return jsonify(updated), 200


@posts_bp.route("/<post_id>", methods=["DELETE"])
@jwt_required()
def delete_post(post_id):
    user_id = get_jwt_identity()

    try:
        post = mongo.db.posts.find_one({"_id":ObjectId(post_id)})
    except Exception:
        return jsonify({"msg": "invalid id in delete_posts"}),400
    if not post:
        return jsonify({"msg": "no post found"}),404
    
    if str(post.get("author_id")) != str(user_id):
        return jsonify({"msg":"only owner can delete the posts!, forbidden"}),403
    
    image = post.get("image") or {}
    public_id = image.get("public_id")

    if public_id:
        try:
            cloudinary.uploader.destroy(public_id, invalidate=True, resource_type="image")
            print(f"{public_id} Image delete successfull")
        except Exception as e:
            current_app.logger.exception(f"failed to delete image {public_id}: {e}")
            # we don't block deletion because of image deletion failure

    mongo.db.posts.delete_one({"_id": ObjectId(post_id)})

    return jsonify({"msg": "deleted"}), 200


##SEARCH

# returns top N search results using MongoDB text search, default top 5
@posts_bp.route("/search_top", methods=["GET"])
def search_top():
    """
    Query params:
      q: search query (required)
      limit: optional (default 5, max 20)
    Returns:
      { results: [ { id, title, body_snippet, author_id, image, score, created_at }, ... ] }
    """
    # mongo = current_app.extensions["pymongo"]
    q = (request.args.get("q") or "").strip()
    if not q:
        return jsonify({"results": []}), 200

    try:
        limit = int(request.args.get("limit", 5))
    except ValueError:
        limit = 5
    limit = max(1, min(limit, 20))

    # Primary approach: use $text (requires text index on title, body, tags)
    # Score is available via {"score": {"$meta": "textScore"}}
    try:
        proj = {
            "title": 1,
            "body": 1,
            "author_id": 1,
            "image": 1,
            "created_at": 1,
            "score": {"$meta": "textScore"}
        }
        cursor = mongo.db.posts.find({"$text": {"$search": q}}, proj)
        cursor = cursor.sort([("score", {"$meta": "textScore"}), ("created_at", -1)]).limit(limit)

        results = []
        for p in cursor:
            # create short snippet from body (first 180 chars)
            body = p.get("body", "") or ""
            snippet = body[:180].rsplit(" ", 1)[0]  # avoid cutting mid-word
            results.append({
                "id": str(p["_id"]),
                "title": p.get("title"),
                "body_snippet": snippet,
                "author_id": p.get("author_id"),
                "image": p.get("image"),
                "score": p.get("score"),
                "created_at": p.get("created_at")
            })

        return jsonify({"results": results}), 200

    except Exception as e:
        # Fallback: if text index isn't present or $text fails, use case-insensitive regex on title/body
        current_app.logger.info("Text search failed, falling back to regex search: %s", e)
        try:
            regex = {"$regex": q, "$options": "i"}
            filt = {"$or": [{"title": regex}, {"body": regex}, {"tags": regex}]}
            cursor = mongo.db.posts.find(filt, {"title":1,"body":1,"author_id":1,"image":1,"created_at":1}).sort("created_at", -1).limit(limit)
            results = []
            for p in cursor:
                body = p.get("body", "") or ""
                snippet = body[:180].rsplit(" ", 1)[0]
                results.append({
                    "id": str(p["_id"]),
                    "title": p.get("title"),
                    "body_snippet": snippet,
                    "author_id": p.get("author_id"),
                    "image": p.get("image"),
                    "score": None,
                    "created_at": p.get("created_at")
                })
            return jsonify({"results": results}), 200
        except Exception as e2:
            current_app.logger.exception("Search fallback failed: %s", e2)
            return jsonify({"results": []}), 500
      
    
