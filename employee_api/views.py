import logging
import pymysql
from pyramid.view import view_config
from pyramid.response import Response
from .models import User
import jwt
import time
from sqlalchemy.exc import SQLAlchemyError
from employee_api.models import DBSession, User
from webob import Response
log = logging.getLogger(__name__)

# MySQL configuration
MYSQL_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'tiger',
    'database': 'employee_db5',
    'autocommit': True,  # Critical for immediate visibility
    'read_timeout': 10,
    'write_timeout': 10,
    'charset': 'utf8mb4'
}

def get_db_connection():
    """Create direct MySQL connection with immediate consistency"""
    return pymysql.connect(**MYSQL_CONFIG)

@view_config(route_name='employees', request_method='GET', renderer='json', permission='authenticated')
def get_employees(request):
    log.info("Listing all employees")
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            # Force fresh read with new connection
            cursor.execute("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED")
            cursor.execute("""
                SELECT id, name, position, salary, department
                FROM employees
                WHERE user_id = %s
                ORDER BY id DESC
            """, (request.user_id,))

            employees = cursor.fetchall()
        return {'employees': employees}
    except pymysql.Error as e:
        log.error(f"MySQL error: {str(e)}")
        return Response(status=500, json_body={'error': 'Failed to fetch employees'})
    finally:
        if conn:
            conn.close()

@view_config(route_name='employees', request_method='POST', renderer='json', permission='authenticated')
def create_employee(request):
    log.info("Creating new employee")
    data = request.json_body
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED")
            cursor.execute("""
                INSERT INTO employees (name, position, salary, department, user_id)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                data['name'],
                data.get('position', ''),
                data.get('salary', 0),
                data.get('department', ''),
                request.user_id  # 👈 Add this
            ))

            employee_id = cursor.lastrowid
            # Immediate fetch for consistency
            cursor.execute("SELECT * FROM employees WHERE id = %s", (employee_id,))
            new_employee = cursor.fetchone()
        return {
            'id': new_employee[0],
            'name': new_employee[1],
            'position': new_employee[2],
            'salary': new_employee[3],
            'department': new_employee[4]
        }
    except pymysql.Error as e:
        log.error(f"MySQL error: {str(e)}")
        return Response(status=500, json_body={'error': 'Failed to create employee'})
    finally:
        if conn:
            conn.close()

@view_config(route_name='employee', request_method='PATCH', renderer='json', permission='authenticated')
def update_employee(request):
    try:
        employee_id = int(request.matchdict['id'])
    except (TypeError, ValueError, KeyError):
        return Response(status=400, json_body={'error': 'Invalid employee ID'})

    log.info(f"Updating employee with ID: {employee_id}")
    data = request.json_body
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED")

            # Ensure employee belongs to the authenticated user
            cursor.execute(
                "SELECT * FROM employees WHERE id = %s AND user_id = %s",
                (employee_id, request.user_id)
            )
            employee = cursor.fetchone()
            if not employee:
                log.warning(f"Unauthorized update or employee not found: ID={employee_id}, User={request.user_id}")
                return Response(status=404, json_body={'error': 'Not found'})

            # Build dynamic update
            updates = []
            params = []
            for field in ['name', 'position', 'salary', 'department']:
                if field in data:
                    updates.append(f"{field} = %s")
                    params.append(data[field])

            if not updates:
                return Response(status=400, json_body={'error': 'No fields to update'})

            params.extend([employee_id, request.user_id])
            query = f"""
                UPDATE employees
                SET {', '.join(updates)}
                WHERE id = %s AND user_id = %s
            """
            cursor.execute(query, tuple(params))

            if cursor.rowcount == 0:
                return Response(status=404, json_body={'error': 'Update failed or unauthorized'})

            # Fetch updated employee
            cursor.execute("SELECT * FROM employees WHERE id = %s", (employee_id,))
            updated_employee = cursor.fetchone()

            return {
                'id': updated_employee['id'],
                'name': updated_employee['name'],
                'position': updated_employee['position'],
                'salary': updated_employee['salary'],
                'department': updated_employee['department']
            }

    except pymysql.Error as e:
        log.error(f"MySQL error: {str(e)}")
        return Response(status=500, json_body={'error': 'Update failed'})
    finally:
        if conn:
            conn.close()

@view_config(route_name='employee', request_method='DELETE', renderer='json', permission='authenticated')
def delete_employee(request):
    try:
        employee_id = int(request.matchdict['id'])
    except (TypeError, ValueError, KeyError):
        return Response(status=400, json_body={'error': 'Invalid employee ID'})
    
    log.info(f"Deleting employee with ID: {employee_id}")
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED")
            cursor.execute("DELETE FROM employees WHERE id = %s AND user_id = %s", (employee_id, request.user_id))

            if cursor.rowcount == 0:
                log.warning(f"Employee not found: {employee_id}")
                return Response(status=404, json_body={'error': 'Not found'})
            return Response(status=200, json_body={
                'status': 'deleted',
                'id': employee_id
            })
    except pymysql.Error as e:
        log.error(f"MySQL error: {str(e)}")
        return Response(status=500, json_body={'error': 'Delete failed'})
    finally:
        if conn:
            conn.close()

# User management remains unchanged
@view_config(route_name='register', request_method='POST', renderer='json') # type: ignore
def register(request):
    log.info("Registering new user") # type: ignore
    data = request.json_body

    required_fields = ['username', 'email', 'password']
    if not all(field in data for field in required_fields):
        log.warning("Missing required fields in registration")
        return Response(status=400, json_body={'error': 'Missing required fields'})

    session = DBSession()  # ✅ Use global DBSession
    try:
        existing = session.query(User).filter(User.username == data['username']).first()
        if existing:
            log.warning(f"Username already exists: {data['username']}")
            return Response(status=400, json_body={'error': 'Username exists'})

        new_user = User(username=data['username'], email=data['email'])
        new_user.hash_password(data['password'])

        session.add(new_user)
        session.commit()  # ✅ Single commit

        log.info(f"User registered with ID: {new_user.id}")
        return Response(status=201, json_body={
            'status': 'success',
            'user_id': new_user.id
        })
    except SQLAlchemyError as e: # type: ignore
        session.rollback()
        log.error(f"Database error during registration: {str(e)}")
        return Response(status=500, json_body={'error': 'Registration failed'})
    finally:
        session.close()  # ✅ Always close your session

@view_config(route_name='login', request_method='POST', renderer='json')
def login(request):
    log.info("User login attempt")
    session = request.dbsession
    data = request.json_body
    
    try:
        user = session.query(User).filter(User.username == data['username']).first()
        
        if not user or not user.verify_password(data['password']):
            log.warning("Invalid login credentials")
            return Response(status=401, json_body={'error': 'Invalid credentials'})
        
        token = jwt.encode(
            {'sub': str(user.id)},
            request.registry.settings['jwt.secret'],
            algorithm=request.registry.settings['jwt.algorithm']
        )
        
        log.info(f"User logged in, token issued for user ID: {user.id}")
        return {
            'status': 'success',
            'token': token
        }
    except SQLAlchemyError as e:
        log.error(f"Database error during login: {str(e)}")
        return Response(status=500, json_body={'error': 'Login failed'})

@view_config(route_name='logout', request_method='POST', renderer='json')
def logout(request):
    log.info("User logout")
    return {'status': 'logged out'}