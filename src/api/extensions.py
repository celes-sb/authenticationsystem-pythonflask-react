import os
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

from flask_bcrypt import Bcrypt

# Setup the Flask-JWT-Extended extension
jwt = JWTManager()

# Setup Bcrypt
bcrypt = Bcrypt()
