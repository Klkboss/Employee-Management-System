from pyramid.config import Configurator
from pyramid.authorization import ACLAuthorizationPolicy
from pyramid.security import Allow, Authenticated, Everyone
from .middleware.auth import jwt_auth_tween_factory

from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker, scoped_session

from .models import Base, DBSession  # ✅ Import global DBSession
from pyramid.events import NewRequest
from pyramid.response import Response
from zope.sqlalchemy import register

class JWTAuthenticationPolicy:
    def authenticated_userid(self, request):
        return getattr(request, 'user_id', None)

    def effective_principals(self, request):
        principals = [Everyone]
        if self.authenticated_userid(request):
            principals.append(Authenticated)
        return principals

class RootFactory:
    __acl__ = [
        (Allow, Authenticated, 'authenticated'),
    ]
    def __init__(self, request):
        pass

def main(global_config, **settings):
    config = Configurator(settings=settings, root_factory=RootFactory)

    # Auth setup
    config.set_authentication_policy(JWTAuthenticationPolicy())
    config.set_authorization_policy(ACLAuthorizationPolicy())

    # Engine and DB setup
    engine = engine_from_config(settings, 'sqlalchemy.')
    Base.metadata.create_all(engine)

    # Request-bound session (with Zope integration)
    dbmaker = scoped_session(sessionmaker(bind=engine))
    register(dbmaker)  # Pyramid-managed transactions
    config.registry.dbmaker = dbmaker
    config.add_request_method(lambda r: r.registry.dbmaker(), 'dbsession', reify=True)

    # ✅ Bind global DBSession for external use
    DBSession.configure(bind=engine)

    # CORS
    def add_cors_headers_response_callback(event):
        def cors_headers(request, response):
            response.headers.update({
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DELETE,PATCH',
                'Access-Control-Allow-Headers': 'Authorization,Content-Type,X-Requested-With',
                'Access-Control-Max-Age': '1728000',
            })
        event.request.add_response_callback(cors_headers)

    config.add_subscriber(add_cors_headers_response_callback, NewRequest)

    # Preflight handler
    def options_view(request):
        return Response()

    config.add_route('options_route', '/{path:.*}', request_method='OPTIONS')
    config.add_view(options_view, route_name='options_route')

    # Routes
    config.add_route('employees', '/api/employees')
    config.add_route('employee', '/api/employees/{id}')
    config.add_route('register', '/api/register')
    config.add_route('login', '/api/login')
    config.add_route('logout', '/api/logout')

    # JWT Middleware
    config.add_tween(
        'employee_api.middleware.auth.jwt_auth_tween_factory',
        under='pyramid.tweens.excview_tween_factory'
    )

    config.scan('.views')
    return config.make_wsgi_app()
