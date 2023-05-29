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

def verificacionToken(jti):
    jti #Identificador del JWT (es más corto)
    print("jit", jti)
    token = TokenBlockedList.query.filter_by(token=jti).first()

    if token is None:
        return False
    
    return True

#API USERS --------------------------------------------------------------------------------------------------------------

@api.route('/user', methods=['GET'])
def handle_hello():
    users = User.query.all()  #<User Antonio>
    users = list(map(lambda item: item.serialize(), users)) #{name:Antonio, password:123, ....} {name:Usuario2, password:123.... }
    print(users)
  
    return jsonify(users), 200

@api.route('/get-user', methods=['POST'])
def get_specific_user2():
    body = request.get_json()   
    id = body["id"]

    user = User.query.get(id)   
  
    return jsonify(user.serialize()), 200

@api.route('/delete-user', methods=['DELETE'])
def delete_specific_user():
    body = request.get_json()   
    id = body["id"]

    user = User.query.get(id) 

    db.session.delete(user)
    db.session.commit()  
  
    return jsonify("Usuario borrado"), 200

@api.route('/edit-user', methods=['PUT'])
def edit_user():
    body = request.get_json()   
    id = body["id"]
    name = body["name"]

    user = User.query.get(id)   
    user.name = name #modifique el nombre del usuario

    db.session.commit()
  
    return jsonify(user.serialize()), 200

#APIS DE PEOPLE --------------------------------------------

@api.route('/get-people/<int:id>', methods=['GET'])
def get_specific_people(id):
    people = People.query.get(id)
    
    return jsonify(people.serialize()), 200

@api.route('/get-people', methods=['POST'])
def get_specific_people2():
    body = request.get_json()
    id = body['id']
    
    people = People.query.get(id)

    return jsonify(people.serialize()), 200 

@api.route('/delete-people', methods=['DELETE'])
def delete_specific_people():
    body = request.get_json()
    id = body['id']
    
    people = People.query.get(id)

    db.session.delete(people)
    db.session.commit

    return jsonify("Person successfully deleted!"), 200 

@api.route('/edit-people', methods=['PUT'])
def edit_people():
    body = request.get_json()
    id = body['id']
    name = body["name"]

    people = User.query.get(id)
    people.name = name
    
    db.session.commit()

    return jsonify(people.serialize()), 200 

#APIS DE PLANET --------------------------------------------

@api.route('/get-planet/<int:id>', methods=['GET'])
def get_specific_planet(id):
    planets = Planets.query.get(id)
    
    return jsonify(planets.serialize()), 200

@api.route('/get-planet', methods=['POST'])
def get_specific_planet2():
    body = request.get_json()
    id = body['id']
    
    planets = Planets.query.get(id)

    return jsonify(planet.serialize()), 200 

@api.route('/delete-planet', methods=['DELETE'])
def delete_specific_planet():
    body = request.get_json()
    id = body['id']
    
    planets = Planets.query.get(id)

    db.session.delete(planet)
    db.session.commit

    return jsonify("Planet successfully deleted!"), 200 

@api.route('/edit-planet', methods=['PUT'])
def edit_planet():
    body = request.get_json()
    id = body['id']
    name = body["name"]

    planets = Planets.query.get(id)
    planets.name = name
    
    db.session.commit()

    return jsonify(planets.serialize()), 200 

#APIS DE VEHICLE --------------------------------------------

@api.route('/get-vehicle/<int:id>', methods=['GET'])
def get_specific_vehicle(id):
    vehicles = Vehicles.query.get(id)
    
    return jsonify(vehicles.serialize()), 200

@api.route('/post-vehicle', methods=['POST'])
def get_specific_vehicle2():
    body = request.get_json()
    id = body['id']
    
    vehicles = Vehicles.query.get(id)

    return jsonify(vehicles.serialize()), 200 

@api.route('/delete-vehicle', methods=['DELETE'])
def delete_specific_vehicle():
    body = request.get_json()
    id = body['id']
    
    vehicles = Vehicles.query.get(id)

    db.session.delete(vehicles)
    db.session.commit

    return jsonify("Vehicle successfully deleted!"), 200 

@api.route('/put-vehicle', methods=['PUT'])
def edit_vehicle():
    body = request.get_json()
    id = body['id']
    name = body["name"]

    vehicles = Vehicles.query.get(id)
    vehicles.name = name
    
    db.session.commit()

    return jsonify(vehicles.serialize()), 200 

#APIS FAVORITES PEOPLE --------------------------------------------
@api.route('/add-favorite/people', methods=['POST'])
def add_favorite_people():
    body = request.get_json()
    user_id = body["user_id"]
    people_id = body["people_id"]

    character = People.query.get(people_id) #cuando encuentra el primero, detiene la busqueda => .first()
    if not character: #validacion de errores, obligatorio
        raise APIException('Character Not Found', status_code=404)
    
    user = User.query.get(user_id)
    if not user:
        raise APIException('Favorite Character Not Found', status_code=404)

    fav_exist = FavoritePeople.query.filter_by(user_id = user.id, people_id = character.id).first() is not None
    
    if fav_exist:
        raise APIException('This character already exists on the user s Favorite List', status_code=404)

    favorite_people = FavoritePeople(user_id=user.id, people_id=character.id)
    db.session.add(favorite_people)
    db.session.commit()

    return jsonify(favorite_people.serialize()), 201

#APIS FAVORITES PLANET --------------------------------------------

@api.route('/add-favorite/planet', methods=['POST'])
def add_favorite_planet():
    body = request.get_json()
    user_id = body['user_id']
    planet_id = body['planet_id']

    planets = Planets.query.get(planet_id) #cuando encuentra el primero, detiene la busqueda => .first()
    if not planets: #validacion de errores, obligatorio
        raise APIException('Planet not found', status_code=404)
    
    user = User.query.get(user_id)
    if not user:
        raise APIException('User not found', status_code=404)

    favoriteplanet_exist = FavoritePlanet.query.filter_by(user_id = user.id, planet_id = planets.id).first() is not None
    
    if favoriteplanet_exist:
        raise APIException('Favorite planet already exists in user account', status_code=404)

    favorite_planets = FavoritePlanet(user_id = user.id, planet_id = planets.id)
    db.session.add(favorite_planets)
    db.session.commit()

    return jsonify(favorite_planets.serialize()), 201

#APIS FAVORITES VEHICLE --------------------------------------------

@api.route('/add-favorite/vehicle', methods=['POST'])
def add_favorite_vehicle():
    body = request.get_json()
    user_id = body['user_id']
    vehicle_id = body['vehicle_id']

    vehicles = Vehicles.query.get(vehicle_id) #cuando encuentra el primero, detiene la busqueda => .first()
    if not vehicles: #validacion de errores, obligatorio
        raise APIException('Vehicle not found', status_code=404)
    
    user = User.query.get(user_id)
    if not user:
        raise APIException('User not found', status_code=404)

    favoritevehicle_exist = FavoriteVehicle.query.filter_by(user_id = user.id, vehicle_id = vehicles.id).first() is not None
    
    if favoritevehicle_exist:
        raise APIException('Favorite vehicle already exists in user account', status_code=404)

    favorite_vehicles = FavoriteVehicle(user_id = user.id, vehicle_id = vehicles.id)
    db.session.add(favorite_vehicles)
    db.session.commit()

    return jsonify(favorite_vehicles.serialize()), 201

#APIS FAVORITES ALL --------------------------------------------

@api.route('/favorites', methods=['POST'])
@jwt_required()
def list_favorites():
    body = request.get_json()
    user_id = body["user_id"]
    if not user_id:
        raise APIException('Data missing', status_code=404)
    
    user = User.query.get(user_id)

    if not user:
        raise APIException('User Not Found', status_code=404)

    user_favorites = FavoritePeople.query.filter_by(user_id = user.id).all() #nos devuelve todas las coincidencias
    user_favorites_final = list(map(lambda item: item.serialize(), user_favorites))

    user_favorites_planets = FavoritePlanet.query.filter_by(user_id = user.id).all()
    user_favorites_final_planets = list(map(lambda item: item.serialize(), user_favorites_planets))

    user_favorites_vehicles = FavoriteVehicle.query.filter_by(user_id = user.id).all()
    user_favorites_final_vehicles = list(map(lambda item: item.serialize(), user_favorites_vehicles))
    
    user_favorites_final = user_favorites_final + user_favorites_final_planets + user_favorites_final_vehicles

    return jsonify(user_favorites_final), 201

#PROTECTED ------------------------------------------------------------------------------------------------------------

@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    user = User.query.get(current_user)

    #token = TokenBlockedList.query.filter_by(token = jti) #verificar si el token no esta bloqueado
    token = verificacionToken(get_jwt()["jti"]) #reuso la función de verificacion de token
    print(token)

    if token:
       raise APIException('Token is black-listed', status_code=404)

    print("User name: ", user.name)
    return jsonify({"message":"ou are in a protected route", "name": user.name}), 200