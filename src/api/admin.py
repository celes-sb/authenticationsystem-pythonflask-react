import os
from flask_admin import Admin
from .models import db, User, People, Planets, Vehicles, FavoritePeople, FavoritePlanet, FavoriteVehicle, TokenBlockedList
from .favoritos import Favoritos
from flask_admin.contrib.sqla import ModelView
from flask_admin.menu import MenuCategory, MenuView, MenuLink

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')
    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(People, db.session))
    admin.add_view(ModelView(Planets, db.session))
    admin.add_view(ModelView(Vehicles, db.session))
    admin.add_view(ModelView(FavoritePeople, db.session))
    admin.add_view(ModelView(FavoritePlanet, db.session))
    admin.add_view(ModelView(FavoriteVehicle, db.session))
    admin.add_view(ModelView(TokenBlockedList, db.session))
    