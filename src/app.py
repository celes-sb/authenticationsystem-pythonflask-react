"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity, get_jwt
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

from datetime import date, time, datetime, timezone, timedelta

from flask_bcrypt import Bcrypt #librería para encriptaciones

from flask_cors import CORS
from api.utils import APIException, generate_sitemap
from api.models import db, User, People, Planets, Vehicles, FavoritePeople, FavoritePlanet, FavoriteVehicle, TokenBlockedList
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

from api.extensions import jwt, bcrypt
#from models import Person

ENV = os.getenv("FLASK_ENV")
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# Setup JWT
app.config["JWT_SECRET_KEY"] = os.getenv("FLASK_APP_KEY")
jwt.init_app(app)
#jwt = JWTManager(app)

#Setup Bcrypt
bcrypt.init_app(app)
#bcrypt = Bcrypt(app) #inicio mi instancia de bcrypt

app.url_map.strict_slashes = False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

MIGRATE = Migrate(app, db, compare_type = True)
db.init_app(app)

# Allow CORS requests to this API
CORS(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0 # avoid cache memory
    return response

def verificacionToken(jti):
    jti #Identificador del JWT (es más corto)
    print("jit", jti)
    token = TokenBlockedList.query.filter_by(token=jti).first()

    if token is None:
        return False
    
    return True

#API USERS --------------------------------------------------------------------------------------------------------------

@app.route('/user', methods=['GET'])
def handle_hello():
    users = User.query.all()  #<User Antonio>
    users = list(map(lambda item: item.serialize(), users)) #{name:Antonio, password:123, ....} {name:Usuario2, password:123.... }
    print(users)
  
    return jsonify(users), 200

@app.route('/register', methods=['POST'])
def register_user():
    #recibir el body en json, des-jsonificarlo y almacenarlo en la variable body
    body = request.get_json() #request.json() pero hay que importar request y json

    #ordernar cada uno de los campos recibidos
    email = body["email"]
    name = body["name"]
    password = body["password"]
    is_active = body["is_active"]

    #validaciones
    if body is None:
        raise APIException("You need to specify the request body as json object", status_code=400)
    if "email" not in body:
        raise APIException("You need to specify the email", status_code=400)
    if 'name' not in body:
        raise APIException('You need to specify the name', status_code=400)
    if 'password' not in body:
        raise APIException('You need to specify the password', status_code=400)
    if 'is_active' not in body:
        raise APIException('You need to specify if user is active or not', status_code=400)
    
     #agregamos cadena extra a nuestra password (password, 10) y todo eso se encripta - recomendado minimo es 10
    password_encrypted = bcrypt.generate_password_hash(password,10).decode("utf-8") #porque se pueden poner emoticones incluso

    #estructura para almacenar datos de usuarios nuevos
    #creada la clase User en la variable new_user
    new_user = User(email=email, name=name, password=password_encrypted, is_active=is_active)

    #comitear la sesión
    db.session.add(new_user) #agregamos el nuevo usuario a la base de datos
    db.session.commit() #guardamos los cambios en la base de datos

    return jsonify({"mensaje":"Usuario creado correctamente"}), 201 

@app.route('/get-user/<int:id>', methods=['GET'])
def get_specific_user(id):
    user = User.query.get(id)    
  
    return jsonify(user.serialize()), 200

@app.route('/get-user', methods=['POST'])
def get_specific_user2():
    body = request.get_json()   
    id = body["id"]

    user = User.query.get(id)   
  
    return jsonify(user.serialize()), 200

@app.route('/delete-user', methods=['DELETE'])
def delete_specific_user():
    body = request.get_json()   
    id = body["id"]

    user = User.query.get(id) 

    db.session.delete(user)
    db.session.commit()  
  
    return jsonify("Usuario borrado"), 200

@app.route('/edit-user', methods=['PUT'])
def edit_user():
    body = request.get_json()   
    id = body["id"]
    name = body["name"]

    user = User.query.get(id)   
    user.name = name #modifique el nombre del usuario

    db.session.commit()
  
    return jsonify(user.serialize()), 200

#APIS DE PEOPLE --------------------------------------------

@app.route('/get-people/<int:id>', methods=['GET'])
def get_specific_people(id):
    people = People.query.get(id)
    
    return jsonify(people.serialize()), 200

@app.route('/get-people', methods=['POST'])
def get_specific_people2():
    body = request.get_json()
    id = body['id']
    
    people = People.query.get(id)

    return jsonify(people.serialize()), 200 

@app.route('/delete-people', methods=['DELETE'])
def delete_specific_people():
    body = request.get_json()
    id = body['id']
    
    people = People.query.get(id)

    db.session.delete(people)
    db.session.commit

    return jsonify("Person successfully deleted!"), 200 

@app.route('/edit-people', methods=['PUT'])
def edit_people():
    body = request.get_json()
    id = body['id']
    name = body["name"]

    people = User.query.get(id)
    people.name = name
    
    db.session.commit()

    return jsonify(people.serialize()), 200 

#APIS DE PLANET --------------------------------------------
"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity, get_jwt
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

from datetime import date, time, datetime, timezone, timedelta

from flask_bcrypt import Bcrypt #librería para encriptaciones

from flask_cors import CORS
from api.utils import APIException, generate_sitemap
from api.models import db, User, People, Planets, Vehicles, FavoritePeople, FavoritePlanet, FavoriteVehicle, TokenBlockedList
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

from api.extensions import jwt, bcrypt
#from models import Person

ENV = os.getenv("FLASK_ENV")
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# Setup JWT
app.config["JWT_SECRET_KEY"] = os.getenv("FLASK_APP_KEY")
jwt.init_app(app)
#jwt = JWTManager(app)

#Setup Bcrypt
bcrypt.init_app(app)
#bcrypt = Bcrypt(app) #inicio mi instancia de bcrypt

app.url_map.strict_slashes = False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

MIGRATE = Migrate(app, db, compare_type = True)
db.init_app(app)

# Allow CORS requests to this API
CORS(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0 # avoid cache memory
    return response

def verificacionToken(jti):
    jti #Identificador del JWT (es más corto)
    print("jit", jti)
    token = TokenBlockedList.query.filter_by(token=jti).first()

    if token is None:
        return False
    
    return True

#API USERS --------------------------------------------------------------------------------------------------------------

@app.route('/user', methods=['GET'])
def handle_hello():
    users = User.query.all()  #<User Antonio>
    users = list(map(lambda item: item.serialize(), users)) #{name:Antonio, password:123, ....} {name:Usuario2, password:123.... }
    print(users)
  
    return jsonify(users), 200

@app.route('/register', methods=['POST'])
def register_user():
    #recibir el body en json, des-jsonificarlo y almacenarlo en la variable body
    body = request.get_json() #request.json() pero hay que importar request y json

    #ordernar cada uno de los campos recibidos
    email = body["email"]
    name = body["name"]
    password = body["password"]
    is_active = body["is_active"]

    #validaciones
    if body is None:
        raise APIException("You need to specify the request body as json object", status_code=400)
    if "email" not in body:
        raise APIException("You need to specify the email", status_code=400)
    if 'name' not in body:
        raise APIException('You need to specify the name', status_code=400)
    if 'password' not in body:
        raise APIException('You need to specify the password', status_code=400)
    if 'is_active' not in body:
        raise APIException('You need to specify if user is active or not', status_code=400)
    
     #agregamos cadena extra a nuestra password (password, 10) y todo eso se encripta - recomendado minimo es 10
    password_encrypted = bcrypt.generate_password_hash(password,10).decode("utf-8") #porque se pueden poner emoticones incluso

    #estructura para almacenar datos de usuarios nuevos
    #creada la clase User en la variable new_user
    new_user = User(email=email, name=name, password=password_encrypted, is_active=is_active)

    #comitear la sesión
    db.session.add(new_user) #agregamos el nuevo usuario a la base de datos
    db.session.commit() #guardamos los cambios en la base de datos

    return jsonify({"mensaje":"Usuario creado correctamente"}), 201 

@app.route('/get-user/<int:id>', methods=['GET'])
def get_specific_user(id):
    user = User.query.get(id)    
  
    return jsonify(user.serialize()), 200

@app.route('/get-user', methods=['POST'])
def get_specific_user2():
    body = request.get_json()   
    id = body["id"]

    user = User.query.get(id)   
  
    return jsonify(user.serialize()), 200

@app.route('/delete-user', methods=['DELETE'])
def delete_specific_user():
    body = request.get_json()   
    id = body["id"]

    user = User.query.get(id) 

    db.session.delete(user)
    db.session.commit()  
  
    return jsonify("Usuario borrado"), 200

@app.route('/edit-user', methods=['PUT'])
def edit_user():
    body = request.get_json()   
    id = body["id"]
    name = body["name"]

    user = User.query.get(id)   
    user.name = name #modifique el nombre del usuario

    db.session.commit()
  
    return jsonify(user.serialize()), 200

#APIS DE PEOPLE --------------------------------------------

@app.route('/get-people/<int:id>', methods=['GET'])
def get_specific_people(id):
    people = People.query.get(id)
    
    return jsonify(people.serialize()), 200

@app.route('/get-people', methods=['POST'])
def get_specific_people2():
    body = request.get_json()
    id = body['id']
    
    people = People.query.get(id)

    return jsonify(people.serialize()), 200 

@app.route('/delete-people', methods=['DELETE'])
def delete_specific_people():
    body = request.get_json()
    id = body['id']
    
    people = People.query.get(id)

    db.session.delete(people)
    db.session.commit

    return jsonify("Person successfully deleted!"), 200 

@app.route('/edit-people', methods=['PUT'])
def edit_people():
    body = request.get_json()
    id = body['id']
    name = body["name"]

    people = User.query.get(id)
    people.name = name
    
    db.session.commit()

    return jsonify(people.serialize()), 200 

#APIS DE PLANET --------------------------------------------

@app.route('/get-planet/<int:id>', methods=['GET'])
def get_specific_planet(id):
    planets = Planets.query.get(id)
    
    return jsonify(planets.serialize()), 200

@app.route('/get-planet', methods=['POST'])
def get_specific_planet2():
    body = request.get_json()
    id = body['id']
    
    planets = Planets.query.get(id)

    return jsonify(planet.serialize()), 200 

@app.route('/delete-planet', methods=['DELETE'])
def delete_specific_planet():
    body = request.get_json()
    id = body['id']
    
    planets = Planets.query.get(id)

    db.session.delete(planet)
    db.session.commit

    return jsonify("Planet successfully deleted!"), 200 

@app.route('/edit-planet', methods=['PUT'])
def edit_planet():
    body = request.get_json()
    id = body['id']
    name = body["name"]

    planets = Planets.query.get(id)
    planets.name = name
    
    db.session.commit()

    return jsonify(planets.serialize()), 200 

#APIS DE VEHICLE --------------------------------------------

@app.route('/get-vehicle/<int:id>', methods=['GET'])
def get_specific_vehicle(id):
    vehicles = Vehicles.query.get(id)
    
    return jsonify(vehicles.serialize()), 200

@app.route('/post-vehicle', methods=['POST'])
def get_specific_vehicle2():
    body = request.get_json()
    id = body['id']
    
    vehicles = Vehicles.query.get(id)

    return jsonify(vehicles.serialize()), 200 

@app.route('/delete-vehicle', methods=['DELETE'])
def delete_specific_vehicle():
    body = request.get_json()
    id = body['id']
    
    vehicles = Vehicles.query.get(id)

    db.session.delete(vehicles)
    db.session.commit

    return jsonify("Vehicle successfully deleted!"), 200 

@app.route('/put-vehicle', methods=['PUT'])
def edit_vehicle():
    body = request.get_json()
    id = body['id']
    name = body["name"]

    vehicles = Vehicles.query.get(id)
    vehicles.name = name
    
    db.session.commit()

    return jsonify(vehicles.serialize()), 200 

#APIS FAVORITES PEOPLE --------------------------------------------
@app.route('/add-favorite/people', methods=['POST'])
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

@app.route('/add-favorite/planet', methods=['POST'])
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

@app.route('/add-favorite/vehicle', methods=['POST'])
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

@app.route('/favorites', methods=['POST'])
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

#LOGIN ------------------------------------------------------------------------------------------------------------
@app.route('/login', methods=['POST'])
def login():
    email=request.get_json()["email"]
    password = request.get_json()["password"]

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"message":"Login failed"}), 401
    
    """ if password != user.password:
        return jsonify({"message":"Login failed"}), 401 """

    #validar el password encriptado
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message":"Login failed"}), 401
    
    access_token = create_access_token(identity=user.id)
    return jsonify({"token":access_token}), 200

@app.route("/protected", methods=["GET"])
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

#LOGOUT ---------------------------------------------------------------------------------------------------------------
@app.route("/logout", methods=["GET"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"] #Identificador del JWT (es más corto)
    now = datetime.now(timezone.utc) 

    #identificamos al usuario
    current_user = get_jwt_identity()
    user = User.query.get(current_user)

    tokenBlocked = TokenBlockedList(token=jti , created_at=now, email=user.email)
    db.session.add(tokenBlocked)
    db.session.commit()

    return jsonify({"message":"Logout successful!"})

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)