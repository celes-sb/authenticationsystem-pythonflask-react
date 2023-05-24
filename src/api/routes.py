"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, Blueprint, current_app
from api.models import db, User, People, Planets, Vehicles, FavoritePeople, FavoriteVehicle, FavoritePlanet, TokenBlockedList
from api.favoritos import Favoritos
from api.utils import generate_sitemap, APIException

from api.extensions import jwt, bcrypt
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from flask_jwt_extended import create_access_token
from flask_jwt_extended import JWTManager
from datetime import datetime


api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    password_encrypted = bcrypt.generate_password_hash("123",10).decode("utf-8")
    response_body = {
        "message": password_encrypted
    }

    return jsonify(response_body), 200

@api.route('/hola', methods=['POST', 'GET'])
def handle_hola():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/signup', methods=['POST'])
def register_user():
    body = request.get_json()
    name = body["name"]
    username = body["username"]
    email = body["email"]
    password = body["password"]
    print(name)
    
    if body is None:
        raise APIException("You need to specify the request body as json object", status_code=400)
    if "username" not in body:
        raise APIException("You need to specify the username", status_code=400)
    if "name" not in body:
        raise APIException("You need to specify the name", status_code=400)
    if "email" not in body:
        raise APIException("You need to specify the email", status_code=400)
    if "password" not in body:
        raise APIException("You need to specify the password", status_code=400)
    
    user = User.query.filter_by(email=email).first()
    if user is not None:
        raise APIException("Email is already registered", status_code=409)
    
    password_encrypted = bcrypt.generate_password_hash(password,10).decode("utf-8")
    
    new_user = User(email=email, username=username, name=name, password=password_encrypted, is_active=1)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg":"User successfully created"}), 201

@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    email = body["email"]
    password = body["password"]
    
    if "email" not in body:
        raise APIException("You need to specify the email", status_code=400)

    if "password" not in body:
        raise APIException("You need to specify the password", status_code=400)

    user = User.query.filter((User.email == email) | (User.username == email)).first()

    if user is None:
        return jsonify({"message": "Login failed"}), 401
    
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Login failed"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({"token": access_token}), 200

@api.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    now = datetime.utcnow()

    current_user = get_jwt_identity()
    user = User.query.get(current_user)

    tokenBlocked = TokenBlockedList(token=jti, created_at=now, email=user.email)
    db.session.add(tokenBlocked)
    db.session.commit()

    return jsonify({"message": "Logout successful"})

@api.route('/user/<int:id>', methods=['GET'])
@jwt_required()
def get_specific_user(id):
    user = User.query.get(id)    
  
    return jsonify(user.serialize()), 200

@api.route('/getuser', methods=['GET'])
def get_user():
    id = request.args.get('id')
    email = request.args.get('email')
    username = request.args.get('username')
    name = request.args.get('name')
    users = User.query
    if id:
        users = users.filter_by(id=id)
    if username:
        users = users.filter_by(username=username)
    if email:
        users = users.filter_by(email=email)
    if name:
        users = users.filter_by(name=name)
    users = users.all()
    print(users)
    users=list(map(lambda item: item.serialize(), users))
    return jsonify(users)