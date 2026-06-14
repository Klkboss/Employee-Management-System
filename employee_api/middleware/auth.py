import logging
import jwt
from pyramid.httpexceptions import HTTPUnauthorized
from ..models import User

log = logging.getLogger(__name__)

def jwt_auth_tween_factory(handler, registry):
    def jwt_auth_tween(request):
        # Skip OPTIONS preflight requests entirely
        if request.method == 'OPTIONS':
            log.debug("Skipping JWT check for OPTIONS preflight request")
            return handler(request)
            
        public_paths = ['/api/register', '/api/login', '/api/logout']
        log.debug(f"Request path: {request.path}")
        
        if request.path in public_paths:
            log.info(f"Skipping JWT check for public path: {request.path}")
            return handler(request)
            
        auth_header = request.headers.get('Authorization', '')
        log.debug(f"Authorization header: {auth_header[:20]}...")
        
        if not auth_header.startswith('JWT '):
            log.warning("Missing or invalid Authorization header")
            return HTTPUnauthorized(json_body={'error': 'Missing or invalid token'})
            
        try:
            token = auth_header.split(' ')[1]
            log.debug(f"Token received: {token[:10]}...")
            
            payload = jwt.decode(
                token,
                request.registry.settings['jwt.secret'],
                algorithms=[request.registry.settings['jwt.algorithm']]
            )
            user_id = payload.get('sub')
            if not user_id:
                log.warning("Invalid token payload: no sub claim")
                return HTTPUnauthorized(json_body={'error': 'Invalid token payload'})
                
            dbsession = request.dbsession
            user = dbsession.query(User).filter(User.id == int(user_id)).first()
            if not user:
                log.warning(f"Token user ID {user_id} does not exist in DB")
                return HTTPUnauthorized(json_body={'error': 'User does not exist'})
                
            request.user_id = int(user_id)
            log.info(f"Authenticated user ID: {request.user_id}")
            
        except jwt.ExpiredSignatureError:
            log.error("Token expired")
            return HTTPUnauthorized(json_body={'error': 'Token expired'})
        except Exception as e:
            log.exception(f"JWT validation error: {e}")
            return HTTPUnauthorized(json_body={'error': 'Invalid token'})
            
        return handler(request)
    return jwt_auth_tween
